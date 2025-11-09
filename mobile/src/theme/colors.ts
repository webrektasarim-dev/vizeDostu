// Modern Vize Uygulaması Renk Paleti
// Profesyonel vize/seyahat uygulamaları için optimize edilmiş

export const colors = {
  // Ana Renkler - Güven ve Profesyonellik
  primary: {
    main: '#1E88E5', // Modern mavi
    light: '#42A5F5',
    dark: '#1565C0',
    gradient: ['#1E88E5', '#1565C0'],
  },
  
  // Başarı Renkleri
  success: {
    main: '#43A047',
    light: '#66BB6A',
    dark: '#2E7D32',
    gradient: ['#43A047', '#2E7D32'],
  },
  
  // Uyarı Renkleri
  warning: {
    main: '#FB8C00',
    light: '#FFA726',
    dark: '#E65100',
    gradient: ['#FB8C00', '#E65100'],
  },
  
  // Hata Renkleri
  error: {
    main: '#E53935',
    light: '#EF5350',
    dark: '#C62828',
    gradient: ['#E53935', '#C62828'],
  },
  
  // Admin Renkleri
  admin: {
    main: '#6A1B9A',
    light: '#8E24AA',
    dark: '#4A148C',
    gradient: ['#6A1B9A', '#4A148C'],
  },
  
  // Gradient Kombinasyonları - Modern ve Dikkat Çekici
  gradients: {
    primary: ['#1E88E5', '#1565C0'],
    success: ['#43A047', '#2E7D32'],
    sunset: ['#FF6B6B', '#FFA500'],
    ocean: ['#00C9FF', '#0078D7'],
    purple: ['#667eea', '#764ba2'],
    pink: ['#f093fb', '#f5576c'],
    teal: ['#11998e', '#38ef7d'],
    gold: ['#FFD700', '#FFA500'],
  },
  
  // Nötr Renkler
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
  
  // Arkaplan Renkleri
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
    dark: '#1A1A2E',
  },
  
  // Text Renkleri
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
    white: '#FFFFFF',
  },
  
  // Status Renkleri (Başvuru Durumları)
  status: {
    preparing: {
      color: '#FF9800',
      bg: '#FFF3E0',
      gradient: ['#FFB74D', '#FF9800'],
    },
    appointment: {
      color: '#2196F3',
      bg: '#E3F2FD',
      gradient: ['#42A5F5', '#2196F3'],
    },
    consulate: {
      color: '#9C27B0',
      bg: '#F3E5F5',
      gradient: ['#AB47BC', '#9C27B0'],
    },
    completed: {
      color: '#4CAF50',
      bg: '#E8F5E9',
      gradient: ['#66BB6A', '#4CAF50'],
    },
    rejected: {
      color: '#F44336',
      bg: '#FFEBEE',
      gradient: ['#EF5350', '#F44336'],
    },
  },
  
  // Shadow Renkleri
  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(0, 0, 0, 0.16)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

