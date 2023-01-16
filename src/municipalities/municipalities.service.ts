import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MUNICIPALITY_EXCEPTION } from './municipalities.constraints';
import axios from 'axios';

@Injectable()
export class MunicipalitiesService {
  constructor(private prisma: PrismaService) {}

  async findMunicipalities(municipality_id: number) {
    const { data } = await axios.get(process.env.IBGE_URL + municipality_id);

    const { id, name } = data;

    const municipalityExists = await this.prisma.municipality.findUnique({
      where: {
        id,
      },
    });

    if (municipalityExists) {
      throw new HttpException(
        MUNICIPALITY_EXCEPTION.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const municipality = await this.prisma.municipality.create({
      data: {
        id,
        name,
      },
    });

    return municipality;
  }
}
