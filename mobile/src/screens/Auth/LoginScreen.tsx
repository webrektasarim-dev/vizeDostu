import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../../store/slices/authSlice';
import { AuthService } from '../../services/auth.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    
    try {
      const { user, accessToken } = await AuthService.login(email, password);
      
      console.log('🔐 LOGIN SUCCESS:', user);
      console.log('👑 USER ROLE:', user?.role);
      
      dispatch(setUser(user));
      dispatch(setToken(accessToken));
      setLoading(false);
      
      if (user?.role === 'ADMIN') {
        Alert.alert('✅ Admin Girişi', `Hoş geldiniz ${user.fullName}!\n\nAdmin paneline erişim sağlandı! 👑`);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setLoading(false);
      
      let errorMessage = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
      
      if (error.response) {
        // Backend'den gelen hata
        if (error.response.status === 401) {
          errorMessage = '❌ Hatalı e-posta veya şifre!';
        } else if (error.response.status === 500) {
          errorMessage = '⚠️ Sunucu hatası. Lütfen tekrar deneyin.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = '⏱️ Bağlantı zaman aşımına uğradı.\n\nBackend uyanıyor, lütfen 1 dakika bekleyip tekrar deneyin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Giriş Yapılamadı', errorMessage, [
        { text: 'Tamam', style: 'default' }
      ]);
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
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Icon name="earth" size={52} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>✈️ Vize Dostu</Text>
          <Text style={styles.logoSubtext}>Dünya vizeniz bizimle güvende</Text>
        </View>
      </LinearGradient>

      <Surface style={styles.formContainer}>
        <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
        <Text style={styles.subtitleText}>Hesabınıza giriş yapın</Text>

        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />

        <TextInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon="eye" />}
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Giriş Yap
        </Button>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.registerLabel}
        >
          Yeni Hesap Oluştur
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gradient: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: '#757575',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#757575',
    fontSize: 14,
  },
  registerButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  registerLabel: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});
