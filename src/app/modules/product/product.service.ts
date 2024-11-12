import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
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

  async remove(id: number): Promise<void> {
    // Check if the product exists
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Delete the product from the database
    await this.prisma.product.delete({ where: { id } });

    // Remove the product list cache to ensure updated data on next fetch
  }
}
