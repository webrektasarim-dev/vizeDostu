import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Önce ilişkili tabloları temizle (cascade için)
  console.log('🗑️ Deleting all data...');
  await prisma.chatMessage.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.passport.deleteMany({});
  console.log('✅ Related data deleted');

  // Tüm kullanıcıları sil
  console.log('🗑️ Deleting all users...');
  await prisma.user.deleteMany({});
  console.log('✅ All users deleted');

  // Hash password
  const hashedPassword = await bcrypt.hash('webrek2024', 10);

  // Create admin user (Kadir)
  const adminUser = await prisma.user.create({
    data: {
      email: 'gundogdukadir53@gmail.com',
      passwordHash: hashedPassword,
      fullName: 'Kadir Gündoğdu',
      phoneNumber: '+905538546853',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   👑 Admin: gundogdukadir53@gmail.com / webrek2024');
  console.log('   📱 Phone: +905538546853');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
