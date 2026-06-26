import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../services/api';
import { colors, fonts } from '../styles/theme';

export default function AdminScreen({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  useEffect(() => {
    loadAgendamentos();
  }, []);

  async function loadAgendamentos() {
    try {
      const data = await api.agendamentos.list();
      setAgendamentos(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function formatDate(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function handleCancel(item) {
    Alert.alert(
      'Cancelar Agendamento',
      `Deseja cancelar o agendamento de ${item.nomeUsuario} com ${item.nomeBarbeiro}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.agendamentos.delete(item.id);
              Alert.alert('Cancelado', 'Agendamento cancelado com sucesso.');
              loadAgendamentos();
            } catch {
              Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
            }
          },
        },
      ]
    );
  }

  function handleEdit(item) {
    setEditModal(item);
    setEditDate(item.data);
    setEditTime(item.hora);
  }

  async function confirmEdit() {
    if (!editDate || !editTime) {
      Alert.alert('Erro', 'Preencha data e horário.');
      return;
    }
    try {
      await api.agendamentos.update(editModal.id, editDate, `${editTime}:00`);
      Alert.alert('Sucesso', 'Agendamento atualizado.');
      setEditModal(null);
      loadAgendamentos();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o agendamento.');
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <MaterialIcons name="person" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>{item.nomeUsuario}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleEdit(item)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={20} color={colors['on-surface']} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleCancel(item)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <MaterialIcons name="content-cut" size={18} color={colors['on-surface-variant']} />
            <Text style={styles.infoLabel}>Barbeiro</Text>
            <Text style={styles.infoValue}>{item.nomeBarbeiro}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={18} color={colors['on-surface-variant']} />
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>{formatDate(item.data)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={18} color={colors['on-surface-variant']} />
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>{item.hora.slice(0, 5)}</Text>
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
            <Text style={styles.title}>Admin</Text>
            <Text style={styles.subtitle}>Todos os agendamentos</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.white} style={styles.loading} />
      ) : agendamentos.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="calendar-today" size={48} color={colors['on-surface-variant']} />
          <Text style={styles.emptyText}>Nenhum agendamento cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadAgendamentos(); }}
        />
      )}

      <Modal visible={!!editModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Agendamento</Text>
            <Text style={styles.modalSubtitle}>
              {editModal?.nomeUsuario} — {editModal?.nomeBarbeiro}
            </Text>

            <Text style={styles.modalLabel}>Data (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              value={editDate}
              onChangeText={setEditDate}
              placeholder="2026-12-25"
              placeholderTextColor={colors['on-tertiary-container']}
            />

            <Text style={styles.modalLabel}>Horário (HH:MM)</Text>
            <TextInput
              style={styles.modalInput}
              value={editTime}
              onChangeText={setEditTime}
              placeholder="14:00"
              placeholderTextColor={colors['on-tertiary-container']}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModal(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...fonts['headline-md'],
    fontSize: 16,
    color: colors['on-surface'],
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors['surface-container'],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(76, 69, 70, 0.2)',
    marginHorizontal: 16,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    width: 60,
    textTransform: 'uppercase',
  },
  infoValue: {
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors['surface-container-high'],
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors['outline-variant'],
  },
  modalTitle: {
    ...fonts['headline-md'],
    color: colors['on-surface'],
    marginBottom: 4,
  },
  modalSubtitle: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
    marginBottom: 20,
  },
  modalLabel: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: colors['surface-container-lowest'],
    color: colors['on-surface'],
    borderRadius: 8,
    padding: 12,
    ...fonts['body-md'],
    borderWidth: 0,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalCancelText: {
    ...fonts['headline-md'],
    color: colors['on-surface-variant'],
    fontSize: 14,
  },
  modalConfirmBtn: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  modalConfirmText: {
    ...fonts['headline-md'],
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
  },
});
