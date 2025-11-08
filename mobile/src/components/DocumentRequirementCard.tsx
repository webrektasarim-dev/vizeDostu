import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DocumentRequirementCardProps {
  documentName: string;
  description?: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  fileSize?: number;
  onUpload: () => void;
  onView?: () => void;
}

export function DocumentRequirementCard({
  documentName,
  description,
  required,
  uploaded,
  fileName,
  fileSize,
  onUpload,
  onView,
}: DocumentRequirementCardProps) {
  return (
    <Card style={[styles.card, uploaded && styles.uploadedCard]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon
              name={uploaded ? 'check-circle' : 'file-document-outline'}
              size={32}
              color={uploaded ? '#4CAF50' : '#757575'}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>
              {uploaded ? '✅' : required ? '❌' : '⭕'} {documentName}
            </Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            {required && !uploaded && (
              <Text style={styles.requiredBadge}>* Zorunlu</Text>
            )}
          </View>
        </View>

        {uploaded && fileName ? (
          <View style={styles.uploadedInfo}>
            <View style={styles.fileInfo}>
              <Icon name="paperclip" size={16} color="#4CAF50" />
              <Text style={styles.fileName}>{fileName}</Text>
              {fileSize && (
                <Text style={styles.fileSize}>
                  ({(fileSize / 1024 / 1024).toFixed(2)} MB)
                </Text>
              )}
            </View>
            {onView && (
              <TouchableOpacity onPress={onView}>
                <Icon name="eye" size={20} color="#2196F3" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={onUpload}
            style={styles.uploadButton}
            icon="upload"
            buttonColor="#2196F3"
          >
            Belge Yükle
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  uploadedCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  requiredBadge: {
    fontSize: 11,
    color: '#F44336',
    fontWeight: '600',
  },
  uploadedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
  },
  fileSize: {
    fontSize: 11,
    color: '#757575',
  },
  uploadButton: {
    borderRadius: 8,
  },
});


