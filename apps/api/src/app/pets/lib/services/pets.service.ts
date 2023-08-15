import { Inject, Injectable } from '@nestjs/common';

import { DataService } from '@api/data';

import {
  AppConfiguration,
  appConfiguration
} from '../../../config/lib/app.configuration';
import type {
  ICreatePetDto,
  IExtendedPet,
  IFullPet,
  IUpdatePetDto
} from '../interfaces';

@Injectable()
export class PetService {
  constructor(
    @Inject(appConfiguration.KEY) readonly config: AppConfiguration,
    private readonly prisma: DataService
  ) {}

  async getStorePetById(
    storeId: string,
    petId: string
  ): Promise<IExtendedPet | null> {
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: petId,
        storeId
      }
    });

    return pet;
  }

  async getPetById(petId: string): Promise<IFullPet | null> {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id: petId
      }
    });

    return pet;
  }

  async updateStorePet(
    storeId: string,
    petId: string,
    payload: IUpdatePetDto
  ): Promise<IExtendedPet | null> {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id: petId
      }
    });

    if (!pet) {
      return null;
    }

    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId
      }
    });

    if (!store) {
      throw new Error('Store not found');
    }

    console.log('payload', payload);
    await this.prisma.pet.update({
      where: { id: petId },
      data: {
        description: payload.description,
        kind: payload.kind,
        submitDate: payload.submitDate,
        status: 'DRAFT'
      }
    });

    return await this.getStorePetById(storeId, petId);
  }

  async addStorePet(
    storeId: string,
    userId: string,
    payload: ICreatePetDto
  ): Promise<IExtendedPet> {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId
      }
    });

    if (!store) {
      throw new Error('Store not found');
    }

    const pet = await this.prisma.pet.create({
      data: {
        description: payload.description,
        status: 'DRAFT',
        kind: payload.kind,
        submitDate: payload.submitDate,
        storeId,
        userId
      }
    });

    return pet;
  }

  async getStorePets(storeId: string): Promise<IExtendedPet[]> {
    const pets = await this.prisma.pet.findMany({
      where: {
        storeId
      },
      orderBy: {
        number: 'desc'
      }
    });

    return pets;
  }

  async submitPet(petId: string): Promise<IExtendedPet | null> {
    const pet = await this.getPetById(petId);

    if (!pet) {
      return null;
    }

    const updatedPet = await this.prisma.pet.update({
      where: { id: petId },
      data: {
        status: 'SUBMITTED',
        number: {
          increment: 1
        }
      }
    });

    return updatedPet;
  }

  async deletePet(petId: string): Promise<IExtendedPet | null> {
    const pet = await this.prisma.pet.delete({
      where: {
        id: petId
      }
    });

    return pet;
  }
}
