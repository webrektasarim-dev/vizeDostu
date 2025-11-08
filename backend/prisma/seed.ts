import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  // Create or update admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vizedostu.com' },
    update: {
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@vizedostu.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create or update regular test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@vizedostu.com' },
    update: {},
    create: {
      email: 'test@vizedostu.com',
      passwordHash: hashedPassword,
      fullName: 'Test User',
      role: UserRole.USER,
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Test user created:', testUser.email);

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Admin: admin@vizedostu.com / Test123!');
  console.log('   User:  test@vizedostu.com / Test123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
