import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CATEGORY_EXCEPTION } from './category.constraints';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany({
      select: {
        name: true,
      },
    });
  }
  async findOne(name: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (!category) {
      throw new HttpException(
        CATEGORY_EXCEPTION.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    return category;
  }
}
