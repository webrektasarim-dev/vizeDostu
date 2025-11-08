import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Text, Card, Button, TextInput, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PassportScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPassport, setHasPassport] = useState(true);
  const [passport, setPassport] = useState({
    passportNumber: 'U12345678',
    expiryDate: '2028-05-15',
    nationality: 'Türkiye',
    fullName: 'Ahmet Yılmaz',
  });
  const [editForm, setEditForm] = useState(passport);

  const handleSave = () => {
    setPassport(editForm);
    setModalVisible(false);
    Alert.alert('Başarılı', 'Pasaport bilgileriniz kaydedildi');
  };

  const daysUntilExpiry = Math.floor(
    (new Date('2028-05-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#673AB7', '#5E35B1']}
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
        {hasPassport ? (
          <>
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
                    <Text style={styles.value}>{passport.fullName}</Text>
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
                    <Text style={styles.value}>🇹🇷 {passport.nationality}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="calendar" size={20} color="#757575" />
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Geçerlilik Tarihi</Text>
                    <Text style={styles.value}>{passport.expiryDate}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={() => {
                setEditForm(passport);
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📖 Pasaport Bilgileri</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color="#757575" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Ad Soyad"
              value={editForm.fullName}
              onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Pasaport No"
              value={editForm.passportNumber}
              onChangeText={(text) => setEditForm({ ...editForm, passportNumber: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Uyruk"
              value={editForm.nationality}
              onChangeText={(text) => setEditForm({ ...editForm, nationality: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Geçerlilik Tarihi (YYYY-MM-DD)"
              value={editForm.expiryDate}
              onChangeText={(text) => setEditForm({ ...editForm, expiryDate: text })}
              mode="outlined"
              placeholder="2028-12-31"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              icon="check"
            >
              Kaydet
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    padding: 24,
    minHeight: 450,
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
});
