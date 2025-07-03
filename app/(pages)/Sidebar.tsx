import { useRouter } from 'expo-router';
import { Home, LogOut, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from "../(auth)/AuthContext";

const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const navItems: { icon: any; label: string; path:  '/Patients' }[] = [
    // { icon: Home, label: "Dashboard", path: "/Dashboard" },
    { icon: Users, label: "Patients", path: "/Patients" },
  ];

  // Get current route path (optional, for highlighting active item)
  // You can use usePathname from expo-router if you want to highlight the active item

  return (
    <View style={styles.sidebar}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to your Portal</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.navContainer}>
        <View style={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => router.push(item.path)}
                style={[styles.navItem]}
              >
                <Icon size={20} color={'#4B5563'} />
                <Text style={[styles.navItemText, styles.navItemTextInactive]}>
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
  navItemText: {
    fontSize: 16,
    marginLeft: 8,
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
