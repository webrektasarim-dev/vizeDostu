import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, Card, Button, TextInput, Chip, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PassportService } from '../../services/passport.service';

export default function PassportScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passport, setPassport] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    passportNumber: '',
    expiryDate: '',
    nationality: 'Türkiye',
    fullName: user?.fullName || '',
    imageUri: '',
  });

  // Ekrana gelince veriyi yükle
  useFocusEffect(
    React.useCallback(() => {
      loadPassport();
    }, [])
  );

  const loadPassport = async () => {
    try {
      setLoading(true);
      const data = await PassportService.getPassport();
      console.log('📋 Loaded passport data:', data);
      if (data) {
        console.log('🖼️ Passport has document:', !!data.document);
        console.log('🔗 Document fileUrl:', data.document?.fileUrl);
        setPassport(data);
      }
    } catch (error) {
      console.error('Load passport error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditForm({ ...editForm, imageUri: result.assets[0].uri });
        Alert.alert('Başarılı', 'Görsel seçildi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Görsel seçilemedi');
    }
  };

  const handleSave = async () => {
    if (!editForm.passportNumber || !editForm.fullName || !editForm.expiryDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      const savedPassport = await PassportService.createOrUpdatePassport({
        passportNumber: editForm.passportNumber,
        fullName: editForm.fullName,
        nationality: editForm.nationality,
        expiryDate: editForm.expiryDate,
        imageUri: editForm.imageUri,
      });
      
      setPassport(savedPassport);
      setModalVisible(false);
      Alert.alert('✅ Başarılı', 'Pasaport bilgileriniz kaydedildi');
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.message || 'Pasaport kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const daysUntilExpiry = passport?.expiryDate
    ? Math.floor((new Date(passport.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43e97b" />
        <Text style={styles.loadingText}>Pasaport bilgileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#43e97b', '#38f9d7']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name="passport" size={80} color="#FFFFFF" />
        <Text style={styles.title}>Pasaport Bilgilerim</Text>
        <Text style={styles.subtitle}>Güncel pasaport bilgileriniz</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {passport ? (
          <>
            {/* Pasaport Görseli */}
            {passport.document?.fileUrl && (
              <Card style={styles.imageViewCard}>
                <Card.Content>
                  <Text style={styles.imageTitle}>Pasaport Görseli</Text>
                  <Image source={{ uri: passport.document.fileUrl }} style={styles.passportImageView} />
                </Card.Content>
              </Card>
            )}

            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.statusContainer}>
                  <Chip 
                    icon="check-circle" 
                    style={styles.statusChip}
                    textStyle={styles.chipText}
                  >
                    Geçerli
                  </Chip>
                  <Text style={styles.daysLeft}>{daysUntilExpiry} gün kaldı</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Icon name="account" size={20} color="#757575" />
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Ad Soyad</Text>
                    <Text style={styles.value}>{user?.fullName}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="card-account-details" size={20} color="#757575" />
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Pasaport No</Text>
                    <Text style={styles.value}>{passport.passportNumber}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="flag" size={20} color="#757575" />
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Uyruk</Text>
                    <Text style={styles.value}>
                      {passport.issuingCountry === 'TUR' ? '🇹🇷 Türkiye' : passport.issuingCountry}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="calendar" size={20} color="#757575" />
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Geçerlilik Tarihi</Text>
                    <Text style={styles.value}>
                      {new Date(passport.expiryDate).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={() => {
                const documentUrl = passport.document?.fileUrl || '';
                setEditForm({
                  passportNumber: passport.passportNumber || '',
                  expiryDate: passport.expiryDate?.split('T')[0] || '',
                  nationality: passport.issuingCountry === 'TUR' ? 'Türkiye' : passport.issuingCountry,
                  fullName: user?.fullName || '',
                  imageUri: documentUrl,
                });
                setModalVisible(true);
              }}
              style={styles.button}
              icon="pencil"
              buttonColor="#673AB7"
            >
              Pasaport Bilgilerini Güncelle
            </Button>

            <Card style={styles.warningCard}>
              <Card.Content>
                <View style={styles.warningHeader}>
                  <Icon name="information" size={24} color="#FF9800" />
                  <Text style={styles.warningTitle}>Pasaport Yenileme</Text>
                </View>
                <Text style={styles.warningText}>
                  Pasaportunuzun geçerlilik süresi 6 aydan az kaldığında, vize başvuruları reddedilebilir. Zamanında yenilemeyi unutmayın!
                </Text>
              </Card.Content>
            </Card>
          </>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="passport" size={64} color="#BDBDBD" />
              <Text style={styles.emptyTitle}>Pasaport Bilgisi Yok</Text>
              <Text style={styles.emptyText}>
                Henüz pasaport bilgisi eklemediniz. Vize başvurusu için pasaport bilgilerinizi ekleyin.
              </Text>
              <Button
                mode="contained"
                onPress={() => setModalVisible(true)}
                style={styles.button}
                icon="plus"
              >
                Pasaport Ekle
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>📖 Pasaport Bilgileri</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="close" size={28} color="#757575" />
                  </TouchableOpacity>
                </View>

                {/* Pasaport Görseli */}
                <Card style={styles.imageCard}>
                  <Card.Content style={styles.imageContent}>
                    {editForm.imageUri ? (
                      <Image source={{ uri: editForm.imageUri }} style={styles.passportImage} />
                    ) : (
                      <View style={styles.noImage}>
                        <Icon name="image-off" size={48} color="#BDBDBD" />
                        <Text style={styles.noImageText}>Pasaport görseli yok</Text>
                      </View>
                    )}
                    <Button
                      mode="outlined"
                      onPress={handlePickImage}
                      style={styles.uploadButton}
                      icon="camera"
                    >
                      {editForm.imageUri ? 'Görseli Değiştir' : 'Görsel Yükle'}
                    </Button>
                  </Card.Content>
                </Card>

                <TextInput
                  label="Ad Soyad"
                  value={editForm.fullName}
                  onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                />
                <TextInput
                  label="Pasaport No"
                  value={editForm.passportNumber}
                  onChangeText={(text) => setEditForm({ ...editForm, passportNumber: text })}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="card-account-details" />}
                />
                <TextInput
                  label="Uyruk"
                  value={editForm.nationality}
                  onChangeText={(text) => setEditForm({ ...editForm, nationality: text })}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="flag" />}
                />
                <TextInput
                  label="Geçerlilik Tarihi (YYYY-MM-DD)"
                  value={editForm.expiryDate}
                  onChangeText={(text) => setEditForm({ ...editForm, expiryDate: text })}
                  mode="outlined"
                  placeholder="2028-12-31"
                  style={styles.input}
                  left={<TextInput.Icon icon="calendar" />}
                />

                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                  style={styles.saveButton}
                  icon="check"
                  buttonColor="#43e97b"
                >
                  Kaydet
                </Button>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
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
  imageViewCard: {
    borderRadius: 20,
    elevation: 4,
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  passportImageView: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  card: {
    borderRadius: 20,
    elevation: 4,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusChip: {
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  daysLeft: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
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
  button: {
    marginVertical: 6,
    borderRadius: 12,
  },
  warningCard: {
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    elevation: 2,
    marginTop: 8,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
  },
  warningText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 20,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#757575',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '80%',
    maxHeight: '90%',
  },
  modalScrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  imageCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 2,
  },
  imageContent: {
    alignItems: 'center',
  },
  passportImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  noImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  noImageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#BDBDBD',
  },
  uploadButton: {
    borderRadius: 8,
  },
});
