// src/product/dto/get-products-query.dto.ts
import { IsInt, IsOptional, IsString, IsIn, Min, Max } from 'class-validator';

export class GetProductsQueryDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsString()
  @IsIn(['price', 'createdAt'])
  sort: 'price' | 'createdAt';

  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  category?: string;
}
