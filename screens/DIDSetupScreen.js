// DIDSetupScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Buffer } from 'buffer';
import * as SecureStore from 'expo-secure-store';
import { Wallet, Client } from 'xrpl';
import {
  Layout,
  Card,
  Text,
  Button,
  Spinner,
} from '@ui-kitten/components';

// Replace with your backend’s address
const API_BASE = 'http://localhost:3001';

export default function DIDSetupScreen({ navigation }) {
  const [seed, setSeed] = useState(null);
  const [busy, setBusy] = useState(false);
  const [didRecord, setDidRecord] = useState(null);
  const [errorMessage, setError] = useState(null);


  // Load XRPL seed
  useEffect(() => {

    SecureStore.getItemAsync('xrplSeed')
      .then(s => setSeed(s))
      .catch(err => console.error('Error loading seed:', err));
  }, []);

  // Fetch existing DID
  useEffect(() => {
    if (!seed) return;
    const address = Wallet.fromSeed(seed).classicAddress;
    fetch(`${API_BASE}/did/${address}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(rec => setDidRecord(rec))
      .catch(() => {});
  }, [seed]);

  const handleCreateDID = async () => {
    if (!seed) {
      setError('No wallet seed found. Onboard your wallet first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const wallet = Wallet.fromSeed(seed);
      const did = `did:xrpl:testnet:${wallet.classicAddress}`;
      const doc = {
        id: did,
        verificationMethod: [{
          id: `${did}#key-1`,
          type: 'Ed25519VerificationKey2018',
          controller: did,
          publicKeyBase58: wallet.publicKey,
        }],
        authentication: [`${did}#key-1`],
      };
      // store to backend
      let res = await fetch(`${API_BASE}/did`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did, document: doc }),
      });
      if (!res.ok) throw new Error('Failed to store DID');
      // fetch saved record
      res = await fetch(`${API_BASE}/did/${wallet.classicAddress}`);
      if (!res.ok) throw new Error('Failed to fetch saved DID');
      const saved = await res.json();
      setDidRecord(saved);
      // prepare on-ledger transaction
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      const tx = {
        TransactionType: 'DIDSet',
        Account: wallet.classicAddress,
        DID: did,
        URI: saved.uri ? Buffer.from(saved.uri).toString('hex') : undefined,
        Data: saved.hex || undefined,
      };
      const prepared = await client.autofill(tx);
      const { tx_blob } = wallet.sign(prepared);
      await client.disconnect();
      // navigate with tx_blob
      navigation.navigate('DataSetup', { txBlob: tx_blob });
    } catch (err) {
      console.error('handleCreateDID error:', err);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category='h1' style={styles.title}>fIDent</Text>
      <Text category='s1' style={styles.subtitle}>On-Chain Identity Setup</Text>
      <Card style={styles.card}>
        {busy ? (
          <View style={styles.centerContent}>
            <Spinner size='large'/>
            <Text appearance='hint' style={styles.marginTop}>Working…</Text>
          </View>
        ) : didRecord ? (
          <View style={styles.centerContent}>
            <Text category='h6' status='success' style={styles.success}>✅ DID Stored!</Text>
            <Text category='p1' selectable style={styles.didText}>{didRecord.did}</Text>
            {didRecord.uri && <Text category='c1'>URI: {didRecord.uri}</Text>}
            <Button style={[styles.button, styles.primary]} onPress={() => navigation.navigate('DataSetup')}>Proceed</Button>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text category='s1'>Create your on-chain DID to get started.</Text>
            <Button style={[styles.button, styles.primary]} onPress={handleCreateDID}>Create My Identity</Button>
          </View>
        )}
        {errorMessage && <Text status='danger' style={styles.error}>{errorMessage}</Text>}
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f0f3f5', padding:16 },
  title: { marginBottom:8, fontWeight:'bold', color:'#3366FF' },
  subtitle: { marginBottom:24, color:'#555' },
  card: {
    width:'90%', maxWidth:360, borderRadius:12, padding:20, backgroundColor:'#fff',
    shadowColor:'#000', shadowOffset:{ width:0, height:4 }, shadowOpacity:0.1, shadowRadius:8, elevation:5,
  },
  centerContent: { alignItems:'center' },
  didText: { fontFamily:'monospace', marginVertical:12 },
  success: { marginBottom:12, textAlign:'center' },
  button: { marginTop:20, width:'100%' },
  primary: { backgroundColor:'#3366FF' },
  error: { marginTop:16, textAlign:'center' },
  marginTop: { marginTop:16 }
});
