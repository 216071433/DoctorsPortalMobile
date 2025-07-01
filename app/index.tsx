import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "./(auth)/AuthContext";
import SignInModal from "./(auth)/SignInModal";
import Footer from "./(pages)/Footer";

const Landing = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    // @ts-ignore: Suppress navigation type error for Home route
    navigation.navigate("Home");
    return null;
  }

  return (
    <View className="flex-1">
      <ImageBackground 
        source={require("../assets/images/zwa.jpg")} 
        className="h-[490px] w-full"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/30" />
        <View className="flex-1 flex-col items-center justify-center h-full">
          <View className="text-center max-w-3xl px-4">
            <Text className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to Doctor&apos;s Appointment Management System
            </Text>
            <Text className="text-lg md:text-xl text-white mb-8">
              A powerful, modern and intuitive Doctor&apos;s dashboard for your business
            </Text>
            <TouchableOpacity 
              onPress={() => setIsSignInModalOpen(true)}
              className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white px-8 py-6 text-lg rounded-lg"
            >
              <Text className="text-white text-lg font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      
      <SignInModal 
        visible={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />

      <Footer />
    </View>
  );
};

export default Landing;