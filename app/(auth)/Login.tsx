import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../(auth)/AuthContext";

const Login = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="bg-gray-50"
    >
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
            <Text className="text-gray-600 mt-1">
              Enter your credentials to access your account
            </Text>
          </View>

          {error && (
            <View className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          )}

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-white"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Password</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fff',
                  marginBottom: 16,
                }}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#2563eb',
                borderRadius: 8,
                padding: 15,
                alignItems: 'center',
                marginTop: 8,
                opacity: isLoading ? 0.7 : 1,
              }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '500' }}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;