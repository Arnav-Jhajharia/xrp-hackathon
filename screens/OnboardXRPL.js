// screens/OnboardXRPL.js

import React, { useEffect, useState, useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';
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
} from '@ui-kitten/components';
import { useAuth } from '../auth/AuthProvider';

// 1. Query to fetch saved XRPL address + publicKey
const GET_XRPL_ADDRESS = gql`
  query GetXRPLAddress {
    me {
      xrplAccount
      publicKey
    }
  }
`;

// 2. Mutation to save address & publicKey
const SAVE_XRPL_ADDRESS = gql`
  mutation SaveXRPLAddress($address: String!, $publicKey: String!) {
    saveXRPLAddress(address: $address, publicKey: $publicKey) {
      xrplAccount
      publicKey
    }
  }
`;

export default function OnboardXRPL() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_XRPL_ADDRESS, {
    skip: !user,
    fetchPolicy: 'network-only',
  });
  const [saveAddress] = useMutation(SAVE_XRPL_ADDRESS);
  const [wallet, setWallet] = useState(null);
  const [seedInput, setSeedInput] = useState('');
  const [promptVisible, setPromptVisible] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [newSeed, setNewSeed] = useState('');

  // Create a brand‐new wallet
  const createNewWallet = useCallback(async () => {
    try {
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      const { wallet: w } = await client.fundWallet();
      console.log("Wallet", w);
      setNewSeed(w.seed);
      setShowSeedModal(true);
      await SecureStore.setItemAsync('xrplSeed', w.seed, {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
      });
      await saveAddress({
        variables: {
          address:   w.classicAddress,
          publicKey: w.publicKey,
        },
      });
      await refetch();
      setWallet(w);
      setPromptVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to create wallet: ' + err.message);
    }
  }, [saveAddress, refetch]);

  // Attempt to restore from user‐entered seed
  const restoreWallet = useCallback(async () => {
    try {
      const w = Wallet.fromSeed(seedInput.trim());
      if (w.classicAddress !== data.me.xrplAccount) {
        throw new Error('Seed does not match the stored address');
      }
      await SecureStore.setItemAsync('xrplSeed', seedInput.trim());
      setWallet(w);
      setPromptVisible(false);
    } catch (err) {
      Alert.alert('Invalid seed', err.message);
    }
  }, [seedInput, data]);

  // On mount / when backend data loads
  useEffect(() => {
    if (!user || loading) return;

    (async () => {
      const storedSeed    = await SecureStore.getItemAsync('xrplSeed');
      const backendAddr   = data?.me?.xrplAccount;
      const backendPubKey = data?.me?.publicKey;

      // 1) Both seed & backend record exist → hydrate
      if (storedSeed && backendAddr) {
        setWallet(Wallet.fromSeed(storedSeed));
        return;
      }

      // 2) Need to restore existing wallet
      if (!storedSeed && backendAddr) {
        setPromptVisible(true);
        return;
      }

      // 3) Totally new user with no wallet on file
      if (!storedSeed && !backendAddr) {
        setPromptVisible(true);
      }
    })();
  }, [user, data, loading]);

  // --- Rendering ---

  if (!user) {
    return (
      <Layout style={styles.full}>
        <Text category='h6' status='danger'>
          Please sign in first.
        </Text>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout style={styles.full}>
        <Spinner size='giant' status='basic' />
        <Text appearance='hint'>Loading your wallet…</Text>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={styles.full}>
        <Text status='danger'>Error loading wallet:</Text>
        <Text>{error.message}</Text>
      </Layout>
    );
  }

  if (wallet) {
    return (
      <Layout style={styles.full}>
        <Card style={styles.card} header={() => <Text category='h6'>Your XRPL Wallet</Text>}>
          <Text category='s1'>Address</Text>
          <Text selectable style={styles.address}>
            {wallet.classicAddress}
          </Text>
          <Text category='s1'>Public Key</Text>
          <Text selectable style={styles.address}>
            {wallet.publicKey}
          </Text>
          <Button
            style={styles.button}
            appearance='outline'
            onPress={() => {
              SecureStore.deleteItemAsync('xrplSeed');
              setWallet(null);
              setPromptVisible(true);
            }}
          >
            Reset Wallet
          </Button>
        </Card>
      </Layout>
    );
  }

  // Prompt for restore or new wallet
  return (
    <Layout style={styles.full}>
      <Modal
        visible={promptVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setPromptVisible(false)}
      >
        <Card disabled header={() => <Text category='h6'>Wallet Setup</Text>}>
          {data?.me?.xrplAccount ? (
            <>
              <Text category='s1' style={{ marginBottom: 8 }}>
                We found an existing wallet on file:
              </Text>
              <Text selectable style={styles.address}>
                {data.me.xrplAccount}
              </Text>
              <Input
                placeholder='Enter your seed to restore'
                value={seedInput}
                onChangeText={setSeedInput}
                style={{ marginVertical: 12 }}
              />
              <Button onPress={restoreWallet} appearance='filled'>
                Restore Wallet
              </Button>
              <Button
                appearance='ghost'
                style={{ marginTop: 8 }}
                onPress={createNewWallet}
              >
                Create New Wallet Instead
              </Button>
            </>
          ) : (
            <>
              <Text category='s1' style={{ marginBottom: 12 }}>
                Don't have an existing wallet? Only create a new wallet if you absolutely must. You'll only see the seed once—store it securely.
              </Text>
              <Button style={styles.button} appearance='ghost' onPress={createNewWallet}>
                Create New Wallet
              </Button>
            </>
          )}
        </Card>
      </Modal>
      <Modal
        visible={showSeedModal}
        backdropStyle={styles.backdrop}
        // prevent closing by outside tap
        onBackdropPress={() => {}}
      >
        <Card disabled style={styles.card} header={() => <Text category='h6'>Save Your Seed</Text>}>
          <Text category='s1' style={{ marginBottom: 8 }}>
            Your secret seed. Save it now. You will only see this once.
          </Text>
          <Text selectable style={styles.seed}>
            {newSeed}
          </Text>
          <Button style={styles.button} onPress={async () => {
            await Clipboard.setStringAsync(newSeed);
            Alert.alert('Copied', 'Seed copied to clipboard');
          }}>
            Copy to Clipboard
          </Button>
          <Button style={styles.button} onPress={() => setShowSeedModal(false)}>
            I have saved my seed
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  full: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
    padding:        16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width:   '90%',
    padding: 16,
  },
  address: {
    marginBottom: 12,
    fontFamily:   'monospace',
  },
  seed: {
    marginBottom: 12,
    fontFamily:   'monospace',
  },
  button: {
    marginTop: 16,
  },
});
