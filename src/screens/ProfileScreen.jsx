import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { colors, fonts } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login', { redirectTo: 'Profile' });
      return;
    }
    loadAgendamentos();
  }, [user]);

  async function loadAgendamentos() {
    try {
      const data = await api.agendamentos.listByUsuario(user.id);
      setAgendamentos(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function handleCancel(item) {
    Alert.alert(
      'Cancelar Agendamento',
      `Deseja cancelar o agendamento com ${item.nomeBarbeiro}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.agendamentos.delete(item.id);
              Alert.alert('Cancelado', 'Agendamento cancelado.');
              loadAgendamentos();
            } catch {
              Alert.alert('Erro', 'Não foi possível cancelar.');
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="content-cut" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>{item.nomeBarbeiro}</Text>
          </View>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancel(item)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={16} color={colors['on-surface-variant']} />
            <Text style={styles.infoText}>{formatDate(item.data)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={16} color={colors['on-surface-variant']} />
            <Text style={styles.infoText}>{item.hora.slice(0, 5)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Meus Agendamentos</Text>
            <Text style={styles.subtitle}>{user?.nome}</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.white} style={styles.loading} />
      ) : agendamentos.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="calendar-today" size={48} color={colors['on-surface-variant']} />
          <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 69, 70, 0.3)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...fonts['headline-lg'],
    color: colors['on-surface'],
    marginBottom: 2,
  },
  subtitle: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
  },
  loading: {
    marginTop: 48,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...fonts['headline-md'],
    fontSize: 16,
    color: colors['on-surface'],
  },
  cancelBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: colors['surface-container'],
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
  },
});
