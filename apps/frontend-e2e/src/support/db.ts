/* eslint-disable unicorn/prevent-abbreviations */
import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error']
  log: ['warn', 'error']
});

export async function emptyAndSeedDatabase() {
  try {
    const tablesToTruncate = Prisma.dmmf.datamodel.models.map(
      (model) => model.dbName || model.name
    );

    for (const table of tablesToTruncate) {
      await prisma.$executeRawUnsafe(`TRUNCATE "${table}" CASCADE;`);
    }

    // You can also re-seed your database here if necessary
    await seedDatabase();
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDatabase() {
  await addTestAccounts();
}

async function addTestAccounts() {
  // generate users with fake data using faker and array map
  const users = Array.from({ length: 8 }).map(() => {
    faker.seed(faker.number.int());

    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        allowSpecialCharacters: true
      }),
      password: 's3cret1234',
      phone: faker.phone.number('########'),
      company: {
        name: faker.company.name(),
        organizationNumber: faker.number.int({
          min: 100000000,
          max: 999999999
        }),
        streetAddress: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        country: faker.location.country()
      }
    };
  });

  await Promise.all(
    users.map(async (user) => {
      const hash = await argon.hash(user.password);

      return prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          finishedOnboarding: true,
          currentOnboardingStep: null,
          credentials: {
            create: {
              passwordHash: hash
            }
          },
          stores: {
            create: {
              name: user.company.name,
              organizationNumber: user.company.organizationNumber.toString(),
              streetAddress: user.company.streetAddress,
              city: user.company.city,
              postalCode: user.company.postalCode,
              country: user.company.country,
              contactEmail: user.email,
              phone: user.phone
            }
          }
        }
      });
    })
  );
}
