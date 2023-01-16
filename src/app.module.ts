import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MunicipalitiesModule } from './municipalities/municipalities.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    PrismaModule,
    MunicipalitiesModule,
  ],
})
export class AppModule {}
