// src/modules/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: '',
        category: '',
      };
      const mockProduct = { id: 1, ...createProductDto };


      jest.spyOn(prisma.product, 'create').mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({ data: createProductDto });

    });  });

  describe('getAllProducts', () => {
    it('should return an array of products with pagination and filtering', async () => {
      const queryDto: GetProductsQueryDto = {
        page: 1,
        limit: 10,
        sort: 'price',
        order: 'asc',
        category: '',
      };
      const mockProducts = [{ id: 1, name: 'Product 1', price: 100 }];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      const result = await service.getAllProducts(queryDto);
      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: queryDto.category ? { category: queryDto.category } : {},
        orderBy: { [queryDto.sort]: queryDto.order },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a product if it exists', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const mockProduct = { id: 1, name: 'Updated Product', price: 100 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateProductDto,
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Product' })).rejects.toThrow(NotFoundException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a product if it exists', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });
});
