import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCard } from '../../components';
import { EmptyState } from '../../components/EmptyState';
import { ApplicationService } from '../../services/application.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function ApplicationListScreen({ navigation }: any) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Load applications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleDelete = (appId: string, country: string) => {
    Alert.alert(
      'Başvuruyu Sil',
      `${country} başvurusunu silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApplicationService.deleteApplication(appId);
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
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Başvurularım 📋</Text>
            <Text style={styles.subtitle}>{applications.length} aktif başvuru</Text>
          </View>
          <Icon name="clipboard-check" size={40} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {applications.length === 0 ? (
        <EmptyState
          icon="clipboard-text-off"
          title="Henüz Başvuru Yok"
          subtitle="Yeni bir vize başvurusu oluşturarak başlayın!"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aktif Başvurularım</Text>
            {applications.map((app: any) => (
              <ProgressCard
                key={app.id}
                country={app.country}
                status={app.status}
                progress={app.progressPercentage}
                onPress={() => navigation.navigate('ApplicationDetail', { 
                  country: app.country,
                  status: app.status,
                  visaType: app.visaType 
                })}
                onDelete={() => handleDelete(app.id, app.country)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <FAB
        icon="plus"
        label="Yeni Başvuru"
        style={styles.fab}
        onPress={() => navigation.navigate('ApplicationCreate')}
        color="#FFFFFF"
        customSize={60}
      />
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#667eea',
    borderRadius: 16,
  },
});


