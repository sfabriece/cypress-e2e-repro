import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Put
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '@api/common';
import { UserService } from '@api/user';

import { CreateStoreDto, StoreDto, UpdateStoreDto } from '../dto';
import { StoreService } from '../services';

const STORE_NOT_FOUND = 'Store not found';

@ApiTags('Store')
@Controller('store')
@ApiBearerAuth()
export class StoreController {
  private readonly logger = new Logger(StoreController.name);

  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async getUserStore(
    @CurrentUserId() userId: string
  ): Promise<StoreDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      this.logger.error(STORE_NOT_FOUND);
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    return store;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async createStore(
    @CurrentUserId() userId: string,
    @Body() payload: CreateStoreDto
  ): Promise<StoreDto> {
    const store = await this.storeService.getUserStore(userId);

    if (store) {
      throw new ConflictException('User already has a store');
    }

    const storeExists = await this.storeService.storeExistsByName(payload.name);

    if (storeExists) {
      throw new ConflictException('A store with that name already exists');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdStore = await this.storeService.createStore(userId, {
      ...payload,
      email: user.email,
      phone: user.phone
    });

    return createdStore;
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  public async updateStore(
    @CurrentUserId() userId: string,
    @Body() payload: UpdateStoreDto
  ): Promise<StoreDto> {
    const store = await this.storeService.getUserStore(userId);

    if (!store) {
      throw new NotFoundException(STORE_NOT_FOUND);
    }

    const updatedStore = await this.storeService.updateStore(store.id, payload);

    return updatedStore!;
  }
}
