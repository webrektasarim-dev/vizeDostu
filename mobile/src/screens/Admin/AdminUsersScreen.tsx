import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdminService, AdminUser } from '../../services/admin.service';
import { EmptyState } from '../../components/EmptyState';

export default function AdminUsersScreen({ navigation }: any) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await AdminService.getAllUsers(page, 20, search);
      setUsers(data.users);
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleToggleStatus = (user: AdminUser) => {
    Alert.alert(
      `Kullanıcıyı ${user.isActive ? 'Devre Dışı Bırak' : 'Aktif Et'}`,
      `${user.fullName} kullanıcısını ${user.isActive ? 'devre dışı bırakmak' : 'aktif etmek'} istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            try {
              await AdminService.updateUserStatus(user.id, !user.isActive);
              Alert.alert('Başarılı', 'Kullanıcı durumu güncellendi');
              loadUsers();
            } catch (error) {
              Alert.alert('Hata', 'İşlem başarısız oldu');
            }
          },
        },
      ]
    );
  };

  const handleViewUser = (user: AdminUser) => {
    Alert.alert(
      user.fullName,
      `Email: ${user.email}\nRol: ${user.role}\nBaşvuru: ${user._count.applications}\nBelge: ${user._count.documents}\nDurum: ${user.isActive ? 'Aktif' : 'Pasif'}`
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={styles.loadingText}>Kullanıcılar yükleniyor...</Text>
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
        <Text style={styles.title}>👥 Kullanıcı Yönetimi</Text>
        <Text style={styles.subtitle}>{users.length} kullanıcı</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Kullanıcı ara..."
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          style={styles.searchInput}
        />
        <Button
          mode="contained"
          onPress={loadUsers}
          style={styles.searchButton}
          buttonColor="#F44336"
        >
          Ara
        </Button>
      </View>

      {users.length === 0 ? (
        <EmptyState
          icon="account-off"
          title="Kullanıcı Bulunamadı"
          subtitle="Henüz kullanıcı bulunmuyor"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {users.map((user) => (
            <TouchableOpacity key={user.id} onPress={() => handleViewUser(user)}>
              <Card style={styles.userCard}>
                <Card.Content>
                  <View style={styles.userHeader}>
                    <View style={styles.avatar}>
                      <Icon
                        name={user.role === 'ADMIN' ? 'shield-crown' : 'account'}
                        size={32}
                        color={user.role === 'ADMIN' ? '#F44336' : '#2196F3'}
                      />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.fullName}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <View style={styles.chips}>
                        {user.role === 'ADMIN' && (
                          <Chip
                            icon="shield-crown"
                            style={styles.adminChip}
                            textStyle={styles.adminChipText}
                          >
                            ADMIN
                          </Chip>
                        )}
                        <Chip
                          icon={user.isActive ? 'check-circle' : 'close-circle'}
                          style={user.isActive ? styles.activeChip : styles.inactiveChip}
                          textStyle={user.isActive ? styles.activeChipText : styles.inactiveChipText}
                        >
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </Chip>
                      </View>
                    </View>
                  </View>

                  <View style={styles.stats}>
                    <View style={styles.statItem}>
                      <Icon name="file-document" size={18} color="#757575" />
                      <Text style={styles.statText}>{user._count.applications} başvuru</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon name="folder" size={18} color="#757575" />
                      <Text style={styles.statText}>{user._count.documents} belge</Text>
                    </View>
                  </View>

                  {user.role !== 'ADMIN' && (
                    <Button
                      mode="outlined"
                      onPress={() => handleToggleStatus(user)}
                      style={styles.actionButton}
                      textColor={user.isActive ? '#F44336' : '#4CAF50'}
                      icon={user.isActive ? 'block-helper' : 'check-circle'}
                    >
                      {user.isActive ? 'Devre Dışı Bırak' : 'Aktif Et'}
                    </Button>
                  )}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  userCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  adminChip: {
    backgroundColor: '#FFEBEE',
    height: 28,
  },
  adminChipText: {
    color: '#F44336',
    fontSize: 11,
    fontWeight: '700',
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
    height: 28,
  },
  activeChipText: {
    color: '#4CAF50',
    fontSize: 11,
  },
  inactiveChip: {
    backgroundColor: '#EEEEEE',
    height: 28,
  },
  inactiveChipText: {
    color: '#757575',
    fontSize: 11,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#757575',
  },
  actionButton: {
    marginTop: 4,
  },
});

