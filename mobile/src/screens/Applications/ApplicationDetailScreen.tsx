import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StepperComponent, Step } from '../../components';
import { getCountryConfig } from '../../config/countries.config';
import { ApplicationService } from '../../services/application.service';
import { DocumentService } from '../../services/document.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function ApplicationDetailScreen({ route, navigation }: any) {
  const { applicationId, country = 'Fransa' } = route?.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [country])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Başvuruyu çek
      const apps = await ApplicationService.getActiveApplications();
      const currentApp = apps.find((a: any) => a.country === country);
      if (currentApp) {
        setApplication(currentApp);
        console.log('📋 Application loaded:', currentApp.status);
      }
      
      // Belgeleri çek
      const docs = await DocumentService.getDocuments();
      setUploadedDocuments(docs);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Status'e göre dinamik steps oluştur
  const getSteps = (currentStatus: string): Step[] => {
    const statusOrder = ['PREPARING_DOCUMENTS', 'APPOINTMENT_TAKEN', 'AT_CONSULATE', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return [
      { 
        label: 'Evrak Hazırlanıyor', 
        status: currentIndex === 0 ? 'current' : (currentIndex > 0 ? 'completed' : 'pending')
      },
      { 
        label: 'Randevu Alındı', 
        status: currentIndex === 1 ? 'current' : (currentIndex > 1 ? 'completed' : 'pending')
      },
      { 
        label: 'Konsoloslukta', 
        status: currentIndex === 2 ? 'current' : (currentIndex > 2 ? 'completed' : 'pending')
      },
      { 
        label: 'Tamamlandı', 
        status: currentIndex >= 3 ? 'completed' : 'pending'
      },
    ];
  };

  const steps = application ? getSteps(application.status) : [
    { label: 'Evrak Hazırlanıyor', status: 'current' },
    { label: 'Randevu Alındı', status: 'pending' },
    { label: 'Konsoloslukta', status: 'pending' },
    { label: 'Tamamlandı', status: 'pending' },
  ];

  const getCountryFlag = (country: string) => {
    const config = getCountryConfig(country);
    return config?.flag || '🌍';
  };

  const countryConfig = getCountryConfig(country);
  if (!countryConfig) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ülke bilgisi bulunamadı</Text>
      </View>
    );
  }

  const totalDocuments = countryConfig.documents.length;
  const uploadedCount = countryConfig.documents.filter((doc) =>
    uploadedDocuments.find((uploaded) => uploaded.documentType === doc.id)
  ).length;
  const progress = totalDocuments > 0 ? (uploadedCount / totalDocuments) * 100 : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E88E5', '#1976D2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.flag}>{getCountryFlag(country)}</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>Başvuru Takip Paneli</Text>
            <Text style={styles.headerTitle}>{country} Vizesi</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Başvuru Süreci */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="chart-timeline" size={24} color="#2196F3" />
              <Text style={styles.cardTitle}>Başvuru Süreci</Text>
            </View>
            <StepperComponent steps={steps} />
          </Card.Content>
        </Card>

        {/* Belge Durumu */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="file-document-multiple" size={24} color="#FF9800" />
              <Text style={styles.cardTitle}>Belge Durumu</Text>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                {uploadedCount}/{totalDocuments} Belge Yüklendi
              </Text>
              <ProgressBar
                progress={progress / 100}
                color="#4CAF50"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>%{Math.round(progress)} Tamamlandı</Text>
            </View>

            <View style={styles.documentList}>
              {countryConfig.documents.map((doc) => {
                const uploaded = uploadedDocuments.find((d) => d.documentType === doc.id);
                return (
                  <View key={doc.id} style={styles.documentRow}>
                    <Icon
                      name={uploaded ? 'check-circle' : 'close-circle'}
                      size={20}
                      color={uploaded ? '#4CAF50' : '#F44336'}
                    />
                    <Text style={[styles.documentText, uploaded && styles.documentUploaded]}>
                      {doc.name}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Button
              mode="contained"
              onPress={() => navigation.navigate('Documents')}
              style={styles.actionButton}
              icon="upload"
              buttonColor="#FF9800"
            >
              Belgeleri Yükle
            </Button>
          </Card.Content>
        </Card>

        {/* Başvuru Bilgileri */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Icon name="information" size={24} color="#9C27B0" />
              <Text style={styles.cardTitle}>Başvuru Bilgileri</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="map-marker" size={20} color="#757575" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Ülke</Text>
                <Text style={styles.value}>{countryConfig.flag} {country}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="cash" size={20} color="#757575" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Harç Ücreti</Text>
                <Text style={styles.value}>{countryConfig.fee}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="clock-outline" size={20} color="#757575" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>İşlem Süresi</Text>
                <Text style={styles.value}>{countryConfig.processingTime}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tamamlanma Durumu */}
        {uploadedCount === totalDocuments && (
          <Card style={styles.successCard}>
            <Card.Content style={styles.successContent}>
              <Icon name="check-circle" size={64} color="#4CAF50" />
              <Text style={styles.successTitle}>🎉 Tüm Belgeler Hazır!</Text>
              <Text style={styles.successText}>
                Başvurunuz belgeler açısından tamamlandı. Randevu alabilirsiniz!
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#F44336',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flag: {
    fontSize: 64,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
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
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
  },
  documentList: {
    marginBottom: 16,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  documentText: {
    fontSize: 14,
    color: '#757575',
  },
  documentUploaded: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoTextContainer: {
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
  successCard: {
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    elevation: 4,
    marginTop: 8,
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
