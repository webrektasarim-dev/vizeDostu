import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminService } from '../../services/admin.service';
import { useFocusEffect } from '@react-navigation/native';
import { colors, shadows, borderRadius, spacing } from '../../theme/colors';

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      console.log('📊 Loading admin stats...');
      console.log('API URL:', 'http://192.168.1.104:3000/api/v1/admin/stats');
      
      const data = await AdminService.getDashboardStats();
      console.log('✅ Stats loaded:', data);
      setStats(data);
    } catch (error: any) {
      console.error('❌ Load stats error:', error);
      console.error('Status Code:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('Error Message:', error.message);
      
      if (error.response?.status === 400) {
        Alert.alert(
          'Hata',
          'Yetki hatası! Backend admin endpoint\'ine erişilemiyor.\n\nBackend terminalini kontrol et!'
        );
      }
      
      // Varsayılan değerler göster
      setStats({
        totalUsers: 0,
        totalApplications: 0,
        totalDocuments: 0,
        activeApplications: 0,
        completedApplications: 0,
        todayRegistrations: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={styles.loadingText}>İstatistikler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F44336', '#D32F2F']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name="shield-crown" size={60} color="#FFFFFF" />
        <Text style={styles.title}>👑 Admin Panel</Text>
        <Text style={styles.subtitle}>Sistem Yönetimi</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]} onPress={() => navigation.navigate('AdminUsers')}>
            <Card.Content style={styles.statContent}>
              <Icon name="account-group" size={40} color="#2196F3" />
              <Text style={styles.statValue}>{stats?.totalUsers || 0}</Text>
              <Text style={styles.statLabel}>Toplam Kullanıcı</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]} onPress={() => navigation.navigate('AdminApplications')}>
            <Card.Content style={styles.statContent}>
              <Icon name="file-document-multiple" size={40} color="#9C27B0" />
              <Text style={styles.statValue}>{stats?.totalApplications || 0}</Text>
              <Text style={styles.statLabel}>Toplam Başvuru</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]} onPress={() => navigation.navigate('AdminDocuments')}>
            <Card.Content style={styles.statContent}>
              <Icon name="folder-multiple" size={40} color="#FF9800" />
              <Text style={styles.statValue}>{stats?.totalDocuments || 0}</Text>
              <Text style={styles.statLabel}>Toplam Belge</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]} onPress={() => navigation.navigate('AdminApplications')}>
            <Card.Content style={styles.statContent}>
              <Icon name="clock-check" size={40} color="#4CAF50" />
              <Text style={styles.statValue}>{stats?.activeApplications || 0}</Text>
              <Text style={styles.statLabel}>Aktif Başvuru</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Tamamlanan Başvurular</Text>
                <Text style={styles.infoValue}>{stats?.completedApplications || 0}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="account-plus" size={24} color="#2196F3" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Bugün Kayıt Olan</Text>
                <Text style={styles.infoValue}>{stats?.todayRegistrations || 0}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text style={styles.quickActionsTitle}>⚡ Hızlı Erişim</Text>
            <Text style={styles.quickActionsText}>
              Kullanıcıları, başvuruları ve belgeleri yönetmek için alt menüdeki sekmeleri kullanın.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  quickActionsCard: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#FFEBEE',
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  quickActionsText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});

