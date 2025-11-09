import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar, IconButton } from 'react-native-paper';
import { colors, shadows, borderRadius, spacing } from '../theme/colors';

interface ProgressCardProps {
  country: string;
  progress: number;
  status?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  country,
  progress,
  status,
  onPress,
  onDelete,
}) => {
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Fransa': '🇫🇷',
      'İtalya': '🇮🇹',
      'Almanya': '🇩🇪',
      'İngiltere': '🇬🇧',
      'Amerika': '🇺🇸',
    };
    return flags[country] || '🌍';
  };

  const getStatusInfo = (status?: string) => {
    const statusMap: Record<string, { text: string; color: string; bgColor: string }> = {
      'PREPARING_DOCUMENTS': { text: 'Evrak Hazırlanıyor', color: '#FF9800', bgColor: '#FFF3E0' },
      'APPOINTMENT_TAKEN': { text: 'Randevu Alındı', color: '#2196F3', bgColor: '#E3F2FD' },
      'AT_CONSULATE': { text: 'Konsoloslukta', color: '#9C27B0', bgColor: '#F3E5F5' },
      'COMPLETED': { text: '✅ Tamamlandı', color: '#4CAF50', bgColor: '#E8F5E9' },
      'REJECTED': { text: 'Reddedildi', color: '#F44336', bgColor: '#FFEBEE' },
    };
    return statusMap[status || ''] || { text: 'İşlemde', color: '#757575', bgColor: '#F5F5F5' };
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.countryInfo}>
            <Text style={styles.flag}>{getCountryFlag(country)}</Text>
            <Text style={styles.country}>{country}</Text>
          </View>
          {onDelete && (
            <IconButton
              icon="delete"
              iconColor="#F44336"
              size={20}
              onPress={onDelete}
              style={styles.deleteButton}
            />
          )}
        </View>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={progress / 100} 
            color={statusInfo.color} 
            style={styles.progressBar} 
          />
          <Text style={[styles.progressText, { color: statusInfo.color }]}>{progress}%</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.white,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    margin: 0,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  country: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    minWidth: 40,
  },
});
