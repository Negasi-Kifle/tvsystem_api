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

  const slotData: { showTitle: string; businessRef: string; keyIndustry: string }[] = [
    { showTitle: 'ሰለሜ ሰለሜ', businessRef: 'SS-0001', keyIndustry: 'Gold Water' },
    { showTitle: 'ሰለሜ ሰለሜ', businessRef: 'SS-0002', keyIndustry: 'Ambassador water' },
    { showTitle: 'ሰለሜ ሰለሜ', businessRef: 'SS-0003', keyIndustry: 'Ava water' },
    { showTitle: 'Chef Z', businessRef: 'CZ-001', keyIndustry: 'Knorr Ankuar' },
    { showTitle: 'Chef Z', businessRef: 'CZ-002', keyIndustry: 'Mekelesha' },
    { showTitle: 'Chef Z', businessRef: 'CZ-003', keyIndustry: 'sun chips' },
    { showTitle: 'Feta Show', businessRef: 'Ft-001', keyIndustry: 'Yes Water' },
    { showTitle: 'Feta Show', businessRef: 'Ft-002', keyIndustry: 'Eden Water' },
    { showTitle: 'Feta Show', businessRef: 'Ft-003', keyIndustry: 'Negus malt' },
    { showTitle: 'Mese Show', businessRef: 'MS-001', keyIndustry: 'Addis International Bank' },
    { showTitle: 'Mese Show', businessRef: 'MS-002', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'Mese Show', businessRef: 'MS-003', keyIndustry: 'Nib Bank' },
    { showTitle: 'Dinknesh Africa', businessRef: 'DA-001', keyIndustry: 'Alage Ethiopia' },
    { showTitle: 'Dinknesh Africa', businessRef: 'DA-002', keyIndustry: '13 suns tour plc' },
    { showTitle: 'Dinknesh Africa', businessRef: 'DA-003', keyIndustry: 'Abba travel plc' },
    { showTitle: 'Hello Abbay', businessRef: 'HA-001', keyIndustry: 'Addis International Bank' },
    { showTitle: 'Hello Abbay', businessRef: 'HA-002', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'Hello Abbay', businessRef: 'HA-003', keyIndustry: 'Nib Bank' },
    { showTitle: 'Metenfesha (Solomon Bogale)', businessRef: 'MS-001', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'Metenfesha (Solomon Bogale)', businessRef: 'MS-002', keyIndustry: 'Nib Bank' },
    { showTitle: 'Metenfesha (Solomon Bogale)', businessRef: 'MS-003', keyIndustry: 'Abay Bank' },
    { showTitle: 'Foto ena Chewata', businessRef: 'FC-001', keyIndustry: 'Addis International Bank' },
    { showTitle: 'Foto ena Chewata', businessRef: 'FC-002', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'Foto ena Chewata', businessRef: 'FC-003', keyIndustry: 'Nib Bank' },
    { showTitle: 'Washu Ende', businessRef: 'WD-001', keyIndustry: 'Central Hawassa Hotel' },
    { showTitle: 'Washu Ende', businessRef: 'WD-002', keyIndustry: 'Capital Hotel' },
    { showTitle: 'Washu Ende', businessRef: 'WD-003', keyIndustry: 'Pyramid Hotel & Resort' },
    { showTitle: 'Mesenko', businessRef: 'MS-001', keyIndustry: 'Central Hawassa Hotel' },
    { showTitle: 'Mesenko', businessRef: 'MS-002', keyIndustry: 'Capital Hotel' },
    { showTitle: 'Mesenko', businessRef: 'MS-003', keyIndustry: 'Pyramid Hotel & Resort' },
    { showTitle: 'Guramayle', businessRef: 'GR-001', keyIndustry: 'Central Hawassa Hotel' },
    { showTitle: 'Guramayle', businessRef: 'GR-002', keyIndustry: 'Capital Hotel' },
    { showTitle: 'Guramayle', businessRef: 'GR-003', keyIndustry: 'Pyramid Hotel & Resort' },
    { showTitle: 'Man Yikenes', businessRef: 'MY-001', keyIndustry: 'Central Hawassa Hotel' },
    { showTitle: 'Man Yikenes', businessRef: 'MY-002', keyIndustry: 'Capital Hotel' },
    { showTitle: 'Man Yikenes', businessRef: 'MY-003', keyIndustry: 'Pyramid Hotel & Resort' },
    { showTitle: 'Sekela Talk Show', businessRef: 'SK-001', keyIndustry: 'EVE Comfort Sanitari Napkin' },
    { showTitle: 'Sekela Talk Show', businessRef: 'SK-002', keyIndustry: 'Lilac sanitery' },
    { showTitle: 'Sekela Talk Show', businessRef: 'SK-003', keyIndustry: 'Rose Modes' },
    { showTitle: 'ሃሰሳ የፌደል ጨዋታ', businessRef: 'HS-001', keyIndustry: 'Addis International Bank' },
    { showTitle: 'ሃሰሳ የፌደል ጨዋታ', businessRef: 'HS-002', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'ሃሰሳ የፌደል ጨዋታ', businessRef: 'HS-003', keyIndustry: 'Nib Bank' },
    { showTitle: 'የበኩር ፍርድ', businessRef: 'RB-001', keyIndustry: 'ETH Switch' },
    { showTitle: 'የበኩር ፍርድ', businessRef: 'RB-002', keyIndustry: 'Metropolitan Real Estate' },
    { showTitle: 'የበኩር ፍርድ', businessRef: 'RB-003', keyIndustry: 'Green Tree' },
    { showTitle: 'ዓባይ ዜና', businessRef: 'AN-001', keyIndustry: 'ዘ Insurance' },
    { showTitle: 'ዓባይ ዜና', businessRef: 'AN-002', keyIndustry: 'Ethio life & general insurance' },
    { showTitle: 'ዓባይ ዜና', businessRef: 'AN-003', keyIndustry: 'ultimate insurance' },
    { showTitle: 'KINGS OF ABBAY', businessRef: 'AN-001', keyIndustry: 'Cooperative Bank of Ethiopia' },
    { showTitle: 'KINGS OF ABBAY', businessRef: 'AN-002', keyIndustry: 'Nib Bank' },
    { showTitle: 'KINGS OF ABBAY', businessRef: 'AN-003', keyIndustry: 'Abay Bank' },
  ];

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

  for (const slot of slotData) {
    const show = await prisma.show.findFirst({
      where: { title: slot.showTitle },
    });
    if (!show) continue;

    await prisma.showSegmentSlot.upsert({
      where: {
        showId_businessRef: { showId: show.id, businessRef: slot.businessRef },
      },
      create: {
        showId: show.id,
        businessRef: slot.businessRef,
        keyIndustry: slot.keyIndustry,
      },
      update: { keyIndustry: slot.keyIndustry },
    });
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
