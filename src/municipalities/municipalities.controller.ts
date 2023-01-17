import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MunicipalitiesService } from './municipalities.service';
import { MUNICIPALITY_EXCEPTION } from './municipalities.constraints';

@ApiTags('municipalities')
@Controller('municipalities')
export class MunicipalitiesController {
  constructor(private municipalitiesService: MunicipalitiesService) {}

  @Post(':municipality_id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: MUNICIPALITY_EXCEPTION.INVALID,
  })
  async findMunicipalities(@Param('municipality_id') municipality_id: string) {
    return await this.municipalitiesService.findMunicipalities(
      +municipality_id,
    );
  }
}
