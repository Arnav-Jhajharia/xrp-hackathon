import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthProvider';

export default function HomeScreen() {
  const { user, login, logout, request, accessToken } = useAuth();

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Text style={styles.title}>Access Token: {accessToken}</Text>
          <Button title="Log out" onPress={logout} />
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
