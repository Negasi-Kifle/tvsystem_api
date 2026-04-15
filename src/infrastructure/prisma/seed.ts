import 'dotenv/config';
import { prisma } from './prisma.client.js';

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function seedCategoriesAndSubCategories(): Promise<void> {
  const categoriesData = [
    { name: 'Finance', subCategories: [{ name: 'BANK', isCustom: false }] },
    { name: 'Food', subCategories: [{ name: 'Food', isCustom: false }] },
  ];

  for (const cat of categoriesData) {
    const nameSlug = slugify(cat.name);
    const category = await prisma.category.upsert({
      where: { nameSlug },
      create: { name: cat.name, nameSlug },
      update: {},
    });

    for (const sub of cat.subCategories) {
      const subSlug = slugify(sub.name);
      await prisma.subCategory.upsert({
        where: {
          categoryId_nameSlug: { categoryId: category.id, nameSlug: subSlug },
        },
        create: {
          categoryId: category.id,
          name: sub.name,
          nameSlug: subSlug,
          isCustom: sub.isCustom,
        },
        update: {},
      });
    }
  }
}

/** Minimal customers used only to satisfy show_segment_slots (showId + customerId). */
async function seedCustomersForSegmentSlots(): Promise<string[]> {
  const businessRefs = ['SEED-SS-001', 'SEED-SS-002', 'SEED-SS-003'];
  const ids: string[] = [];
  for (const businessRef of businessRefs) {
    const customer = await prisma.customer.upsert({
      where: { businessRef },
      create: {
        businessRef,
        name: `Seed advertiser ${businessRef}`,
      },
      update: {},
    });
    ids.push(customer.id);
  }
  return ids;
}

async function seedShowSegmentSlots(): Promise<void> {
  const showTitles = [
    'ሰለሜ ሰለሜ',
    'Chef Z',
    'Feta Show',
    'Mese Show',
    'Dinknesh Africa',
    'Hello Abbay',
    'Metenfesha (Solomon Bogale)',
    'Foto ena Chewata',
    'Washu Ende',
    'Mesenko',
    'Guramayle',
    'Man Yikenes',
    'Sekela Talk Show',
    'ሃሰሳ የፌደል ጨዋታ',
    'የበኩር ፍርድ',
    'ዓባይ ዜና',
    'KINGS OF ABBAY',
  ];

  const customerIds = await seedCustomersForSegmentSlots();

  for (const title of showTitles) {
    const titleSlug = slugify(title);
    await prisma.show.upsert({
      where: { titleSlug },
      create: {
        title,
        titleSlug,
        type: 'InHouse',
        durationMinutes: 60,
        maxAdLengthMinutes: 15,
        totalDurationMinutes: 75,
        partsCount: 1,
        rerunsCount: 0,
        bonusCount: 0,
      },
      update: {},
    });
  }

  for (const title of showTitles) {
    const show = await prisma.show.findFirst({
      where: { title },
    });
    if (!show) continue;

    for (let i = 0; i < customerIds.length; i++) {
      const customerId = customerIds[i]!;
      await prisma.showSegmentSlot.upsert({
        where: {
          showId_customerId: { showId: show.id, customerId },
        },
        create: {
          showId: show.id,
          customerId,
        },
        update: {},
      });
    }
  }
}

async function main(): Promise<void> {
  await seedCategoriesAndSubCategories();
  await seedShowSegmentSlots();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
