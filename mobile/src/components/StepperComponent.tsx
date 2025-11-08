import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Step {
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface StepperComponentProps {
  steps: Step[];
}

export function StepperComponent({ steps }: StepperComponentProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepCircle,
                step.status === 'completed' && styles.completedCircle,
                step.status === 'current' && styles.currentCircle,
              ]}
            >
              {step.status === 'completed' ? (
                <Icon name="check" size={20} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    step.status === 'current' && styles.currentNumber,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  step.status === 'completed' && styles.completedLine,
                ]}
              />
            )}
          </View>
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepLabel,
                step.status === 'completed' && styles.completedLabel,
                step.status === 'current' && styles.currentLabel,
              ]}
            >
              {step.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    backgroundColor: '#4CAF50',
  },
  currentCircle: {
    backgroundColor: '#2196F3',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#757575',
  },
  currentNumber: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 15,
    color: '#757575',
  },
  completedLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  currentLabel: {
    color: '#2196F3',
    fontWeight: '700',
  },
});
