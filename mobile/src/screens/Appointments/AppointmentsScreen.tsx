import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Text, Card, Button, TextInput, Chip, FAB } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EmptyState } from '../../components/EmptyState';

export default function AppointmentsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      title: 'VFS Global - Fransa Vizesi',
      date: '2024-11-15',
      time: '14:30',
      location: 'VFS Global İstanbul',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'İtalya Konsolosluğu',
      date: '2024-11-20',
      time: '10:00',
      location: 'İtalya Konsolosluğu Ankara',
      status: 'upcoming',
    },
  ]);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });

  const handleCreateAppointment = () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time || !newAppointment.location) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun');
      return;
    }

    const appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'upcoming',
    };
    setAppointments([...appointments, appointment]);
    setModalVisible(false);
    setNewAppointment({ title: '', date: '', time: '', location: '' });
    Alert.alert('Başarılı', 'Randevu oluşturuldu');
  };

  const handleCancelAppointment = (id: string) => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Randevuyu iptal etmek istediğinize emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: () => {
            setAppointments(appointments.filter((a) => a.id !== id));
            Alert.alert('Başarılı', 'Randevu iptal edildi');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#388E3C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>📅 Randevular</Text>
            <Text style={styles.subtitle}>{appointments.length} aktif randevu</Text>
          </View>
          <Icon name="calendar-check" size={48} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {appointments.length === 0 ? (
        <EmptyState
          icon="calendar-blank"
          title="Randevu Yok"
          subtitle="Henüz hiç randevunuz bulunmuyor"
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {appointments.map((appointment) => (
            <Card key={appointment.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Icon name="calendar-check" size={32} color="#4CAF50" />
                  <Chip icon="clock" style={styles.statusChip} textStyle={styles.chipText}>
                    Yaklaşan
                  </Chip>
                </View>

                <Text style={styles.appointmentTitle}>{appointment.title}</Text>

                <View style={styles.detailRow}>
                  <Icon name="calendar" size={18} color="#757575" />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="clock-outline" size={18} color="#757575" />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="map-marker" size={18} color="#757575" />
                  <Text style={styles.detailText}>{appointment.location}</Text>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => Alert.alert('Detay', `${appointment.title}\n\n${appointment.date} ${appointment.time}\n${appointment.location}`)}
                    style={styles.actionButton}
                    icon="eye"
                  >
                    Detay
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleCancelAppointment(appointment.id)}
                    style={styles.actionButton}
                    textColor="#F44336"
                    icon="close"
                  >
                    İptal
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      <FAB
        icon="plus"
        label="Yeni Randevu"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        color="#FFFFFF"
      />

      {/* Create Appointment Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Yeni Randevu</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color="#757575" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Randevu Başlığı"
              value={newAppointment.title}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, title: text })}
              mode="outlined"
              placeholder="Örn: VFS Global - Fransa Vizesi"
              style={styles.input}
            />
            <TextInput
              label="Tarih (YYYY-MM-DD)"
              value={newAppointment.date}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, date: text })}
              mode="outlined"
              placeholder="2024-12-25"
              style={styles.input}
            />
            <TextInput
              label="Saat"
              value={newAppointment.time}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, time: text })}
              mode="outlined"
              placeholder="14:30"
              style={styles.input}
            />
            <TextInput
              label="Konum"
              value={newAppointment.location}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, location: text })}
              mode="outlined"
              placeholder="VFS Global İstanbul"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleCreateAppointment}
              style={styles.saveButton}
              icon="check"
            >
              Randevu Oluştur
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
    marginBottom: 16,
    borderRadius: 20,
    elevation: 3,
  },
  cardHeader: {
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
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#4CAF50',
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
    minHeight: 500,
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

