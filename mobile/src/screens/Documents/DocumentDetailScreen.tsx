import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DocumentDetailScreen({ route, navigation }: any) {
  const { document } = route?.params || {};

  const handleDelete = () => {
    Alert.alert(
      'Belgeyi Sil',
      'Bu belgeyi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Başarılı', 'Belge silindi');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9800', '#F57C00']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name="file-document" size={80} color="#FFFFFF" />
        <Text style={styles.title}>Belge Detayı</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.fileName}>passport_scan.pdf</Text>
            <Chip icon="check-circle" style={styles.statusChip} textStyle={styles.chipText}>
              Geçerli
            </Chip>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="file-document" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Belge Tipi</Text>
                <Text style={styles.value}>Pasaport</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="earth" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Ülke</Text>
                <Text style={styles.value}>İtalya</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Yüklenme Tarihi</Text>
                <Text style={styles.value}>7 Kasım 2024</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="file-chart" size={20} color="#757575" />
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Boyut</Text>
                <Text style={styles.value}>2.4 MB</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => Alert.alert('İndir', 'Belge indirme özelliği yakında!')}
          style={styles.button}
          icon="download"
          buttonColor="#2196F3"
        >
          Belgeyi İndir
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          icon="delete"
          textColor="#F44336"
        >
          Belgeyi Sil
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
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
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
  fileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  statusChip: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
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
});

