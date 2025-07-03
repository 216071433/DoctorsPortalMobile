import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ArrowLeft, Clock, Users, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Patient {
  appointment_id: string;
  user: {
    first_name: string;
    last_name: string;
  };
  analysis: string;
  condition: string;
  symptoms: string;
  appointment_date?: string;
  appointment_time?: string;
  date?: string;
  start_time?: string;
  status: string;
}

const Patients = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Patient | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const [doctorId, token] = await Promise.all([
          AsyncStorage.getItem('doctor_id'),
          AsyncStorage.getItem('token'),
        ]);

        const response = await axios.get(
          `https://careapi-fgix.onrender.com/api/v1/appointment/doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedAppointment) return;
    
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('appointment_id', selectedAppointment.appointment_id);
      formData.append('status_value', newStatus);

      await axios.put(
        `https://careapi-fgix.onrender.com/api/v1/appointment/schedule/${selectedAppointment.appointment_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(appointments.map(appt => 
        appt.appointment_id === selectedAppointment.appointment_id 
          ? { ...appt, status: newStatus } 
          : appt
      ));
      setStatusModalVisible(false);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          backgroundColor: '#dbeafe', // bg-blue-100
          borderColor: '#bfdbfe',     // border-blue-200
        };
      case 'pending':
        return {
          backgroundColor: '#fef9c3', // bg-yellow-100
          borderColor: '#fef08a',     // border-yellow-200
        };
      case 'cancelled':
        return {
          backgroundColor: '#fee2e2', // bg-red-100
          borderColor: '#fecaca',     // border-red-200
        };
      default:
        return {
          backgroundColor: '#f3f4f6', // bg-gray-100
          borderColor: '#e5e7eb',     // border-gray-200
        };
    }
  };

  const formatSymptoms = (symptoms: string) => {
    if (!symptoms) return 'N/A';
    try {
      const parsed = JSON.parse(symptoms);
      return Array.isArray(parsed) ? parsed.join(', ') : symptoms;
    } catch {
      return symptoms;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPatients = appointments.length;
  const approvedCount = appointments.filter(a => a.status === 'approved').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-white/80 border-b border-blue-100 py-4 px-4">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <ArrowLeft className="text-blue-600" size={20} />
            <Text className="text-blue-600 ml-2">Back to Calendar</Text>
          </TouchableOpacity>
          <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
            <Users className="text-white" size={20} />
          </View>
          <Text className="text-xl font-bold text-blue-600">Patients Treated</Text>
        </View>
      </View>

      <ScrollView className="px-4 py-6">
        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-full md:w-[32%] mb-4">
            <View className="bg-white rounded-lg shadow p-6">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-gray-600 mb-1">Total Patients</Text>
                  <Text className="text-3xl font-bold text-gray-900">{totalPatients}</Text>
                </View>
                <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
                  <Users className="text-blue-700" size={24} />
                </View>
              </View>
            </View>
          </View>

          <View className="w-full md:w-[32%] mb-4">
            <View className="bg-white rounded-lg shadow p-6">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-gray-600 mb-1">Approved</Text>
                  <Text className="text-3xl font-bold text-gray-900">{approvedCount}</Text>
                </View>
                <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center">
                  <Clock className="text-green-700" size={24} />
                </View>
              </View>
            </View>
          </View>

          <View className="w-full md:w-[32%] mb-4">
            <View className="bg-white rounded-lg shadow p-6">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-gray-600 mb-1">Cancelled</Text>
                  <Text className="text-3xl font-bold text-gray-900">{cancelledCount}</Text>
                </View>
                <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center">
                  <XCircle className="text-red-700" size={24} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Patients Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderBg}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderTitle}>Patient Treatment Records</Text>
            </View>
          </View>
          <ScrollView horizontal>
            <View style={styles.tableContent}>
              {/* Table Header */}
              <View style={styles.tableRowHeader}>
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Patient</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Analysis</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Symptoms</Text></View>
                 <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Condition</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Status</Text></View>
               
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>Date of Appointment</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableHeaderText}>TimeSlot of Appointment</Text></View>
              </View>
              {/* Table Rows */}
              {appointments.map((appt) => (
                <View key={appt.appointment_id} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellText}>
                      {appt.user.first_name} {appt.user.last_name}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[styles.tableCellText, { color: '#2563eb', fontWeight: '500' }]}>{appt.analysis}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellText}>{formatSymptoms(appt.symptoms)}</Text>
                  </View>
                   <View style={styles.tableCol}>
                    <Text style={styles.tableCellText}>{formatSymptoms(appt.condition)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAppointment(appt);
                        setStatusModalVisible(true);
                      }}
                      style={[styles.statusButton, getStatusStyle(appt.status)]}
                    >
                      <Text style={styles.tableCellText}>
                        {appt.status === 'approved' ? 'approved' : 
                          appt.status === 'pending' ? 'pending' : 
                          appt.status === 'cancelled' ? 'cancelled' : appt.status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellText}>{appt.appointment_date}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellText}>{appt.appointment_time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 320 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Change Status</Text>
            {selectedAppointment && (
              <>
                <Text style={{ marginBottom: 16 }}>
                  {selectedAppointment.user.first_name}&apos;s Appointment
                </Text>
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={{ padding: 12, backgroundColor: '#dbeafe', borderRadius: 8, marginBottom: 8 }}
                    onPress={() => handleStatusChange('approved')}
                  >
                    <Text>Approved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 12, backgroundColor: '#fef9c3', borderRadius: 8, marginBottom: 8 }}
                    onPress={() => handleStatusChange('pending')}
                  >
                    <Text>Pending</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginBottom: 8 }}
                    onPress={() => handleStatusChange('cancelled')}
                  >
                    <Text>Cancelled</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity
              style={{ marginTop: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 }}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  tableHeaderBg: {
    backgroundColor: '#2563eb',
    padding: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeaderTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableContent: {
    padding: 16,
    minWidth: 900, // Ensures horizontal scroll if content is wide
  },
  tableRowHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCol: {
    width: 150,
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontWeight: '600',
    fontSize: 15,
  },
  tableCellText: {
    fontSize: 14,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default Patients;