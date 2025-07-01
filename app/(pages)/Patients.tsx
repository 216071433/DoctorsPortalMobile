import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ArrowLeft, Clock, Users, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <View className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <View className="bg-blue-600 p-4">
            <View className="flex-row items-center space-x-2">
              <Users className="text-white" size={20} />
              <Text className="text-white font-bold">Patient Treatment Records</Text>
            </View>
          </View>

          <View className="p-4">
            {/* Table Header */}
            <View className="flex-row pb-3 mb-2 border-b border-gray-200">
              <View className="w-1/4">
                <Text className="font-semibold">Patient</Text>
              </View>
              <View className="w-1/4">
                <Text className="font-semibold">Analysis</Text>
              </View>
              <View className="w-1/4">
                <Text className="font-semibold">Symptoms</Text>
              </View>
              <View className="w-1/4">
                <Text className="font-semibold">Status</Text>
              </View>
            </View>

            {/* Table Rows */}
            {appointments.map((appt) => (
              <View key={appt.appointment_id} className="flex-row py-3 border-b border-gray-100">
                <View className="w-1/4">
                  <Text className="font-medium">
                    {appt.user.first_name} {appt.user.last_name}
                  </Text>
                </View>
                <View className="w-1/4">
                  <Text className="text-blue-600 font-medium">{appt.analysis}</Text>
                </View>
                <View className="w-1/4">
                  <Text className="text-sm">{formatSymptoms(appt.symptoms)}</Text>
                </View>
                <View className="w-1/4">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAppointment(appt);
                      setStatusModalVisible(true);
                    }}
                    className={`px-3 py-1 rounded-full border ${getStatusStyle(appt.status)}`}
                  >
                    <Text className="capitalize">
                      {appt.status === 'approved' ? 'approved' : 
                       appt.status === 'pending' ? 'pending' : 
                       appt.status === 'cancelled' ? 'cancelled' : appt.status}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80">
            <Text className="text-lg font-bold mb-4">Change Status</Text>
            {selectedAppointment && (
              <>
                <Text className="mb-4">
                  {selectedAppointment.user.first_name}'s Appointment
                </Text>
                <View className="space-y-2">
                  <TouchableOpacity
                    className="p-3 bg-blue-50 rounded-lg"
                    onPress={() => handleStatusChange('approved')}
                  >
                    <Text>Approved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-3 bg-yellow-50 rounded-lg"
                    onPress={() => handleStatusChange('pending')}
                  >
                    <Text>Pending</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-3 bg-red-50 rounded-lg"
                    onPress={() => handleStatusChange('cancelled')}
                  >
                    <Text>Cancelled</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity
              className="mt-4 p-3 bg-gray-100 rounded-lg"
              onPress={() => setStatusModalVisible(false)}
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Patients;