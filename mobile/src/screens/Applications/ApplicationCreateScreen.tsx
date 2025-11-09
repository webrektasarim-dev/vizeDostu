import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ApplicationService } from '../../services/application.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COUNTRIES = ['Fransa', 'İtalya', 'Almanya', 'İngiltere', 'İspanya', 'Hollanda', 'Belçika'];
const VISA_TYPES = ['Turistik', 'İş', 'Eğitim', 'Aile Ziyareti'];

export default function ApplicationCreateScreen({ navigation }: any) {
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!country || !visaType) {
      Alert.alert('Eksik Bilgi', 'Lütfen ülke ve vize tipi seçin');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Creating application:', { country, visaType, notes });
      
      const result = await ApplicationService.createApplication({
        country,
        visaType,
        notes,
      });
      
      console.log('✅ Application created:', result);
      
      Alert.alert(
        '✅ Başarılı!', 
        'Başvurunuz oluşturuldu. Şimdi belgelerinizi yükleyebilirsiniz.',
        [
          {
            text: 'Belgelere Git',
            onPress: () => {
              navigation.navigate('Documents');
              setTimeout(() => navigation.goBack(), 100);
            }
          },
          {
            text: 'Tamam',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Create application error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      
      Alert.alert(
        'Hata', 
        error.response?.data?.message || error.message || 'Başvuru oluşturulamadı'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53', '#FFA726']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>✈️ Yeni Vize Başvurusu</Text>
        <Text style={styles.subtitle}>Başvuru bilgilerinizi girin</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.section}>
          <Text style={styles.label}>🌍 Ülke Seçin</Text>
          <View style={styles.chipContainer}>
            {COUNTRIES.map((c) => (
              <Chip
                key={c}
                selected={country === c}
                onPress={() => setCountry(c)}
                style={[styles.chip, country === c && styles.selectedChip]}
                textStyle={country === c ? styles.selectedChipText : {}}
              >
                {c}
              </Chip>
            ))}
          </View>
        </Surface>

        <Surface style={styles.section}>
          <Text style={styles.label}>📋 Vize Tipi</Text>
          <View style={styles.chipContainer}>
            {VISA_TYPES.map((v) => (
              <Chip
                key={v}
                selected={visaType === v}
                onPress={() => setVisaType(v)}
                style={[styles.chip, visaType === v && styles.selectedChip]}
                textStyle={visaType === v ? styles.selectedChipText : {}}
              >
                {v}
              </Chip>
            ))}
          </View>
        </Surface>

        <Surface style={styles.section}>
          <Text style={styles.label}>📝 Notlar (Opsiyonel)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Başvurunuzla ilgili notlar..."
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        </Surface>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={loading || !country || !visaType}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="check"
        >
          Başvuru Oluştur
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 10,
  },
});

