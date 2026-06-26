import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts } from '../styles/theme';

const tabs = [
  { key: 'Home', icon: 'home', label: 'Home' },
  { key: 'Book', icon: 'calendar-today', label: 'Book' },
  { key: 'Barbers', icon: 'content-cut', label: 'Barbers' },
  { key: 'Profile', icon: 'person', label: 'Profile' },
];

export default function BottomNavBar({ activeTab, onTabPress }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={isActive ? colors['on-surface'] : colors['on-surface-variant']}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors['on-surface'] : colors['on-surface-variant'] },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(31, 32, 32, 0.6)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 69, 70, 0.2)',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  tabLabel: {
    ...fonts['label-sm'],
    fontSize: 10,
    marginTop: 2,
  },
});
