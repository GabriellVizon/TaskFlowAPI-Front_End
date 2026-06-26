import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';
import { Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

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

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.white} />
      <Text style={styles.loadingText}>CARREGANDO...</Text>
    </View>
  );
}

function AppContent() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(null);

  useEffect(() => {
    Font.loadAsync({
      'Metropolis': Montserrat_400Regular,
      'Montserrat': Montserrat_600SemiBold,
      'Montserrat-Bold': Montserrat_700Bold,
      'JetBrains Mono': JetBrainsMono_500Medium,
    })
      .then(() => setFontsLoaded(true))
      .catch((err) => {
        console.error('Font loading error:', err);
        setFontError(true);
      });
  }, []);

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, backgroundColor: '#121414', padding: 20, justifyContent: 'center' },
  errorTitle: { color: '#ffb4ab', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  errorText: { color: '#e3e2e2', fontSize: 14 },
  loadingContainer: { flex: 1, backgroundColor: '#121414', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#e3e2e2', fontSize: 16, marginTop: 16, letterSpacing: 2 },
});
