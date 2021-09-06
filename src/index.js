const { PrismaClient } = require('@prisma/client');
const jsome = require('jsome');

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  const tabs = await prisma.category.create({
    data: {
      title: 'tsg',
      type: 'upnp',
      links: { connectOrCreate },
    },
  });
  // jsome(tabs);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
