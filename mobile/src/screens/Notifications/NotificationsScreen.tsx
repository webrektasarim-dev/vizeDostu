import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../config/api.config';
import { EmptyState } from '../../components/EmptyState';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Load notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>🔔 Bildirimler</Text>
            <Text style={styles.subtitle}>{notifications.length} bildirim</Text>
          </View>
          <Icon name="bell-ring" size={40} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {notifications.length === 0 ? (
        <EmptyState
          icon="bell-off"
          title="Bildirim Yok"
          subtitle="Henüz hiç bildiriminiz bulunmuyor"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notif: any) => (
            <Card
              key={notif.id}
              style={[styles.card, !notif.isRead && styles.unreadCard]}
              onPress={() => markAsRead(notif.id)}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Icon
                    name={getNotificationIcon(notif.type)}
                    size={32}
                    color={getNotificationColor(notif.type)}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    {!notif.isRead && (
                      <Chip icon="circle" style={styles.newBadge} textStyle={styles.badgeText}>
                        Yeni
                      </Chip>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function getNotificationIcon(type: string) {
  const icons: { [key: string]: string } = {
    APPLICATION_UPDATE: 'file-document',
    APPOINTMENT_REMINDER: 'calendar-clock',
    DOCUMENT_WARNING: 'alert-circle',
    SYSTEM: 'information',
  };
  return icons[type] || 'bell';
}

function getNotificationColor(type: string) {
  const colors: { [key: string]: string } = {
    APPLICATION_UPDATE: '#2196F3',
    APPOINTMENT_REMINDER: '#4CAF50',
    DOCUMENT_WARNING: '#FF9800',
    SYSTEM: '#9C27B0',
  };
  return colors[type] || '#757575';
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
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6,
  },
  notifMessage: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
    marginBottom: 8,
  },
  newBadge: {
    backgroundColor: '#2196F3',
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

