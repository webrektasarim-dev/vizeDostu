import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthService } from '../../services/auth.service';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // Email validasyonu
    if (!email.includes('@')) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      await AuthService.register(email, password, fullName);
      
      setTimeout(() => {
        Alert.alert(
          '✅ Başarılı', 
          'Hesabınız oluşturuldu! Giriş yapabilirsiniz.', 
          [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]
        );
      }, 100);
    } catch (error: any) {
      console.error('❌ Register error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);

      let errorMessage = 'Kayıt yapılamadı. Lütfen tekrar deneyin.';

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = '⏱️ Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.';
      } else if (error.response?.status === 409) {
        errorMessage = '📧 Bu e-posta adresi zaten kullanılıyor. Giriş yapmayı deneyin.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || '❌ Geçersiz bilgiler. Lütfen kontrol edin.';
      } else if (error.response?.status === 500) {
        errorMessage = '🔧 Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      } else if (!error.response) {
        errorMessage = '🌐 Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
      }

      setTimeout(() => {
        Alert.alert('Kayıt Hatası', errorMessage);
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Icon name="account-plus" size={80} color="#FFFFFF" />
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.subtitleText}>Yeni hesap oluşturun</Text>
          </View>

          <Surface style={styles.surface}>
            <TextInput
              label="Ad Soyad"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Şifre (min. 6 karakter)"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor="#667eea"
            >
              Kayıt Ol
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              textColor="#667eea"
            >
              Zaten hesabınız var mı? Giriş Yapın
            </Button>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  subtitleText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  surface: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginButton: {
    marginTop: 16,
  },
});

