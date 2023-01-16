import { ApiProperty } from '@nestjs/swagger';
import { Category, STATUS } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: STATUS,
    description: 'choose between active or inactive',
  })
  @IsEnum(STATUS)
  status: STATUS;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    type: [String],
  })
  @IsString({ each: true })
  category: string[];
}
