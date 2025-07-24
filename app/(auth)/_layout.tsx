import { Stack } from 'expo-router';
import React from 'react';

const AuthLayout = () => {
  return (
    <Stack initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name='SignInModal'/>
        <Stack.Screen name='AuthContext'/>
        

       
    </Stack>
  )
}

export default AuthLayout;