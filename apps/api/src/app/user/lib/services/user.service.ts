import {
  ConflictException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { DataService, Prisma } from '@api/data';

import type { IUserCreateDto } from '../interfaces';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DataService) {}

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    return user;
  }

  async updateUser(
    userId: string,
    payload: Omit<Prisma.UserUpdateInput, 'email'>
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: payload
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    return user;
  }

  async getUserStore(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        ownerId: userId
      }
    });

    return store;
  }

  async findOne(where: Prisma.UserWhereInput) {
    const user = await this.prisma.user.findFirst({ where });
    return user;
  }

  async findAndCount() {
    const results = await this.prisma.$transaction([
      this.prisma.user.findMany(),
      this.prisma.user.count()
    ]);

    return results;
  }

  async getByCredentials(creds: { email: string; password: string }) {
    const { email, password } = creds;

    return this.prisma.user.findFirst({
      where: {
        email,
        credentials: {
          passwordHash: password
        }
      }
    });
  }

  async create(dto: IUserCreateDto) {
    const user = await this.findByEmail(dto.email);

    if (user) {
      throw new ConflictException();
    }

    return this.prisma.user
      .create({
        data: {
          email: dto.email,
          finishedOnboarding: false,
          currentOnboardingStep: 1,
          credentials: {
            create: {
              passwordHash: dto.password
            }
          }
        }
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ForbiddenException('Credentials incorrect');
        }
        throw error;
      });
  }

  async getUserByResetToken(token: string) {
    const credentials = await this.prisma.credentials.findFirst({
      where: {
        resetPasswordToken: token
      },
      include: {
        user: true
      }
    });

    return credentials?.user ?? null;
  }
}
