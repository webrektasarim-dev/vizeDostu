import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickActionButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function QuickActionButton({ 
  title, 
  iconName, 
  onPress, 
  variant = 'primary' 
}: QuickActionButtonProps) {
  const gradientColors = variant === 'primary' 
    ? ['#2196F3', '#1976D2'] 
    : ['#4CAF50', '#388E3C'];

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={iconName} size={28} color="#FFFFFF" />
        <Text style={styles.title}>{title}</Text>
        <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
