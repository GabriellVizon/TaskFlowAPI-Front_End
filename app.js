import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error) {
    this.setState({ error: error.toString() });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>ERRO:</Text>
          <Text style={styles.errorText}>{this.state.error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, backgroundColor: '#121414', padding: 20, justifyContent: 'center' },
  errorTitle: { color: '#ffb4ab', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  errorText: { color: '#e3e2e2', fontSize: 14 },
});
