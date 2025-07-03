import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack initialRouteName="Footer" screenOptions={{headerShown: false}}>
        <Stack.Screen name='Patients' options={{headerShown: false, title: 'Patients'}}/>
        <Stack.Screen name='Footer'/>
        <Stack.Screen name='Dashboard'/>
        <Stack.Screen name='Siderbar' />
    </Stack>
  )
}
export default Layout;