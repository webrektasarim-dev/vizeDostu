import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Surface, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { DocumentRequirementCard } from '../../components';
import { DocumentService } from '../../services/document.service';
import { ApplicationService } from '../../services/application.service';
import { getCountryConfig } from '../../config/countries.config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmptyState } from '../../components/EmptyState';
import { useFocusEffect } from '@react-navigation/native';

export default function DocumentListScreen() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeApplication, setActiveApplication] = useState<any>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Ekrana her gelindiğinde refresh yap
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      // Aktif başvuruyu al
      const apps = await ApplicationService.getActiveApplications();
      if (apps.length > 0) {
        setActiveApplication(apps[0]); // İlk aktif başvuru
      }
      
      // Belgeleri al
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

  const handleUpload = async (documentId: string, documentName: string) => {
    try {
      const file = await DocumentService.pickDocument();
      if (!file) return;

      setUploading(true);
      await DocumentService.uploadDocument(
        file.uri, 
        documentId,
        activeApplication?.country
      );
      Alert.alert('✅ Başarılı', `${documentName} başarıyla yüklendi!`);
      await loadData();
    } catch (error: any) {
      Alert.alert('❌ Hata', error.message || 'Belge yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const isDocumentUploaded = (docId: string) => {
    return uploadedDocuments.find((doc) => doc.documentType === docId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Belgeler yükleniyor...</Text>
      </View>
    );
  }

  // Aktif başvuru yoksa
  if (!activeApplication) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF9800', '#F57C00']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>Belgelerim 📁</Text>
          <Text style={styles.subtitle}>Belgelerinizi yükleyin</Text>
        </LinearGradient>
        <EmptyState
          icon="file-document-alert"
          title="Aktif Başvuru Yok"
          subtitle="Belge yüklemek için önce bir vize başvurusu oluşturun"
        />
      </View>
    );
  }

  const countryConfig = getCountryConfig(activeApplication.country);
  if (!countryConfig) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle"
          title="Ülke Bilgisi Bulunamadı"
          subtitle="Bu ülke için belge gereksinimleri tanımlanmamış"
        />
      </View>
    );
  }

  const totalDocuments = countryConfig.documents.length;
  const uploadedCount = countryConfig.documents.filter((doc) => 
    isDocumentUploaded(doc.id)
  ).length;
  const progress = totalDocuments > 0 ? (uploadedCount / totalDocuments) * 100 : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Belgelerim 📁</Text>
            <Text style={styles.subtitle}>
              {countryConfig.flag} {countryConfig.name} Vizesi
            </Text>
          </View>
          <Icon name="folder-open" size={40} color="#FFFFFF" />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Ülke Bilgileri */}
        <Surface style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="cash" size={24} color="#4CAF50" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Harç Ücreti</Text>
              <Text style={styles.infoValue}>{countryConfig.fee}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={24} color="#2196F3" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>İşlem Süresi</Text>
              <Text style={styles.infoValue}>{countryConfig.processingTime}</Text>
            </View>
          </View>
        </Surface>

        {/* Progress */}
        <Surface style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            📊 Belge İlerlemesi: {uploadedCount}/{totalDocuments}
          </Text>
          <ProgressBar
            progress={progress / 100}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>%{Math.round(progress)} Tamamlandı</Text>
        </Surface>

        {/* Gerekli Belgeler */}
        <Text style={styles.sectionTitle}>📄 Gerekli Belgeler</Text>
        {countryConfig.documents.map((doc) => {
          const uploaded = isDocumentUploaded(doc.id);
          return (
            <DocumentRequirementCard
              key={doc.id}
              documentName={doc.name}
              description={doc.description}
              required={doc.required}
              uploaded={!!uploaded}
              fileName={uploaded?.fileName}
              fileSize={uploaded?.fileSize}
              onUpload={() => handleUpload(doc.id, doc.name)}
              onView={uploaded ? () => Alert.alert(doc.name, uploaded.fileName) : undefined}
            />
          );
        })}

        {/* Tamamlanma Durumu */}
        {uploadedCount === totalDocuments && (
          <Surface style={styles.completionCard}>
            <View style={styles.completionContent}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <View style={styles.completionText}>
                <Text style={styles.completionTitle}>🎉 Tüm Belgeler Hazır!</Text>
                <Text style={styles.completionSubtitle}>
                  Başvurunuz belgeler açısından tamamlandı. Randevu alabilirsiniz.
                </Text>
              </View>
            </View>
          </Surface>
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  progressCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  completionCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    elevation: 3,
    marginTop: 16,
  },
  completionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  completionText: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 6,
  },
  completionSubtitle: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});
