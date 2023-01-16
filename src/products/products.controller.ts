import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PRODUCTS_EXCEPTION } from './products.constraints';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PRODUCTS_EXCEPTION.INVALID,
  })
  @ApiBody({ type: [CreateProductDto] })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PRODUCTS_EXCEPTION.INVALID,
  })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PRODUCTS_EXCEPTION.INVALID,
  })
  @ApiBody({ type: [UpdateProductDto] })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: PRODUCTS_EXCEPTION.INVALID,
  })
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
