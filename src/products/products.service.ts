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
      console.log(ct);
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

    console.log(formatCategory);

    const category = Object.assign({}, ...formatCategory);

    return category;
  }

  async create(createProductDto: CreateProductDto) {
    const { category, ...productData } = createProductDto;

    const categoriesWhere = category.map((ct) => {
      return {
        where: {
          name: ct,
        },
        create: {
          name: ct,
        },
      };
    });

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        category: {
          connectOrCreate: [...categoriesWhere],
        },
      },
      select: this.productSelect,
    });

    return product;
  }

  async findAll() {
    return await this.prisma.product.findMany({
      where: {
        deleted_at: null,
      },
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deleted_at, ...formattedProduct } = product;

    return formattedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
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

    const { category, ...productData } = updateProductDto;

    //const connectOrCreateData = this.createCategoryWhere(category);

    /*
    const categories = await this.prisma.category.findMany({
      where: {
        name: {
          in: category,
        },
      },
    });*/

    const mapCategory = category.map((ct) => ({ name: ct }));

    await this.prisma.category.createMany({
      skipDuplicates: true,
      data: [...mapCategory],
    });

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...productData,
        category: {
          set: [...mapCategory],
        },
      },
      select: this.productSelect,
    });

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
