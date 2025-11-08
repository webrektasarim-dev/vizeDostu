import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';

interface ProgressCardProps {
  country: string;
  progress: number;
  onPress?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  country,
  progress,
  onPress,
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

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.flag}>{getCountryFlag(country)}</Text>
          <Text style={styles.country}>{country}</Text>
        </View>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress / 100} color="#2196F3" style={styles.progressBar} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
