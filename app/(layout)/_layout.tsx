import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack initialRouteName="Footer" screenOptions={{headerShown: false}}>
        <Stack.Screen name='Patients'/>
        <Stack.Screen name='Footer'/>
       
    </Stack>
  )
}