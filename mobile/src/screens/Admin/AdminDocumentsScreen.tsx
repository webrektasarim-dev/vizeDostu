import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminService } from '../../services/admin.service';
import { EmptyState } from '../../components/EmptyState';

export default function AdminDocumentsScreen() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      console.log('📁 Loading admin documents...');
      const data = await AdminService.getAllDocuments(1, 50);
      console.log('✅ Documents loaded:', data);
      setDocuments(data.documents || []);
    } catch (error: any) {
      console.error('❌ Load documents error:', error);
      Alert.alert('Hata', 'Belgeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const handleDelete = (doc: any) => {
    Alert.alert(
      'Belgeyi Sil',
      `${doc.user.fullName} kullanıcısının "${doc.fileName}" belgesini silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AdminService.deleteDocument(doc.id);
              Alert.alert('Başarılı', 'Belge silindi');
              loadDocuments();
            } catch (error) {
              Alert.alert('Hata', 'Belge silinemedi');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Belgeler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9800', '#F57C00']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>📁 Belge Yönetimi</Text>
        <Text style={styles.subtitle}>{documents.length} belge</Text>
      </LinearGradient>

      {documents.length === 0 ? (
        <EmptyState
          icon="folder-off"
          title="Belge Bulunamadı"
          subtitle="Henüz hiç belge yüklenmemiş"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {documents.map((doc) => (
            <Card key={doc.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Icon name="file-document" size={40} color="#FF9800" />
                  <View style={styles.docInfo}>
                    <Text style={styles.fileName}>{doc.fileName}</Text>
                    <Text style={styles.userText}>👤 {doc.user.fullName}</Text>
                    <Text style={styles.emailText}>{doc.user.email}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Icon name="file-chart" size={16} color="#757575" />
                    <Text style={styles.detailText}>
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#757575" />
                    <Text style={styles.detailText}>
                      {new Date(doc.uploadedAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => handleDelete(doc)}
                  style={styles.deleteButton}
                  textColor="#F44336"
                  icon="delete"
                >
                  Belgeyi Sil
                </Button>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#757575',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  docInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 2,
  },
  emailText: {
    fontSize: 12,
    color: '#757575',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#757575',
  },
  deleteButton: {
    marginTop: 8,
  },
});


