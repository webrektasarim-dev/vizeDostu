import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...');

    // Tüm test kullanıcılarını sil
    const testEmails = ['admin@admin.com', 'test@vizedostu.com', 'admin@vizedostu.com'];
    
    for (const email of testEmails) {
      const testUser = await prisma.user.findUnique({ where: { email } });
      if (testUser) {
        console.log(`🗑️ Deleting test user: ${email}`);
        
        // İlişkili verileri sil
        await prisma.chatMessage.deleteMany({ where: { userId: testUser.id } });
        await prisma.notification.deleteMany({ where: { userId: testUser.id } });
        await prisma.appointment.deleteMany({ where: { userId: testUser.id } });
        await prisma.document.deleteMany({ where: { userId: testUser.id } });
        await prisma.application.deleteMany({ where: { userId: testUser.id } });
        await prisma.passport.deleteMany({ where: { userId: testUser.id } });
        
        // Kullanıcıyı sil
        await prisma.user.delete({ where: { id: testUser.id } });
        console.log(`✅ Deleted: ${email}`);
      }
    }

    // Admin hesabını kontrol et veya oluştur
    const adminEmail = 'gundogdukadir53@gmail.com';
    const adminPassword = 'webrek2024';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
      // Admin yoksa oluştur
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          fullName: 'Kadir Gündoğdu',
          phoneNumber: '+905538546853',
          role: UserRole.ADMIN,
          isVerified: true,
          isActive: true,
        },
      });
      console.log('✅ Admin created:', admin.email);
    } else {
      // Admin varsa ŞİFREYİ VE ROLÜNÜ güncelle
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { 
          passwordHash: hashedPassword,
          role: UserRole.ADMIN,
          fullName: 'Kadir Gündoğdu',
          phoneNumber: '+905538546853',
          isVerified: true,
          isActive: true,
        },
      });
      console.log('✅ Admin password & role updated:', admin.email);
    }

    console.log('');
    console.log('🎯 Final admin credentials:');
    console.log('   👑 Email: gundogdukadir53@gmail.com');
    console.log('   🔑 Password: webrek2024');
    console.log('   📱 Phone: +905538546853');
    console.log('');

  } catch (error) {
    console.error('❌ Setup admin error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

