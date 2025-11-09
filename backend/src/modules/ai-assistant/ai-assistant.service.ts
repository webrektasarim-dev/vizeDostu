import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly openai: OpenAI;
  private readonly systemPrompt = `Sen Türkçe konuşan bir vize ve pasaport danışmanısın. 
Adın "Vize Asistanı" ve kullanıcılara vize başvuruları, pasaport yenileme, gerekli evraklar ve randevu süreçleri hakkında yardımcı oluyorsun.

Görevlerin:
- Vize gereksinimleri hakkında bilgi vermek
- Hangi ülkeler için hangi belgelerin gerekli olduğunu açıklamak
- Randevu alma süreçleri hakkında rehberlik etmek
- VFS Global, konsolosluk ve büyükelçilik bilgileri vermek
- Başvuru süreci adımlarını detaylı açıklamak
- Sık sorulan sorulara yanıt vermek

Özellikler:
- Her zaman nazik, profesyonel ve yardımsever ol
- Bilmediğin bir şey varsa, tahmin etme, bunun yerine danışmanlık firmasıyla iletişime geçmelerini öner
- Yanıtlarını kısa ve öz tut
- Türkçe karakter kullanımına dikkat et
- Gerektiğinde adım adım rehberlik et

Önemli: Sadece vize ve pasaport konularında yardımcı ol. Başka konularda yardım istenirse, sadece vize/pasaport konularında yardım edebileceğini kibarca belirt.`;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(userId: string, message: string) {
    try {
      // Save user message
      await this.prisma.chatMessage.create({
        data: {
          userId,
          message,
          sender: 'USER',
        },
      });

      // Get chat history (last 10 messages for context)
      const history = await this.prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // Build messages for OpenAI
      const messages: any[] = [
        { role: 'system', content: this.systemPrompt },
        ...history
          .reverse()
          .map((msg) => ({
            role: msg.sender === 'USER' ? 'user' : 'assistant',
            content: msg.message,
          })),
      ];

      // Get response from OpenAI
      let aiResponse: string;
      
      try {
        console.log('🤖 Calling OpenAI GPT-4...');
        console.log('📝 Message:', message);
        console.log('📚 History length:', history.length);
        
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini', // Daha hızlı ve ucuz
          messages,
          max_tokens: 1000,
          temperature: 0.8,
        });
        
        aiResponse = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturamadım.';
        console.log('✅ OpenAI response received:', aiResponse.substring(0, 50) + '...');
        
      } catch (openaiError: any) {
        this.logger.error('❌ OpenAI error:', openaiError.message);
        console.error('OpenAI Error Details:', openaiError);
        
        // Demo mode - OpenAI bağlanamazsa akıllı fallback
        aiResponse = this.getDemoResponse(message);
        console.log('⚠️ Using fallback response');
      }

      // Save AI response
      await this.prisma.chatMessage.create({
        data: {
          userId,
          message: aiResponse,
          sender: 'AI',
          metadata: {},
        },
      });

      return {
        message: aiResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      throw new Error('AI asistan ile iletişim kurulamadı');
    }
  }

  async getChatHistory(userId: string, limit: number = 50) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async clearChatHistory(userId: string) {
    await this.prisma.chatMessage.deleteMany({
      where: { userId },
    });

    return { cleared: true };
  }

  private getDemoResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('italya') || lowerMessage.includes('italy')) {
      return `İtalya turistik vizesi için gerekli belgeler:

✓ Geçerli pasaport (en az 6 ay geçerli)
✓ Vize başvuru formu (doldurulmuş ve imzalı)
✓ 2 adet biyometrik fotoğraf
✓ Seyahat sigortası (minimum 30.000 EUR)
✓ Uçak bileti rezervasyonu
✓ Otel rezervasyonu
✓ Banka hesap özeti (son 3 ay)
✓ İşten izin belgesi

Başvuru süresi: 10-15 iş günü
Randevu: VFS Global İstanbul üzerinden alınabilir.
Harç: 80 EUR

Başka sorunuz var mı?`;
    }
    
    if (lowerMessage.includes('pasaport') || lowerMessage.includes('süre')) {
      return `Pasaport sürenizin dolmasına 6 aydan az kaldıysa vize başvurusu için sorun yaşayabilirsiniz. Çoğu ülke pasaportunuzun vize süresi boyunca + en az 3-6 ay daha geçerli olmasını ister.

Pasaport yenileme için:
- Nüfus Müdürlüğü'ne başvurun
- 2 adet biyometrik fotoğraf
- Eski pasaport
- Harç: 850 TL (2024)
- Süre: 1-2 hafta

Başka bir konuda yardımcı olabilir miyim?`;
    }
    
    if (lowerMessage.includes('vfs') || lowerMessage.includes('randevu')) {
      return `VFS Global randevu alma adımları:

1. https://visa.vfsglobal.com/tur/tr adresine gidin
2. Başvurmak istediğiniz ülkeyi seçin
3. Randevu tipi: Schengen Vize
4. Uygun tarih ve saat seçin
5. Bilgilerinizi doldurun
6. Randevu onayı gelecek

İpucu: Sabah saatlerinde daha çok slot bulabilirsiniz!

Başka sorunuz var mı?`;
    }
    
    if (lowerMessage.includes('schengen') || lowerMessage.includes('ücret') || lowerMessage.includes('ne kadar')) {
      return `Schengen vizesi ücretleri (2024):

• Vize harcı: 80 EUR (kısa dönem)
• Servis ücreti: ~25 EUR (VFS Global)
• Toplam: ~105 EUR (yaklaşık 3,500 TL)

Ek masraflar:
- Seyahat sigortası: 100-300 TL
- Fotoğraf: 30-50 TL
- Tercüme: 500-1000 TL (gerekirse)

Çocuklar için indirimli tarifeler mevcut.

Başka sorunuz var mı?`;
    }
    
    return `Merhaba! Vize Asistanı olarak size yardımcı olmaya hazırım. 

Şu konularda size yardımcı olabilirim:
• Vize başvuru gereksinimleri
• Pasaport yenileme işlemleri  
• Randevu alma süreçleri
• Gerekli belgeler
• VFS Global işlemleri

Size nasıl yardımcı olabilirim? 😊`;
  }

  async getVisaRequirements(country: string) {
    // Bu bilgiler normalde bir veritabanından veya API'den gelir
    // Şimdilik basit bir örnek
    const requirements = {
      Fransa: {
        documents: [
          'Geçerli pasaport (son kullanma tarihi en az 3 ay sonrası)',
          'Vize başvuru formu',
          'Biyometrik fotoğraf (2 adet)',
          'Seyahat sigortası (minimum 30.000 EUR)',
          'Uçak bileti rezervasyonu',
          'Konaklama belgesi',
          'Banka dekont (son 3 ay)',
          'İş yerinden izin belgesi',
        ],
        duration: '15 iş günü',
        fee: '80 EUR',
        vfsLocation: 'VFS Global İstanbul',
      },
      İtalya: {
        documents: [
          'Geçerli pasaport',
          'Vize başvuru formu',
          'Fotoğraf (2 adet)',
          'Seyahat sigortası',
          'Otel rezervasyonu',
          'Uçak bileti',
          'Finansal belgeler',
        ],
        duration: '10-15 iş günü',
        fee: '80 EUR',
        vfsLocation: 'VFS Global İstanbul',
      },
      Almanya: {
        documents: [
          'Geçerli pasaport',
          'Başvuru formu',
          'Fotoğraf',
          'Seyahat sigortası',
          'Konaklama kanıtı',
          'Maddi durum belgesi',
          'İş belgesi',
        ],
        duration: '15 iş günü',
        fee: '80 EUR',
        vfsLocation: 'Alman Konsolosluğu',
      },
    };

    return requirements[country] || null;
  }
}


