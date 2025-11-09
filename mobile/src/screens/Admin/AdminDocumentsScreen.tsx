import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity, Linking } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminService } from '../../services/admin.service';
import { EmptyState } from '../../components/EmptyState';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminDocumentsScreen() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDocuments();
  }, []);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadDocuments();
    }, [])
  );

  // Klasörü aç/kapat
  const toggleFolder = (userId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

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

  // Belgeleri kullanıcıya göre gruplandır
  const groupDocumentsByUser = () => {
    const grouped: Record<string, any> = {};
    documents.forEach((doc) => {
      const userId = doc.user.id;
      if (!grouped[userId]) {
        grouped[userId] = {
          user: doc.user,
          documents: [],
        };
      }
      grouped[userId].documents.push(doc);
    });
    return Object.values(grouped);
  };

  const userGroups = groupDocumentsByUser();

  // Document type'ı Türkçe'ye çevir
  const getDocumentTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'passport': '🛂 Pasaport',
      'photo': '📸 Fotoğraf',
      'bank_statement': '🏦 Banka Ekstresi',
      'employment_letter': '💼 İş Mektubu',
      'hotel_reservation': '🏨 Otel Rezervasyonu',
      'flight_ticket': '✈️ Uçak Bileti',
      'travel_insurance': '🛡️ Seyahat Sigortası',
      'invitation_letter': '✉️ Davet Mektubu',
      'tax_return': '📄 Vergi Belgesi',
      'birth_certificate': '👶 Doğum Belgesi',
      'marriage_certificate': '💍 Evlilik Belgesi',
      'address_proof': '🏠 Adres Belgesi',
    };
    return typeMap[type] || `📄 ${type}`;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const handleViewDocument = async (doc: any) => {
    try {
      const canOpen = await Linking.canOpenURL(doc.fileUrl);
      if (canOpen) {
        await Linking.openURL(doc.fileUrl);
      } else {
        Alert.alert('Belge Detayı', `Belge: ${doc.fileName}\n\nURL: ${doc.fileUrl}`, [
          { text: 'Kapat' }
        ]);
      }
    } catch (error) {
      Alert.alert('Belge Detayı', `Belge: ${doc.fileName}\n\nURL: ${doc.fileUrl}`, [
        { text: 'Kapat' }
      ]);
    }
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
          {userGroups.map((group: any) => {
            const isExpanded = expandedFolders.has(group.user.id);
            
            return (
              <View key={group.user.id} style={styles.userFolder}>
                {/* Kullanıcı Klasör Başlığı - Tıklanabilir */}
                <TouchableOpacity onPress={() => toggleFolder(group.user.id)} activeOpacity={0.7}>
                  <Card style={styles.folderCard}>
                    <Card.Content style={styles.folderHeader}>
                      <View style={styles.folderIcon}>
                        <Icon 
                          name={isExpanded ? "folder-open" : "folder"} 
                          size={32} 
                          color="#FF9800" 
                        />
                      </View>
                      <View style={styles.folderInfo}>
                        <Text style={styles.folderName}>
                          {isExpanded ? '📂' : '📁'} {group.user.fullName}
                        </Text>
                        <Text style={styles.folderEmail}>{group.user.email}</Text>
                        <Text style={styles.folderCount}>
                          {group.documents.length} belge
                        </Text>
                      </View>
                      <Icon 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={28} 
                        color="#FF9800" 
                      />
                    </Card.Content>
                  </Card>
                </TouchableOpacity>

                {/* Kullanıcının Belgeleri - Sadece açıksa göster */}
                {isExpanded && group.documents.map((doc: any) => (
                  <Card key={doc.id} style={styles.docCard}>
                    <Card.Content>
                      <View style={styles.docHeader}>
                        <Icon name="file-document" size={32} color="#2196F3" />
                        <View style={styles.docInfo}>
                          <Text style={styles.documentType}>{getDocumentTypeName(doc.documentType)}</Text>
                          <Text style={styles.fileName}>{doc.fileName}</Text>
                          <View style={styles.docDetails}>
                            <View style={styles.detailRow}>
                              <Icon name="file-chart" size={14} color="#757575" />
                              <Text style={styles.detailText}>
                                {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                              </Text>
                            </View>
                            <View style={styles.detailRow}>
                              <Icon name="calendar" size={14} color="#757575" />
                              <Text style={styles.detailText}>
                                {new Date(doc.uploadedAt).toLocaleDateString('tr-TR')}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.actions}>
                        <Button
                          mode="contained"
                          onPress={() => handleViewDocument(doc)}
                          style={styles.viewButton}
                          buttonColor="#2196F3"
                          icon="eye"
                          compact
                        >
                          Aç
                        </Button>
                        <Button
                          mode="outlined"
                          onPress={() => handleDelete(doc)}
                          style={styles.deleteButton}
                          textColor="#F44336"
                          icon="delete"
                          compact
                        >
                          Sil
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            );
          })}
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
  userFolder: {
    marginBottom: 24,
  },
  folderCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#FFF3E0',
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  folderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 2,
  },
  folderEmail: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  docCard: {
    marginBottom: 12,
    marginLeft: 16,
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  docInfo: {
    flex: 1,
  },
  docDetails: {
    marginTop: 8,
    gap: 8,
  },
  documentType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  viewButton: {
    flex: 1,
    borderRadius: 8,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
  },
});


