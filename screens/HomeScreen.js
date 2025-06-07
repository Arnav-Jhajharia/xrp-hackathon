import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { user, login, logout, request, accessToken } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Text style={styles.title}>Access Token: {accessToken}</Text>
          <Button title="Log out" onPress={logout} />

        <Button title = "Manage XRPL Wallet" onPress={() => navigation.navigate('Onboard')} />
      
      <Button title = "Create a DID" onPress={() => navigation.navigate('DIDSetup')} />
      <Button title = "View a DID" onPress={() => navigation.navigate('DIDResolve')} />
      </>
      ) : (
        <Button title="Log in with Auth0" onPress={login} disabled={!request} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});
