import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCTS_EXCEPTION } from './products.constraints';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private productSelect = {
    id: true,
    name: true,
    status: true,
    quantity: true,
    created_at: true,
    updated_at: true,
    category: true,
  };

  private createCategoryWhere(categories: string[]) {
    const formatCategory = categories.map((ct) => {
      return {
        connectOrCreate: {
          where: {
            name: ct,
          },
          create: {
            name: ct,
          },
        },
      };
    });

    const category = Object.assign({}, ...formatCategory);

    return category;
  }

  async create(createProductDto: CreateProductDto) {
    const { category, ...productData } = createProductDto;

    const connectOrCreateData = this.createCategoryWhere(category);

    console.log(connectOrCreateData);

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        category: connectOrCreateData,
      },
      select: this.productSelect,
    });

    return product;
  }

  async findAll() {
    return await this.prisma.product.findMany({
      select: this.productSelect,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product || product.deleted_at !== null) {
      throw new HttpException(
        PRODUCTS_EXCEPTION.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { deleted_at, ...formattedProduct } = product;

    return formattedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product || product.deleted_at !== null) {
      throw new HttpException(
        PRODUCTS_EXCEPTION.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { category, ...productData } = updateProductDto;

    const connectOrCreateData = this.createCategoryWhere(category);

    const [_, updatedCategory] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: {
          id,
        },
        data: {
          category: {
            disconnect: [...product.category],
          },
        },
      }),
      this.prisma.product.update({
        where: {
          id,
        },
        data: {
          ...productData,
          category: connectOrCreateData,
        },
      }),
    ]);

    const { deleted_at, ...updatedProduct } = updatedCategory;

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product || product.deleted_at !== null) {
      throw new HttpException(
        PRODUCTS_EXCEPTION.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const softDeleteProduct = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return softDeleteProduct;
  }
}
