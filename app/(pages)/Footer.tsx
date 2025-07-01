import { Ambulance, Clock } from "lucide-react-native";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Footer = () => {
  const operatingHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 3:00 PM" }
  ];

  const services = [
    "General Consultation",
    "Surgery",
    "Cardiology",
    "Psychiatry",
    "Neurology"
  ];

  const handleEmergencyCall = () => {
    Linking.openURL("tel:112");
  };

  return (
    <View style={styles.footer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.row}>
            {/* Company Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Healify</Text>
              <Text style={styles.sectionText}>
                Your trusted healthcare partner. Schedule appointments with specialized 
                doctors and get the care you deserve.
              </Text>
            </View>

            {/* Services */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Services</Text>
              <View style={styles.gap2}>
                {services.map((service) => (
                  <Text key={service} style={styles.sectionText}>
                    {service}
                  </Text>
                ))}
                <TouchableOpacity 
                  style={styles.emergencyButton}
                  onPress={handleEmergencyCall}
                >
                  <Ambulance size={16} color="#dc2626" />
                  <Text style={styles.emergencyText}>Emergency: 112</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Operating Hours */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Operating Hours</Text>
              <View style={styles.gap2}>
                {operatingHours.map(({ day, hours }) => (
                  <View key={day} style={styles.operatingHourRow}>
                    <Clock size={16} color="#4b5563" />
                    <View>
                      <Text style={styles.operatingDay}>{day}</Text>
                      <Text style={styles.operatingTime}>{hours}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Copyright */}
          <View style={styles.copyrightRow}>
            <Text style={styles.copyrightText}>
              © {new Date().getFullYear()} Healify. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f9fafb', // Tailwind bg-gray-50
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Tailwind border-gray-200
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    minWidth: 200,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    color: '#4b5563', // Tailwind text-gray-600
    marginBottom: 8,
    fontSize: 15,
  },
  gap2: {
    gap: 8,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  emergencyText: {
    color: '#dc2626', // Tailwind text-red-600
    fontWeight: '600',
    marginLeft: 4,
  },
  operatingHourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  operatingDay: {
    fontWeight: '500',
    fontSize: 15,
  },
  operatingTime: {
    fontSize: 14,
  },
  copyrightRow: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  copyrightText: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 14,
  },
});

export default Footer;