import { useNavigation } from '@react-navigation/native';
import { Home, LogOut, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../(auth)/AuthContext";

const Sidebar = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", screen: "Dashboard" },
    { icon: Users, label: "Patients", screen: "Patients" },
  ];

  // Get current route name (similar to useLocation in react-router)
  const currentRoute = navigation.getState()?.routes[navigation.getState()?.index ?? 0]?.name;

  return (
    <View style={styles.sidebar}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Appointments</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.navContainer}>
        <View style={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.screen;
            return (
              <TouchableOpacity
                key={item.screen}
                onPress={() => navigation.navigate(item.screen as never)}
                style={[styles.navItem, isActive ? styles.navItemActive : styles.navItemInactive]}
              >
                <Icon size={20} color={isActive ? '#111827' : '#4B5563'} />
                <Text style={[styles.navItemText, isActive ? styles.navItemTextActive : styles.navItemTextInactive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut size={20} color="#4B5563" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    width: 256, // 64 * 4 (Tailwind w-64)
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb', // Tailwind border-gray-200
    flexDirection: 'column',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navContainer: {
    flex: 1,
    padding: 16,
  },
  navList: {
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#f3f4f6', // Tailwind bg-gray-100
  },
  navItemInactive: {
    backgroundColor: 'transparent',
  },
  navItemText: {
    fontSize: 16,
    marginLeft: 8,
  },
  navItemTextActive: {
    color: '#111827',
    fontWeight: '500',
  },
  navItemTextInactive: {
    color: '#4B5563',
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#4B5563',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Sidebar;
