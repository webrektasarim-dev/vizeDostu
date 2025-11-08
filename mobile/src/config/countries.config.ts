export interface DocumentRequirement {
  id: string;
  name: string;
  description?: string;
  required: boolean;
}

export interface CountryConfig {
  flag: string;
  name: string;
  fee: string;
  processingTime: string;
  documents: DocumentRequirement[];
  visaTypes: string[];
}

export const COUNTRY_REQUIREMENTS: { [key: string]: CountryConfig } = {
  'Fransa': {
    flag: '🇫🇷',
    name: 'Fransa',
    fee: '€80',
    processingTime: '15 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim', 'Aile Ziyareti'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Biyometrik Fotoğraf', description: '3.5x4.5 cm, beyaz zemin', required: true },
      { id: 'bank_statement', name: 'Banka Hesap Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', description: 'En az €30.000 teminat', required: true },
      { id: 'flight_reservation', name: 'Uçak Bileti Rezervasyonu', description: 'Gidiş-dönüş', required: true },
      { id: 'hotel_reservation', name: 'Otel Rezervasyonu', description: 'Tüm konaklama süresi', required: true },
      { id: 'employment_letter', name: 'İş Yazısı', description: 'SGK belgesili', required: false },
    ],
  },
  'İtalya': {
    flag: '🇮🇹',
    name: 'İtalya',
    fee: '€80',
    processingTime: '10 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: '3.5x4.5 cm', required: true },
      { id: 'bank_statement', name: 'Banka Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', description: '€30.000 teminat', required: true },
      { id: 'flight_reservation', name: 'Uçak Bileti', description: 'Rezervasyon', required: true },
      { id: 'hotel_reservation', name: 'Konaklama Belgesi', description: 'Otel/Ev adresi', required: true },
    ],
  },
  'Almanya': {
    flag: '🇩🇪',
    name: 'Almanya',
    fee: '€80',
    processingTime: '15 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim', 'Aile Ziyareti'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: 'Biyometrik standart', required: true },
      { id: 'bank_statement', name: 'Banka Hesap Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', description: '€30.000 teminat', required: true },
      { id: 'invitation_letter', name: 'Davet Mektubu', description: 'Almanca veya İngilizce', required: false },
      { id: 'flight_reservation', name: 'Uçak Bileti', description: 'Rezervasyon', required: true },
    ],
  },
  'İngiltere': {
    flag: '🇬🇧',
    name: 'İngiltere',
    fee: '£100',
    processingTime: '3 hafta',
    visaTypes: ['Turistik', 'İş', 'Eğitim'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: 'UK standartları', required: true },
      { id: 'bank_statement', name: 'Banka Dökümü', description: 'Son 6 ay', required: true },
      { id: 'employment_letter', name: 'İş Yazısı', description: 'İngilizce', required: true },
      { id: 'accommodation', name: 'Konaklama Belgesi', description: 'Otel veya ev adresi', required: true },
    ],
  },
  'İspanya': {
    flag: '🇪🇸',
    name: 'İspanya',
    fee: '€80',
    processingTime: '15 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: '3.5x4.5 cm', required: true },
      { id: 'bank_statement', name: 'Banka Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', description: '€30.000', required: true },
      { id: 'flight_reservation', name: 'Uçak Bileti', required: true },
      { id: 'hotel_reservation', name: 'Otel Rezervasyonu', required: true },
    ],
  },
  'Hollanda': {
    flag: '🇳🇱',
    name: 'Hollanda',
    fee: '€80',
    processingTime: '15 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: 'Biyometrik', required: true },
      { id: 'bank_statement', name: 'Banka Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', required: true },
      { id: 'invitation_letter', name: 'Davet Mektubu', description: 'Gerekirse', required: false },
    ],
  },
  'Belçika': {
    flag: '🇧🇪',
    name: 'Belçika',
    fee: '€80',
    processingTime: '15 iş günü',
    visaTypes: ['Turistik', 'İş', 'Eğitim'],
    documents: [
      { id: 'passport', name: 'Pasaport', description: 'En az 6 ay geçerli', required: true },
      { id: 'photo', name: 'Fotoğraf', description: 'Biyometrik', required: true },
      { id: 'bank_statement', name: 'Banka Dökümü', description: 'Son 3 ay', required: true },
      { id: 'insurance', name: 'Seyahat Sigortası', required: true },
      { id: 'flight_reservation', name: 'Uçak Bileti', required: true },
      { id: 'hotel_reservation', name: 'Otel Rezervasyonu', required: true },
    ],
  },
};

export const getCountryConfig = (countryName: string): CountryConfig | null => {
  return COUNTRY_REQUIREMENTS[countryName] || null;
};

export const getAllCountries = (): string[] => {
  return Object.keys(COUNTRY_REQUIREMENTS);
};


