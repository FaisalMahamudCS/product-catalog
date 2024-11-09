import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetProductsQueryDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async getAllProducts(query: GetProductsQueryDto): Promise<Product[]> {
    const { page, limit, sort, order, category } = query;

    return this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: category ? { category } : {},
      orderBy: { [sort]: order },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
