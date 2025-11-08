import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Dimensions } from 'react-native';
import { Text, Card, Button, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearUser } from '../../store/slices/authSlice';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressCard, QuickActionButton } from '../../components';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await ApplicationService.getActiveApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    dispatch(clearUser());
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1E88E5', '#1976D2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
        <Text style={styles.greeting}>
              {user?.fullName?.split(' ')[0]} 👋
        </Text>
          </View>
          <View style={styles.notificationBadge}>
            <Icon name="bell" size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Aktif Başvurularım */}
        {applications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Icon name="clipboard-text" size={24} color="#2196F3" />
              <Text style={styles.sectionTitle}>Aktif Başvurularım</Text>
            </View>
            {applications.map((app: any) => (
              <ProgressCard
                key={app.id}
                country={app.country}
                progress={app.progressPercentage}
                onPress={() => navigation.navigate('ApplicationDetail', { country: app.country })}
              />
            ))}
              </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lightning-bolt" size={24} color="#FF9800" />
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
                  </View>
          <QuickActionButton
            title="Yeni Başvuru Oluştur"
            iconName="file-document-plus"
            onPress={() => navigation.navigate('ApplicationCreate')}
          />
          <QuickActionButton
            title="Bildirimler"
            iconName="bell"
            onPress={() => navigation.navigate('Notifications')}
            variant="secondary"
          />
                </View>

        {/* Başvuru yoksa bilgilendirme */}
        {applications.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="file-document-plus" size={64} color="#2196F3" />
              <Text style={styles.emptyTitle}>Henüz Başvuru Yok</Text>
              <Text style={styles.emptyText}>
                İlk vize başvurunuzu oluşturarak başlayın!
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('ApplicationCreate')}
                style={styles.emptyButton}
                icon="plus"
              >
                Yeni Başvuru Oluştur
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <Card style={styles.miniCard}>
            <Card.Content style={styles.miniCardContent}>
              <Icon name="file-document" size={32} color="#4CAF50" />
              <Text style={styles.miniCardValue}>{applications.length}</Text>
              <Text style={styles.miniCardLabel}>Aktif Başvuru</Text>
            </Card.Content>
          </Card>

          <Card style={styles.miniCard}>
            <Card.Content style={styles.miniCardContent}>
              <Icon name="folder" size={32} color="#FF9800" />
              <Text style={styles.miniCardValue}>-</Text>
              <Text style={styles.miniCardLabel}>Belgeler</Text>
            </Card.Content>
          </Card>
        </View>

        {/* AI Assistant Promo */}
        <Card style={styles.promoCard}>
          <LinearGradient
            colors={['#9C27B0', '#7B1FA2']}
            style={styles.promoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="robot-excited" size={48} color="#FFFFFF" />
            <Text style={styles.promoTitle}>AI Vize Asistanı</Text>
            <Text style={styles.promoText}>
              Vize süreçleriniz hakkında sorularınıza anında yanıt alın!
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AIAssistant')}
              style={styles.promoButton}
              buttonColor="#FFFFFF"
              textColor="#9C27B0"
            >
              Şimdi Dene
            </Button>
          </LinearGradient>
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
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSmall: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  notificationBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  infoCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  miniCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 3,
  },
  miniCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  miniCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
  },
  miniCardLabel: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
  promoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
  },
  promoGradient: {
    padding: 24,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  promoText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  promoButton: {
    borderRadius: 12,
    elevation: 0,
  },
  appointmentCard: {
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  appointmentIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  appointmentLocation: {
    fontSize: 13,
    color: '#757575',
  },
});
