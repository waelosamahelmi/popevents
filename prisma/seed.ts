import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Site Settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      companyName: 'Pop Events',
      tagline: 'Your Premier Event Partner in Kuwait',
      aboutText: 'Pop Events is a leading event management company in Kuwait, specializing in organizing festivals, exhibitions, and community events. From the popular Coffee Festival to art markets and cultural exhibitions, we bring people together through unforgettable experiences.',
      email: 'info@popeventskuwait.com',
      phone: '+965 1234 5678',
      whatsapp: '+965 1234 5678',
      instagram: 'https://instagram.com/popevents',
      tiktok: 'https://tiktok.com/@popevents',
      twitter: 'https://twitter.com/popevents',
      address: 'Kuwait City, Kuwait',
    },
  });
  console.log('✅ Site settings created');

  // Create sample events
  const coffeeFestival = await prisma.event.upsert({
    where: { slug: 'kuwait-coffee-festival-2026' },
    update: {},
    create: {
      title: 'Kuwait Coffee Festival 2026',
      slug: 'kuwait-coffee-festival-2026',
      description: `## About the Event

Join us for the biggest coffee celebration in Kuwait! The Kuwait Coffee Festival 2026 brings together the finest coffee roasters, baristas, and coffee enthusiasts from around the region.

### What to Expect

- **50+ Coffee Exhibitors**: Local and international coffee brands
- **Live Barista Competitions**: Watch the best baristas compete
- **Workshops & Tastings**: Learn from coffee experts
- **Food & Music**: Great food and live entertainment
- **Networking**: Connect with coffee industry professionals

### Venue

The festival will take place at the Kuwait International Fairgrounds, featuring indoor and outdoor areas with a capacity for over 10,000 visitors.

Don't miss this incredible celebration of coffee culture!`,
      date: new Date('2026-03-15T16:00:00Z'),
      endDate: new Date('2026-03-20T22:00:00Z'),
      location: 'Kuwait International Fairgrounds, Mishref',
      mapUrl: 'https://maps.google.com/maps?q=Kuwait+International+Fairgrounds&t=&z=13&ie=UTF8&iwloc=&output=embed',
      coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
      isUpcoming: true,
      isPublished: true,
      maxCapacity: 10000,
    },
  });
  console.log('✅ Coffee Festival event created');

  const foodArtMarket = await prisma.event.upsert({
    where: { slug: 'food-art-market-2026' },
    update: {},
    create: {
      title: 'Food & Art Market 2026',
      slug: 'food-art-market-2026',
      description: `## About the Event

Experience the perfect blend of culinary arts and creative expression at the Food & Art Market 2026. This unique event showcases Kuwait's talented food vendors and artists in one vibrant location.

### Highlights

- **Artisan Food Vendors**: From traditional Kuwaiti dishes to international cuisine
- **Local Artists**: Paintings, sculptures, crafts, and more
- **Live Art Demonstrations**: Watch artists create masterpieces
- **Workshops**: Learn cooking techniques and art skills
- **Family Friendly**: Activities for all ages

### Location

Set in the beautiful Al Shaheed Park, this outdoor market offers a stunning backdrop for a day of food, art, and culture.`,
      date: new Date('2026-04-10T14:00:00Z'),
      endDate: new Date('2026-04-12T22:00:00Z'),
      location: 'Al Shaheed Park, Kuwait City',
      mapUrl: 'https://maps.google.com/maps?q=Al+Shaheed+Park+Kuwait&t=&z=13&ie=UTF8&iwloc=&output=embed',
      coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop',
      isUpcoming: true,
      isPublished: true,
      maxCapacity: 5000,
    },
  });
  console.log('✅ Food & Art Market event created');

  // Create portfolio items
  await prisma.portfolioItem.create({
    data: {
      title: 'Coffee Festival 2025',
      eventName: 'Kuwait Coffee Festival 2025',
      description: 'Our signature Coffee Festival brought together over 40 coffee exhibitors and 8,000 visitors for a weekend of coffee appreciation.',
      images: [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
      ],
      sortOrder: 1,
      isPublished: true,
    },
  });

  await prisma.portfolioItem.create({
    data: {
      title: 'Summer Art Exhibition',
      eventName: 'Summer Art Exhibition 2025',
      description: 'A curated exhibition featuring 50+ local artists, attracting art enthusiasts from across the GCC region.',
      images: [
        'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop',
      ],
      sortOrder: 2,
      isPublished: true,
    },
  });

  await prisma.portfolioItem.create({
    data: {
      title: 'Food Market Weekend',
      eventName: 'Weekend Food Market',
      description: 'A vibrant food market featuring Kuwait\'s best street food vendors, live music, and family activities.',
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      ],
      sortOrder: 3,
      isPublished: true,
    },
  });
  console.log('✅ Portfolio items created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
