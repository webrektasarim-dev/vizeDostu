import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminService } from '../../services/admin.service';
import { EmptyState } from '../../components/EmptyState';
import { useFocusEffect } from '@react-navigation/native';
import { colors, shadows, borderRadius, spacing } from '../../theme/colors';

export default function AdminApplicationsScreen({ navigation }: any) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadApplications();
  }, [filter]);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadApplications();
    }, [filter])
  );

  const loadApplications = async () => {
    try {
      console.log('📋 Loading admin applications...');
      const data = await AdminService.getAllApplications(1, 50, filter);
      console.log('✅ Applications loaded:', data);
      setApplications(data.applications || []);
    } catch (error: any) {
      console.error('❌ Load applications error:', error);
      Alert.alert('Hata', 'Başvurular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      PREPARING_DOCUMENTS: '#FF9800',
      APPOINTMENT_TAKEN: '#2196F3',
      AT_CONSULATE: '#9C27B0',
      COMPLETED: '#4CAF50',
      REJECTED: '#F44336',
      CANCELLED: '#757575',
    };
    return colors[status] || '#757575';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      PREPARING_DOCUMENTS: 'Evrak Hazırlanıyor',
      APPOINTMENT_TAKEN: 'Randevu Alındı',
      AT_CONSULATE: 'Konsoloslukta',
      COMPLETED: 'Tamamlandı',
      REJECTED: 'Reddedildi',
      CANCELLED: 'İptal Edildi',
    };
    return texts[status] || status;
  };

  const handleViewDetail = async (app: any) => {
    try {
      // Kullanıcının belgelerini al
      const appDetail = await AdminService.getApplicationById(app.id);
      const docs = await AdminService.getAllDocuments();
      const userDocs = docs.documents.filter((d: any) => d.userId === app.user.id);
      
      const docList = userDocs.length > 0 
        ? userDocs.map((d: any) => `\n  ✅ ${d.fileName}`).join('')
        : '\n  ❌ Henüz belge yüklenmedi';

      Alert.alert(
        `${app.country} Başvurusu`,
        `👤 Kullanıcı: ${app.user.fullName}\n📧 Email: ${app.user.email}\n\n✈️ Vize Tipi: ${app.visaType}\n📊 Durum: ${getStatusText(app.status)}\n📈 İlerleme: %${app.progressPercentage}\n\n📄 Yüklenen Belgeler:${docList}\n\n📅 Oluşturma: ${new Date(app.createdAt).toLocaleDateString('tr-TR')}`
      );
    } catch (error) {
      Alert.alert(
        `${app.country} Başvurusu`,
        `Kullanıcı: ${app.user.fullName}\nEmail: ${app.user.email}\n\nVize Tipi: ${app.visaType}\nDurum: ${getStatusText(app.status)}\nİlerleme: %${app.progressPercentage}\n\nOluşturma: ${new Date(app.createdAt).toLocaleDateString('tr-TR')}`
      );
    }
  };

  const handleUpdateStatus = (app: any) => {
    Alert.alert(
      'Durum Güncelle',
      `${app.user.fullName} - ${app.country}`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Hazırlanıyor', onPress: () => updateStatus(app.id, 'PREPARING_DOCUMENTS') },
        { text: 'Randevu Alındı', onPress: () => updateStatus(app.id, 'APPOINTMENT_TAKEN') },
        { text: 'Konsoloslukta', onPress: () => updateStatus(app.id, 'AT_CONSULATE') },
        { text: 'Tamamlandı', onPress: () => updateStatus(app.id, 'COMPLETED') },
      ]
    );
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await AdminService.updateApplicationStatus(id, status);
      Alert.alert('Başarılı', 'Başvuru durumu güncellendi');
      loadApplications();
    } catch (error) {
      Alert.alert('Hata', 'Durum güncellenemedi');
    }
  };

  const handleDelete = (app: any) => {
    Alert.alert(
      'Başvuruyu Sil',
      `${app.user.fullName} - ${app.country} başvurusunu silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AdminService.deleteApplication(app.id);
              Alert.alert('Başarılı', 'Başvuru silindi');
              loadApplications();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Hata', 'Başvuru silinemedi');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Başvurular yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8E24AA', '#6A1B9A', '#4A148C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>📋 Başvuru Yönetimi</Text>
        <Text style={styles.subtitle}>{applications.length} başvuru</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip
            selected={filter === ''}
            onPress={() => setFilter('')}
            style={[styles.filterChip, filter === '' && styles.filterChipActive]}
            textStyle={filter === '' ? styles.filterChipTextActive : {}}
          >
            Tümü ({applications.length})
          </Chip>
          <Chip
            selected={filter === 'PREPARING_DOCUMENTS'}
            onPress={() => setFilter('PREPARING_DOCUMENTS')}
            style={[styles.filterChip, filter === 'PREPARING_DOCUMENTS' && styles.filterChipActive]}
          >
            Hazırlanıyor
          </Chip>
          <Chip
            selected={filter === 'COMPLETED'}
            onPress={() => setFilter('COMPLETED')}
            style={[styles.filterChip, filter === 'COMPLETED' && styles.filterChipActive]}
          >
            Tamamlanan
          </Chip>
        </ScrollView>
      </View>

      {applications.length === 0 ? (
        <EmptyState
          icon="clipboard-off"
          title="Başvuru Yok"
          subtitle="Henüz başvuru bulunmuyor"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {applications.map((app) => (
            <TouchableOpacity key={app.id} onPress={() => handleViewDetail(app)}>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.userInfo}>
                      <Icon name="account-circle" size={40} color="#2196F3" />
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{app.user.fullName}</Text>
                        <Text style={styles.userEmail}>{app.user.email}</Text>
                      </View>
                    </View>
                    <Chip
                      icon="flag"
                      style={[styles.statusChip, { backgroundColor: getStatusColor(app.status) + '20' }]}
                      textStyle={[styles.statusText, { color: getStatusColor(app.status) }]}
                    >
                      {getStatusText(app.status)}
                    </Chip>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.appDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="earth" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Ülke:</Text>
                      <Text style={styles.detailValue}>{app.country}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="airplane" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Vize:</Text>
                      <Text style={styles.detailValue}>{app.visaType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="chart-line" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>İlerleme:</Text>
                      <Text style={styles.detailValue}>%{app.progressPercentage}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="calendar" size={18} color="#757575" />
                      <Text style={styles.detailLabel}>Tarih:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Button
                      mode="outlined"
                      onPress={() => handleUpdateStatus(app)}
                      style={styles.actionButton}
                      icon="pencil"
                    >
                      Durum Güncelle
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleDelete(app)}
                      style={styles.deleteButton}
                      textColor="#F44336"
                      icon="delete"
                    >
                      Sil
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filters: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  userEmail: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  appDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#F44336',
  },
});

