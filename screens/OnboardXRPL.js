// OnboardXRPL.js
import React, { useEffect, useState, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';
import { Wallet, Client } from 'xrpl';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Layout,
  Text,
  Card,
  Input,
  Button,
  Spinner,
  Modal,
  Divider,
} from '@ui-kitten/components';
import { useAuth } from '../auth/AuthProvider';

// GraphQL
const GET_XRPL_ADDRESS = gql`query GetXRPLAddress { me { xrplAccount publicKey } }`;
const SAVE_XRPL_ADDRESS = gql`mutation SaveXRPL_ADDRESS($address: String!, $publicKey: String!) { saveXRPLAddress(address: $address, publicKey: $publicKey) { xrplAccount publicKey } }`;

export default function OnboardXRPL() {
  const navigation = useNavigation();
  const { user, login, request } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_XRPL_ADDRESS, { skip: !user, fetchPolicy: 'network-only' });
  const [saveAddress] = useMutation(SAVE_XRPL_ADDRESS);

  const [wallet, setWallet] = useState(null);
  const [seedInput, setSeedInput] = useState('');
  const [promptVisible, setPromptVisible] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [newSeed, setNewSeed] = useState('');

  const createNewWallet = useCallback(async () => {
    try {
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      const { wallet: w } = await client.fundWallet();
      setNewSeed(w.seed);
      setShowSeedModal(true);
      await SecureStore.setItemAsync('xrplSeed', w.seed);
      await saveAddress({ variables: { address: w.classicAddress, publicKey: w.publicKey } });
      await refetch();
      setWallet(w);
      setPromptVisible(false);
      client.disconnect();
    } catch (err) {
      Alert.alert('Error', 'Failed to create wallet: ' + err.message);
    }
  }, [saveAddress, refetch]);

  const restoreWallet = useCallback(async () => {
    try {
      const w = Wallet.fromSeed(seedInput.trim());
      if (w.classicAddress !== data.me.xrplAccount) throw new Error('Seed does not match stored address');
      await SecureStore.setItemAsync('xrplSeed', seedInput.trim());
      setWallet(w);
      setPromptVisible(false);
    } catch (err) {
      Alert.alert('Invalid seed', err.message);
    }
  }, [seedInput, data]);

  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const storedSeed = await SecureStore.getItemAsync('xrplSeed');
      const backendAddr = data?.me?.xrplAccount;
      if (storedSeed && backendAddr) {
        setWallet(Wallet.fromSeed(storedSeed));
      } else {
        setPromptVisible(true);
      }
    })();
  }, [user, data, loading]);

  // --- Not logged in ---
  if (!user) {
    return (
      <Layout style={styles.centered}>
        <Text category='h1' style={styles.appTitle}>fIDent</Text>
        <Text category='s1' style={styles.subTitle}>Securely manage your XRPL identity</Text>
        <Button style={styles.button} onPress={login} disabled={!request}>Log in with Auth0</Button>
      </Layout>
    );
  }

  // --- Loading ---
  if (loading) {
    return (
      <Layout style={styles.centered}>
        <Text category='h1' style={styles.appTitle}>fIDent</Text>
        <Spinner size='giant' status='basic'/>
        <Text appearance='hint' style={styles.marginTop}>Loading wallet…</Text>
      </Layout>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <Layout style={styles.centered}>
        <Text category='h1' style={styles.appTitle}>fIDent</Text>
        <Text status='danger'>Error loading wallet:</Text>
        <Text>{error.message}</Text>
      </Layout>
    );
  }

  // --- Wallet exists: simplified UI ---
  if (wallet) {
    return (
      <Layout style={styles.centered}>
        <Text category='h1' style={styles.appTitle}>fIDent</Text>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Text category='h6' style={styles.cardTitle}>You're all set!</Text>
            <Text category='s1' style={styles.successText}>Your XRPL wallet is already configured.</Text>
            <Button style={[styles.button, styles.primary]} onPress={() => navigation.navigate('DIDSetup')}>Proceed to Create DID</Button>
          </Card>
        </View>
      </Layout>
    );
  }

  // --- Setup / Restore Prompt ---
  return (
    <Layout style={styles.centered}>
      <Text category='h1' style={styles.appTitle}>fIDent</Text>
      <Modal visible={promptVisible} backdropStyle={styles.backdrop} onBackdropPress={() => {}}>
        <Card disabled style={styles.setupCard} header={() => <Text category='h6'>Wallet Setup</Text>}>
          {data?.me?.xrplAccount ? (
            <>
              <Text category='s1' style={styles.setupText}>Existing address: {data.me.xrplAccount}</Text>
              <Input placeholder='Enter your seed' value={seedInput} onChangeText={setSeedInput} style={styles.input}/>
              <View style={styles.row}>
                <Button style={styles.flex} onPress={restoreWallet}>Restore</Button>
                <Button appearance='ghost' style={styles.flex} onPress={createNewWallet}>Create New</Button>
              </View>
            </>
          ) : (
            <>
              <Text category='s1' style={styles.setupText}>No wallet found. Create one to continue.</Text>
              <Button style={styles.button} onPress={createNewWallet}>Create New Wallet</Button>
            </>
          )}
        </Card>
      </Modal>
      <Modal visible={showSeedModal} backdropStyle={styles.backdrop} onBackdropPress={() => {}}>
        <Card disabled style={styles.setupCard} header={() => <Text category='h6'>Save Your Seed</Text>}>
          <Text category='s1' style={styles.setupText}>This is your secret seed. Save it securely.</Text>
          <Text selectable style={styles.address}>{newSeed}</Text>
          <View style={styles.row}>
            <Button style={styles.flex} onPress={async () => { await Clipboard.setStringAsync(newSeed); Alert.alert('Copied', 'Seed copied to clipboard'); }}>Copy</Button>
            <Button style={[styles.flex, styles.primary]} onPress={() => setShowSeedModal(false)}>Got it</Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  centered: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f0f3f5', padding:16 },
  appTitle: { marginBottom:8, fontWeight:'bold', color:'#3366FF' },
  subTitle: { marginBottom:24, color:'#555' },
  cardContainer: { width:'100%', alignItems:'center' },
  card: {
    width:'90%',
    maxWidth:360,
    borderRadius:12,
    padding:20,
    backgroundColor:'#fff',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:4 },
    shadowOpacity:0.1,
    shadowRadius:8,
    elevation:5,
  },
  cardTitle: { marginBottom:12, textAlign:'center' },
  successText: { textAlign:'center', marginBottom:20, color:'#28a745' },
  button: { marginTop:12 },
  primary: { backgroundColor:'#3366FF' },
  setupCard: {
    width:'90%',
    maxWidth:360,
    borderRadius:12,
    padding:20,
    backgroundColor:'#fff',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:4 },
    shadowOpacity:0.1,
    shadowRadius:8,
    elevation:5,
  },
  setupText: { marginBottom:12 },
  input: { marginVertical:12 },
  row: { flexDirection:'row', justifyContent:'space-between', marginTop:16 },
  flex: { flex:1, marginHorizontal:4 },
  backdrop: { backgroundColor:'rgba(0,0,0,0.5)' },
  address: { fontFamily:'monospace', marginVertical:8 }
});
