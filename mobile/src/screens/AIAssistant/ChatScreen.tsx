import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, IconButton, ActivityIndicator, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatBubble } from '../../components';
import { AIService } from '../../services/ai.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Message {
  id: string;
  message: string;
  sender: 'USER' | 'AI';
  createdAt: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await AIService.getChatHistory(20);
    setMessages(history);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: inputText,
      sender: 'USER',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');
    setLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      console.log('Sending message to AI:', currentMessage);
      const response = await AIService.sendMessage(currentMessage);
      console.log('AI Response:', response);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: response.message || response.response || response || 'AI yanıtı alınamadı',
        sender: 'AI',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      console.error('Error details:', error.response?.data);
      
      // Hata durumunda dost canlısı mesaj göster
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: '😔 Üzgünüm, şu anda yanıt veremiyorum. Backend bağlantısını kontrol eder misiniz?\n\nHata: ' + (error.response?.data?.message || error.message || 'Bilinmeyen hata'),
        sender: 'AI',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <ChatBubble
        message={item.message}
        isUser={item.sender === 'USER'}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <LinearGradient
        colors={['#9C27B0', '#7B1FA2', '#6A1B9A']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Icon name="robot-excited" size={36} color="#FFFFFF" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>AI Vize Asistanı 🤖</Text>
            <Text style={styles.headerSubtitle}>GPT-4 destekli akıllı yardımcınız</Text>
          </View>
        </View>
      </LinearGradient>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Icon name="chat-processing" size={64} color="#9C27B0" />
          </View>
          <Text style={styles.emptyTitle}>Merhaba! 👋</Text>
          <Text style={styles.emptyText}>
            Vize ve pasaport işlemleriniz hakkında size nasıl yardımcı olabilirim?
          </Text>
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionLabel}>💡 Popüler Sorular:</Text>
            <View style={styles.suggestionChip}>
              <Icon name="airplane-takeoff" size={16} color="#9C27B0" />
              <Text style={styles.suggestion}>İtalya'ya turistik vize için hangi belgeler gerekli?</Text>
            </View>
            <View style={styles.suggestionChip}>
              <Icon name="passport" size={16} color="#9C27B0" />
              <Text style={styles.suggestion}>Pasaportumun süresi ne zaman dolacak?</Text>
            </View>
            <View style={styles.suggestionChip}>
              <Icon name="calendar-clock" size={16} color="#9C27B0" />
              <Text style={styles.suggestion}>VFS Global randevusu nasıl alınır?</Text>
            </View>
            <View style={styles.suggestionChip}>
              <Icon name="cash" size={16} color="#9C27B0" />
              <Text style={styles.suggestion}>Schengen vizesi ne kadar tutar?</Text>
            </View>
            <View style={styles.suggestionChip}>
              <Icon name="clock-time-four" size={16} color="#9C27B0" />
              <Text style={styles.suggestion}>Vize başvurusu ne kadar sürer?</Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color="#9C27B0" />
          <Text style={styles.loadingText}>AI düşünüyor...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Mesajınızı yazın..."
          mode="outlined"
          style={styles.input}
          multiline
          maxLength={500}
          disabled={loading}
          outlineStyle={styles.inputOutline}
        />
        <IconButton
          icon="send"
          mode="contained"
          size={24}
          onPress={handleSend}
          disabled={loading || !inputText.trim()}
          style={styles.sendButton}
          iconColor="#FFFFFF"
          containerColor="#9C27B0"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9C27B0',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  suggestionContainer: {
    width: '100%',
    backgroundColor: '#F3E5F5',
    padding: 20,
    borderRadius: 16,
  },
  suggestionLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#9C27B0',
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestion: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
    flex: 1,
  },
  messageList: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3E5F5',
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#9C27B0',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 110, // Floating tab bar için boşluk
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 16,
  },
  sendButton: {
    marginBottom: 4,
  },
});
