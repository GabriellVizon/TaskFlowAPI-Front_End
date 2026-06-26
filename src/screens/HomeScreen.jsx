import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../styles/theme';
import { api } from '../services/api';
import { getToken } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import ServiceCard from '../components/ServiceCard';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC88IXzMGv3MfVbrWVzUpEEXWXpNPjYl5UaCE7fi3uL5SlDpSJ8Io3dykiqYcGjfc0OH01oy3285PlsEe3KMYuKAMNqxQu2gRqGnX0vJ8wVpvoW5wkiV-Fv72NV53jjQt1RzBLcQ7EOE7JRwtWdEaR1ot0UKBGmJ3g2qx_bnjMWneDFO1mcXIq3azKgiu22RXn0rrgCUI1uAhTe69YU2PEVrHToTefrb3bEfZ_5mvJoXk3hOcV3WXufhoHjbA436qx_RTN2jIhBYkCW';

const services = [
  {
    icon: 'content_cut',
    price: '$45',
    title: 'Haircut',
    description:
      'Corte de cabelo preciso utilizando técnicas clássicas e modernas, finalizado com lavagem premium e styling.',
    duration: '45 MIN',
    tag: 'PREMIUM',
  },
  {
    icon: 'face',
    price: '$30',
    title: 'Beard',
    description:
      'Desenho e aparo de barba com máquina e tesoura, hidratação com óleos essenciais e alinhamento facial.',
    duration: '30 MIN',
    tag: 'DETALHE',
  },
  {
    icon: 'scooter',
    price: '$40',
    title: 'Shaving',
    description:
      'Barbear clássico com navalha, toalha quente, espuma artesanal e massagem facial relaxante.',
    duration: '40 MIN',
    tag: 'RITUAL',
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const serviceOptions = [
  { label: 'Haircut - $45', value: '1' },
  { label: 'Beard - $30', value: '2' },
  { label: 'Shaving - $40', value: '3' },
  { label: 'Completo (Corte + Barba) - $70', value: '4' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [showServices, setShowServices] = useState(false);
  const [showBarbers, setShowBarbers] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.barbeiros.list().then(setBarbers).catch(() => {});
  }, []);

  async function handleBooking() {
    if (!selectedService || !selectedDate || !selectedTime || !selectedBarber) {
      Alert.alert('Erro', 'Preencha todos os campos do agendamento.');
      return;
    }

    const token = await getToken();
    if (!token) {
      Alert.alert('Login necessário', 'Por favor, faça login para realizar um agendamento.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      return;
    }

    try {
      await api.agendamentos.create(
        selectedDate,
        selectedTime,
        user.nome,
        selectedBarber
      );
      Alert.alert('Sucesso', 'Agendamento confirmado com sucesso!');
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedBarber('');
      setClientName('');
    } catch (e) {
      Alert.alert('Erro', e.message || 'Falha ao agendar. Verifique as vagas do dia.');
    }
  }

  function scrollTo(section) {
    const offsets = { servicos: 700, agendar: 1400 };
    scrollRef.current?.scrollTo({ y: offsets[section] || 0, animated: true });
  }

  function handleTabPress(tab) {
    setActiveTab(tab);
    if (tab === 'Home') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else if (tab === 'Book') {
      scrollTo('agendar');
    } else if (tab === 'Barbers') {
      scrollTo('servicos');
    } else if (tab === 'Profile') {
      getToken().then((t) => {
        if (t) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('Login', { redirectTo: 'Profile' });
        }
      });
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopAppBar navigation={navigation} />
      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Tradição & Estilo</Text>
            <Text style={styles.heroSubtitle}>
              O ritual da barbearia clássica elevado ao patamar de arte. Experiência premium para o
              homem contemporâneo.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.heroPrimaryButton}
                onPress={() => scrollTo('agendar')}
              >
                <Text style={styles.heroPrimaryButtonText}>Agendar Agora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.heroOutlineButton}
                onPress={() => scrollTo('servicos')}
              >
                <Text style={styles.heroOutlineButtonText}>Ver Serviços</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.sectionContainer} id="servicos">
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionLabel}>A Experiência</Text>
              <Text style={styles.sectionTitle}>Nossos Serviços</Text>
            </View>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.servicesGrid}>
            {services.map((svc, index) => (
              <ServiceCard key={index} {...svc} />
            ))}
          </View>
        </View>

        {/* Booking Section */}
        <View style={styles.bookingSection} id="agendar">
          <View style={styles.bookingInner}>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingTitle}>Reserve seu Horário</Text>
              <Text style={styles.bookingDescription}>
                Escolha o serviço desejado, a data e o horário. Nossa equipe estará pronta para
                recebê-lo com exclusividade.
              </Text>
              <View style={styles.infoItems}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <MaterialIcons name="location-on" size={24} color={colors['on-surface']} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Localização</Text>
                    <Text style={styles.infoText}>Av. das Navalhas, 1920 - Centro</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <MaterialIcons name="schedule" size={24} color={colors['on-surface']} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Horário</Text>
                    <Text style={styles.infoText}>Segunda - Sábado: 09h às 21h</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.bookingForm}>
              {/* Service Select */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Serviço</Text>
                <TouchableOpacity
                  style={styles.selectField}
                  onPress={() => setShowServices(!showServices)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !selectedService && styles.selectPlaceholder,
                    ]}
                  >
                    {selectedService
                      ? serviceOptions.find((o) => o.value === selectedService)?.label
                      : 'Selecione um serviço...'}
                  </Text>
                  <MaterialIcons
                    name={showServices ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={colors['on-surface']}
                  />
                </TouchableOpacity>
                {showServices && (
                  <View style={styles.dropdown}>
                    {serviceOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          selectedService === option.value && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedService(option.value);
                          setShowServices(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Barber Select */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Barbeiro</Text>
                <TouchableOpacity
                  style={styles.selectField}
                  onPress={() => setShowBarbers(!showBarbers)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !selectedBarber && styles.selectPlaceholder,
                    ]}
                  >
                    {selectedBarber || 'Selecione um barbeiro...'}
                  </Text>
                  <MaterialIcons
                    name={showBarbers ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={colors['on-surface']}
                  />
                </TouchableOpacity>
                {showBarbers && (
                  <View style={styles.dropdown}>
                    {barbers.map((b) => (
                      <TouchableOpacity
                        key={b.id}
                        style={[
                          styles.dropdownItem,
                          selectedBarber === b.nome && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedBarber(b.nome);
                          setShowBarbers(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{b.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Date and Time Row */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Data</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors['on-tertiary-container']}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Horário</Text>
                  <TouchableOpacity
                    style={styles.selectField}
                    onPress={() => setShowTimes(!showTimes)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        !selectedTime && styles.selectPlaceholder,
                      ]}
                    >
                      {selectedTime || 'Selecione'}
                    </Text>
                    <MaterialIcons
                      name={showTimes ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={24}
                      color={colors['on-surface']}
                    />
                  </TouchableOpacity>
                  {showTimes && (
                    <View style={styles.dropdown}>
                      {timeSlots.map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.dropdownItem,
                            selectedTime === time && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setSelectedTime(time);
                            setShowTimes(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>{time}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Name Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.textInput}
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder="Seu nome aqui"
                  placeholderTextColor={colors['on-tertiary-container']}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleBooking}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Confirmar Agendamento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Newsletter Section */}
        <View style={styles.newsletterSection}>
          <View style={styles.newsletterInner}>
            <Text style={styles.newsletterTitle}>Club Navalha</Text>
            <Text style={styles.newsletterDescription}>
              Receba conteúdos exclusivos sobre estilo masculino e ofertas especiais diretamente no
              seu e-mail.
            </Text>
            <View style={styles.newsletterForm}>
              <TextInput
                style={styles.newsletterInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Seu melhor e-mail"
                placeholderTextColor={colors['on-tertiary-container']}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.newsletterButton} activeOpacity={0.8}>
                <Text style={styles.newsletterButtonText}>Assinar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 BARBEARIA NAVALHA. ALL RIGHTS RESERVED.
          </Text>
        </View>
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },

  // Hero
  heroSection: {
    height: 500,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['margin-mobile'],
    zIndex: 10,
  },
  heroTitle: {
    ...fonts['display-lg-mobile'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroSubtitle: {
    ...fonts['body-lg'],
    color: colors['on-surface-variant'],
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  heroPrimaryButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  heroPrimaryButtonText: {
    ...fonts['headline-md'],
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroOutlineButton: {
    borderWidth: 1,
    borderColor: colors.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  heroOutlineButtonText: {
    ...fonts['headline-md'],
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Services
  sectionContainer: {
    paddingVertical: 96,
    paddingHorizontal: spacing['margin-mobile'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 64,
  },
  sectionHeaderLeft: {},
  sectionLabel: {
    ...fonts['label-sm'],
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 3.2,
    marginBottom: 16,
  },
  sectionTitle: {
    ...fonts['display-lg-mobile'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
  },
  sectionDivider: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(76, 69, 70, 0.3)',
    marginLeft: 32,
    marginBottom: 16,
  },
  servicesGrid: {
    gap: spacing.gutter,
  },

  // Booking
  bookingSection: {
    paddingVertical: 96,
    backgroundColor: colors['surface-container-lowest'],
  },
  bookingInner: {
    paddingHorizontal: spacing['margin-mobile'],
    gap: 64,
  },
  bookingInfo: {},
  bookingTitle: {
    ...fonts['display-lg-mobile'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
    lineHeight: 42,
  },
  bookingDescription: {
    ...fonts['body-lg'],
    color: colors['on-surface-variant'],
    marginTop: 16,
    maxWidth: 400,
  },
  infoItems: {
    marginTop: 32,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    ...fonts['label-sm'],
    color: colors.primary,
    textTransform: 'uppercase',
  },
  infoText: {
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  bookingForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.gutter,
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    height: 56,
    paddingHorizontal: 16,
  },
  selectText: {
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  selectPlaceholder: {
    color: colors['on-tertiary-container'],
  },
  dropdown: {
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    marginTop: -4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors['outline-variant'],
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dropdownText: {
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dateInput: {
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    height: 56,
    paddingHorizontal: 16,
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  textInput: {
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    height: 56,
    paddingHorizontal: 16,
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  submitButton: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    ...fonts['headline-md'],
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 4.8,
    fontWeight: '700',
  },

  // Newsletter
  newsletterSection: {
    paddingVertical: 80,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 69, 70, 0.2)',
    paddingHorizontal: spacing['margin-mobile'],
  },
  newsletterInner: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    alignItems: 'center',
    gap: 24,
  },
  newsletterTitle: {
    ...fonts['headline-lg'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
  },
  newsletterDescription: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
    textAlign: 'center',
  },
  newsletterForm: {
    flexDirection: 'row',
    width: '100%',
    gap: 0,
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    height: 56,
    paddingHorizontal: 24,
    ...fonts['body-md'],
    color: colors['on-surface'],
  },
  newsletterButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 40,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterButtonText: {
    ...fonts['label-sm'],
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Footer
  footer: {
    paddingVertical: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 69, 70, 0.1)',
    alignItems: 'center',
    paddingHorizontal: spacing['margin-mobile'],
  },
  footerText: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
