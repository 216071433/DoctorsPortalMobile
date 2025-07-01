import React from 'react';
import { ScrollView, View } from 'react-native';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <View className="flex flex-row h-full">
      <Sidebar />
      <ScrollView 
        className="flex-1 bg-gray-50 p-8"
        contentContainerStyle={{ flex: 1 }}
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default DashboardLayout;