import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearUser, setUser } from '../../store/slices/authSlice';
import { AuthService } from '../../services/auth.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedUser = await AuthService.getProfile();
      dispatch(setUser(updatedUser));
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            dispatch(clearUser());
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6200EA', '#5E35B1']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon size={100} icon="account" style={styles.avatar} color="#FFFFFF" />
            <View style={styles.onlineBadge}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
            </View>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="account-circle" size={24} color="#2196F3" />
              <Text style={styles.cardTitle}>Hesap Bilgileri</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="account" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Ad Soyad</Text>
                <Text style={styles.value}>{user?.fullName}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>E-posta</Text>
                <Text style={styles.value}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="shield-check" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Hesap Durumu</Text>
                <Text style={styles.valueSuccess}>✓ Aktif</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="chart-box" size={24} color="#4CAF50" />
              <Text style={styles.cardTitle}>İstatistikler</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Başvuru</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Belge</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Randevu</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="logout"
          buttonColor="#F44336"
        >
          Çıkış Yap
        </Button>
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
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  onlineBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
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
    borderRadius: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  valueSuccess: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#757575',
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
