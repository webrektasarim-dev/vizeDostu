import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DocumentCardProps {
  fileName: string;
  fileType: string;
  uploadDate: string;
  country?: string;
  onPress?: () => void;
}

export function DocumentCard({ 
  fileName, 
  fileType, 
  uploadDate, 
  country,
  onPress 
}: DocumentCardProps) {
  const getFileIcon = (type: string) => {
    if (type === 'pdf') return 'file-pdf-box';
    if (type.includes('image')) return 'image';
    return 'file-document';
  };

  const getFileColor = (type: string) => {
    if (type === 'pdf') return '#F44336';
    if (type.includes('image')) return '#4CAF50';
    return '#2196F3';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: getFileColor(fileType) + '20' }]}>
              <Icon name={getFileIcon(fileType)} size={32} color={getFileColor(fileType)} />
            </View>
            <View style={styles.info}>
              <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
              <View style={styles.meta}>
                <Icon name="calendar" size={14} color="#757575" />
                <Text style={styles.date}>{uploadDate}</Text>
              </View>
              {country && (
                <Chip icon="earth" style={styles.chip} textStyle={styles.chipText}>
                  {country}
                </Chip>
              )}
            </View>
            <Icon name="chevron-right" size={24} color="#BDBDBD" />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#757575',
  },
  chip: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    height: 24,
  },
  chipText: {
    fontSize: 11,
    color: '#2196F3',
    marginVertical: 0,
  },
});
