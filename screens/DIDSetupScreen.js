
// screens/DIDSetupScreen.js

import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer'; // ensure Buffer is available in React Native
import * as SecureStore from 'expo-secure-store';
import { Wallet, Client } from 'xrpl';
import { gql, useMutation } from '@apollo/client';
import {
  Layout,
  Card,
  Text,
  Button,
  Spinner,
} from '@ui-kitten/components';

const SUBMIT_DID = gql`
  mutation SubmitDID($txBlob: String!) {
    submitDID(txBlob: $txBlob) {
      transactionHash
      ledgerIndex
    }
  }
`;

export default function DIDSetupScreen() {
  const [seed, setSeed]           = useState(null);
  const [busy, setBusy]           = useState(false);
  const [result, setResult]       = useState(null);
  const [errorMessage, setError]  = useState(null);

  const [submitDID] = useMutation(SUBMIT_DID, {
    onCompleted: (data) => {
      setResult(data.submitDID);
      setError(null);
      setBusy(false);
    },
    onError: (err) => {
      setError(err.message);
      setBusy(false);
    },
  });

  // Load the XRPL seed from secure storage on mount
  useEffect(() => {
    SecureStore.getItemAsync('xrplSeed').then(s => setSeed(s));
  }, []);

  const handleCreateDID = async () => {
    if (!seed) {
      return setError('No wallet seed found. Please onboard your wallet first.');
    }

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      // Rehydrate wallet
      const wallet = Wallet.fromSeed(seed);

      // Build minimal DID Document
      const did = `did:xrpl:testnet:${wallet.classicAddress}`;
      console.log(wallet.classicAddress);
      console.log(wallet.publicKey);
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
      console.log(doc);
      // Prepare, sign, and get tx_blob locally
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      const tx = {
        TransactionType: 'DIDSet',
        Account:         wallet.classicAddress,
        DID:             doc.id,
        Properties:      Buffer.from(JSON.stringify(doc), 'utf8').toString('hex'),
      };

      const prepared = await client.autofill(tx);
      const signed   = wallet.sign(prepared);
      await client.disconnect();

      
      console.log(signed);
      // Submit only the signed blob to your backend
      submitDID({ variables: { txBlob: signed.tx_blob } });

    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <Card style={styles.card} header={() => <Text category='h6'>Create Your On-Chain Identity</Text>}>
        {busy ? (
          <Spinner size='giant' />
        ) : result ? (
          <>
            <Text category='s1' status='success'>✅ DID Published!</Text>
            <Text category='p1' selectable style={styles.text}>
              {`did:xrpl:testnet:${Wallet.fromSeed(seed).classicAddress}`}
            </Text>
            <Text category='c1' style={styles.text}>
              Tx Hash: {result.transactionHash}
            </Text>
            <Button style={styles.button} onPress={() => setResult(null)}>
              Create Again
            </Button>
          </>
        ) : (
          <Button style={styles.button} onPress={handleCreateDID}>
            Create My Identity
          </Button>
        )}

        {errorMessage && (
          <Text status='danger' style={styles.error}>
            {errorMessage}
          </Text>
        )}
      </Card>
    </Layout>
  );
}

const styles = {
  container: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         16,
    backgroundColor: '#FFF',
  },
  card: {
    width:   '100%',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  text: {
    marginTop: 12,
  },
  error: {
    marginTop: 16,
    textAlign: 'center',
  },
};
