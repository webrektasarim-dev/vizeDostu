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
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadApplications();
    }, [])
  );

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
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Icon name="account" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.greetingSmall}>{getGreeting()} 👋</Text>
              <Text style={styles.greeting}>
                {user?.fullName || 'Kullanıcı'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.notificationBadge}>
              <Icon name="bell-outline" size={24} color="#FFFFFF" />
              <View style={styles.badge} />
            </View>
          </View>
        </View>
        
        {user?.role === 'ADMIN' && (
          <Surface style={styles.adminBadge}>
            <Icon name="shield-crown" size={20} color="#FFD700" />
            <Text style={styles.adminBadgeText}>Admin Panel</Text>
          </Surface>
        )}
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
            <Icon name="lightning-bolt" size={22} color="#667eea" />
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <Surface style={styles.quickAction}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="file-document-plus" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionTitle}>Yeni Başvuru</Text>
            </Surface>
            <Surface style={styles.quickAction}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="folder-open" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionTitle}>Belgelerim</Text>
            </Surface>
            <Surface style={styles.quickAction}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="chat" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionTitle}>AI Asistan</Text>
            </Surface>
            <Surface style={styles.quickAction}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="passport" size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionTitle}>Pasaport</Text>
            </Surface>
          </View>
        </View>

        {/* Başvuru yoksa bilgilendirme */}
        {applications.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Icon name="airplane-takeoff" size={56} color="#667eea" />
              </View>
              <Text style={styles.emptyTitle}>Yolculuğunuz Başlasın! ✈️</Text>
              <Text style={styles.emptyText}>
                Hayalinizdeki ülkeye vize başvurunuzu yaparak ilk adımı atın!
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('ApplicationCreate')}
                style={styles.emptyButton}
                buttonColor="#667eea"
                icon="plus"
              >
                İlk Başvurumu Oluştur
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  greetingSmall: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  notificationBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: (width - 44) / 2,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
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
  emptyCard: {
    borderRadius: 20,
    elevation: 3,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  emptyButton: {
    borderRadius: 12,
    elevation: 2,
  },
});
