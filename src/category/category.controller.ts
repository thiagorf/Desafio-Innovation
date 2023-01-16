import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CATEGORY_EXCEPTION } from './category.constraints';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK })
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':name')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CATEGORY_EXCEPTION.INVALID,
  })
  async findOne(@Param('name') name: string) {
    return await this.categoryService.findOne(name);
  }
}
