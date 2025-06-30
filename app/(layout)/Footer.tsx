import { Ambulance, Clock } from "lucide-react-native";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

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
    <View className="bg-gray-50 border-t border-gray-200">
      <View className="container mx-auto px-4 py-12">
        <View className="flex-col md:flex-row flex-wrap gap-8">
          {/* Company Info */}
          <View className="flex-1 min-w-[200px] mb-8 md:mb-0">
            <Text className="text-lg font-semibold mb-4">Healify</Text>
            <Text className="text-gray-600 mb-4">
              Your trusted healthcare partner. Schedule appointments with specialized 
              doctors and get the care you deserve.
            </Text>
          </View>

          {/* Services */}
          <View className="flex-1 min-w-[200px] mb-8 md:mb-0">
            <Text className="text-lg font-semibold mb-4">Our Services</Text>
            <View className="gap-2">
              {services.map((service) => (
                <Text key={service} className="text-gray-600">
                  {service}
                </Text>
              ))}
              <TouchableOpacity 
                className="flex-row items-center gap-2 text-red-600 font-semibold mt-4"
                onPress={handleEmergencyCall}
              >
                <Ambulance size={16} color="#dc2626" />
                <Text className="text-red-600 font-semibold">Emergency: 112</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Operating Hours */}
          <View className="flex-1 min-w-[200px]">
            <Text className="text-lg font-semibold mb-4">Operating Hours</Text>
            <View className="gap-2">
              {operatingHours.map(({ day, hours }) => (
                <View key={day} className="text-gray-600">
                  <View className="flex-row gap-2">
                    <Clock size={16} color="#4b5563" />
                    <View>
                      <Text className="font-medium">{day}</Text>
                      <Text>{hours}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View className="mt-12 pt-8 border-t border-gray-200">
          <Text className="text-center text-gray-600">
            © {new Date().getFullYear()} Healify. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;