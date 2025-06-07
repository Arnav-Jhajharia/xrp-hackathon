import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen       from '../screens/HomeScreen';
import OnboardXRPL      from '../screens/OnboardXRPL';
// import DIDSetupScreen   from '../screens/DIDSetupScreen';    // you’ll build next
// import DIDResolveScreen from '../screens/DIDResolveScreen';  // you’ll build later

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerLargeTitle: true }}
      >
        <Stack.Screen name="Home"       component={HomeScreen}       options={{ title: 'Welcome' }} />
        <Stack.Screen name="Onboard"    component={OnboardXRPL}      options={{ title: 'XRPL Wallet' }} />
        {/* <Stack.Screen name="DIDSetup"   component={DIDSetupScreen}   options={{ title: 'Create DID' }} />
        <Stack.Screen name="DIDResolve" component={DIDResolveScreen} options={{ title: 'View DID' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
