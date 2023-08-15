import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DataService
  extends PrismaClient
  implements OnModuleInit, BeforeApplicationShutdown
{
  logger = new Logger(DataService.name);

  constructor() {
    super({
      // log: [
      //   {
      //     emit: 'event',
      //     level: 'query',
      //   },
      // ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on(
      'query' as never,
      async (event: { duration: number; query: string }) => {
        this.logger.debug(`(${event.duration}ms) ${event.query}`);
      }
    );
  }

  async beforeApplicationShutdown() {
    this.logger.debug(`Shutting down, disconnecting from database...`);
    await this.$disconnect();
    this.logger.debug(`Disconnected from database`);
  }

  async truncate() {
    if (process.env['NODE_ENV'] !== 'test') {
      this.logger.debug(`NOT CI: Skipping truncate`);
      return;
    }

    const records = await this.$queryRawUnsafe<
      Array<Record<'tablename', string>>
    >(`SELECT tablename
                                                          FROM pg_tables
                                                          WHERE schemaname = 'public'`);
    for (const record of records) {
      this.truncateTable(record['tablename']);
    }
  }

  async truncateTable(tablename: string) {
    if (
      process.env['NODE_ENV'] !== 'test' ||
      tablename === 'transaction_categories'
    ) {
      this.logger.debug(`NOT CI: Skipping truncate of ${tablename}`);
      return;
    }

    if (tablename === undefined || tablename === '_prisma_migrations') {
      return;
    }
    try {
      await this.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
      );
    } catch (error) {
      console.log({ error });
    }
  }
}
