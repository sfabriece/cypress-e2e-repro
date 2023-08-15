import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUserId, Public } from '@api/common';
import { StoreService } from '@api/store';

import { CreatePetDto, ExtendedPetDto, FullPetDto, UpdatePetDto } from '../dto';
import { PetService } from '../services';

const PET_NOT_FOUND = 'Pet not found';
const STORE_NOT_FOUND = 'Store not found';

@ApiTags('Pets')
@Controller('pets')
@ApiBearerAuth()
export class PetController {
  private readonly logger = new Logger(PetController.name);

  constructor(
    private readonly storeService: StoreService,
    private readonly petService: PetService
  ) {}

  @Get('/view/:petId')
  @Public()
  @HttpCode(HttpStatus.OK)
  public async getPublicPet(
    @Param('petId') petId: string
  ): Promise<FullPetDto> {
    const pet = await this.petService.getPetById(petId);

    if (!pet) {
      this.logger.error(PET_NOT_FOUND);
      throw new NotFoundException(PET_NOT_FOUND);
    }

    return pet;
  }

  @Get('/')
  @ApiOkResponse({
    description: 'Get store pets',
    type: ExtendedPetDto,
    isArray: true
  })
  @HttpCode(HttpStatus.OK)
  public async getStorePets(
    @CurrentUserId() userId: string
  ): Promise<ExtendedPetDto[]> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      this.logger.error(STORE_NOT_FOUND);
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    return await this.petService.getStorePets(store.id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async addStorePet(
    @CurrentUserId() userId: string,
    @Body() payload: CreatePetDto
  ): Promise<ExtendedPetDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    return await this.petService.addStorePet(store.id, userId, {
      ...payload
    });
  }

  @Put('/:petId')
  @HttpCode(HttpStatus.OK)
  public async updateStorePet(
    @CurrentUserId() userId: string,
    @Param('petId') petId: string,
    @Body() payload: UpdatePetDto
  ): Promise<ExtendedPetDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    const pet = await this.petService.getStorePetById(store.id, petId);

    if (!pet) {
      throw new NotFoundException(PET_NOT_FOUND);
    }

    if (pet.status !== 'DRAFT') {
      throw new BadRequestException('Only draft pets can be updated');
    }

    const updatedPet = await this.petService.updateStorePet(
      store.id,
      petId,
      payload
    );

    return updatedPet!;
  }

  @Delete('/:petId')
  @HttpCode(HttpStatus.OK)
  public async DeletePet(
    @CurrentUserId() userId: string,
    @Param('petId') petId: string
  ): Promise<ExtendedPetDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    const pet = await this.petService.getStorePetById(store.id, petId);

    if (!pet) {
      throw new NotFoundException(PET_NOT_FOUND);
    }

    if (pet.status !== 'DRAFT') {
      throw new BadRequestException('Only draft pets can be deleted');
    }

    const deletedPet = await this.petService.deletePet(petId);

    return deletedPet!;
  }

  @Post('/:petId/submit')
  @HttpCode(HttpStatus.CREATED)
  public async submitPet(
    @CurrentUserId() userId: string,
    @Param('petId') petId: string
  ): Promise<ExtendedPetDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    const pet = await this.petService.getStorePetById(store.id, petId);

    if (!pet) {
      throw new NotFoundException(PET_NOT_FOUND);
    }

    if (pet.status === 'SUBMITTED') {
      throw new BadRequestException('pet already submitted');
    }

    if (pet.status === 'RETURNED') {
      throw new BadRequestException('pet already returned');
    }

    const submittedPet = await this.petService.submitPet(petId);

    return submittedPet!;
  }
}
