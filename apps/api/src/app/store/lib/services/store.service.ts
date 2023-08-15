import { Injectable } from '@nestjs/common';

import { DataService, type Store } from '@api/data';

import type { ICreateStore, IStore, IUpdateStore } from '../interfaces';

const mapStoreToIStore = (store: Store): IStore => {
  return {
    id: store.id,
    name: store.name,
    organizationNumber: store.organizationNumber,
    contactEmail: store.contactEmail,
    phone: store.phone,
    address: {
      streetAddress: store.streetAddress,
      city: store.city,
      postalCode: store.postalCode,
      country: store.country
    },
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    ownerId: store.ownerId
  };
};
@Injectable()
export class StoreService {
  constructor(private readonly prisma: DataService) {}

  async getUserStore(ownerId: string): Promise<IStore | null> {
    const store = await this.prisma.store.findFirst({
      where: {
        ownerId
      }
    });

    if (!store) {
      return null;
    }

    return mapStoreToIStore(store);
  }

  async createStore(
    ownerId: string,
    payload: ICreateStore & { email: string | null; phone: string | null }
  ): Promise<IStore> {
    const store = await this.prisma.store.create({
      data: {
        ownerId,
        name: payload.name,
        organizationNumber: payload.organizationNumber.toString(),
        streetAddress: payload.address.streetAddress,
        city: payload.address.city,
        postalCode: payload.address.postalCode?.toString(),
        country: payload.address.country,
        contactEmail: payload.email,
        phone: payload.phone
      }
    });

    return mapStoreToIStore(store);
  }

  async updateStore(
    storeId: string,
    payload: IUpdateStore
  ): Promise<IStore | null> {
    const store = await this.prisma.store.update({
      where: {
        id: storeId
      },
      data: {
        name: payload.name,
        organizationNumber: payload.organizationNumber?.toString(),
        streetAddress: payload.address?.streetAddress,
        city: payload.address?.city,
        postalCode: payload.address?.postalCode?.toString(),
        country: payload.address?.country
      }
    });

    if (!store) {
      return null;
    }

    return mapStoreToIStore(store);
  }

  async storeExistsByName(name: string): Promise<boolean> {
    const store = await this.prisma.store.findFirst({
      where: {
        name
      }
    });

    return !!store;
  }
}
