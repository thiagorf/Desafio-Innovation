import { Module } from '@nestjs/common';
import { MunicipalitiesService } from './municipalities.service';
import { MunicipalitiesController } from './municipalities.controller';

@Module({
  providers: [MunicipalitiesService],
  controllers: [MunicipalitiesController]
})
export class MunicipalitiesModule {}
