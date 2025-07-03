import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name='SignInModal'/>
        <Stack.Screen name='AuthContext'/>
        

       
    </Stack>
  )
}