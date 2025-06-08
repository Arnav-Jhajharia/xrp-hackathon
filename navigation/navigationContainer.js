import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen      from '../screens/HomeScreen';
import OnboardXRPL     from '../screens/OnboardXRPL';
import DIDSetupScreen  from '../screens/DIDSetupScreen';
// import DIDResolveScreen from '../screens/DIDResolveScreen';

import Dummy1   from '../screens/Dummy1';
import Dummy2   from '../screens/Dummy2';
import Dummy3 from '../screens/Dummy3';
import FinancialPassportSetup from '../screens/FinancialPassportSetup';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTabs() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="One"   component={Dummy1}   options={{ title: 'Passport'   }} />
        <Tab.Screen name="Two"   component={Dummy2}   options={{ title: 'Analysis'   }} />
        <Tab.Screen name="Three" component={Dummy3} options={{ title: 'Profile' }} />
        <Tab.Screen name="Home"  component={HomeScreen}  options={{ title: 'Lenders'  }} />
      </Tab.Navigator>
    );
  }
  

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboard" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboard" component={OnboardXRPL} />
        <Stack.Screen name="DIDSetup" component={DIDSetupScreen} />
        <Stack.Screen name="DataSetup" component={FinancialPassportSetup}/>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
