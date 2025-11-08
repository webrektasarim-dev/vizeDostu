import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChatBubbleProps {
  message: string;
  sender: 'USER' | 'AI';
  timestamp?: string;
}

export function ChatBubble({ message, sender, timestamp }: ChatBubbleProps) {
  const isUser = sender === 'USER';

  if (isUser) {
    return (
      <View style={[styles.container, styles.userContainer]}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message}</Text>
          {timestamp && <Text style={styles.userTimestamp}>{timestamp}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.aiContainer]}>
      <View style={styles.aiAvatar}>
        <Icon name="robot" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{message}</Text>
        {timestamp && <Text style={styles.aiTimestamp}>{timestamp}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
    elevation: 2,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiBubble: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
    elevation: 1,
  },
  aiText: {
    color: '#212121',
    fontSize: 15,
    lineHeight: 20,
  },
  aiTimestamp: {
    color: '#757575',
    fontSize: 11,
    marginTop: 4,
  },
});
