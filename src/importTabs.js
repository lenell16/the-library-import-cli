import prismaPkg from '@prisma/client';
import jsome from 'jsome';
import pMapSeries from 'p-map-series';
import { identity } from 'ramda';

const { PrismaClient } = prismaPkg;

const prisma = new PrismaClient();

function importCategory(category) {
  console.log('On: ' + category.title);
  return prisma.category.create({
    data: category,
    include: {
      links: true,
    },
  });
}

export default function importTabs(categories) {
  return pMapSeries(categories, importCategory);
}
