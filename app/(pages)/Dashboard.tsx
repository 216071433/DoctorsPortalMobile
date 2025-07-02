import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <Stack.Screen options={{ headerTitle: '' }} />
      <View style={{ flex: 1, flexDirection: 'row', height: '100%' }}>
        <Sidebar />
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#f9fafb', padding: 32 }}
          contentContainerStyle={{ flex: 1 }}
        >
          {children}
        </ScrollView>
      </View>
    </>
  );
};

export default DashboardLayout;