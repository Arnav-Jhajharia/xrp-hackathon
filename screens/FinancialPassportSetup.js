import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Card, Text, Button, Spinner } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

export default function FinancialPassportSetup() {
  const navigation = useNavigation();
  const [bankStatus, setBankStatus] = useState('idle');
  const [gigStatus, setGigStatus] = useState('idle');
  const [jobStatus, setJobStatus] = useState('idle');

  const handleConnect = (setStatus) => {
    setStatus('loading');
    setTimeout(() => setStatus('connected'), 2000);
  };

  const finish = () => navigation.navigate('MainTabs');

  return (
    <Layout style={styles.container} level='2'>
      <Text category='h5' style={styles.title}>Connect Your Data</Text>
      <Text category='p1' appearance='hint' style={styles.desc}>
        Link your financial and employment data to build a comprehensive identity
      </Text>

      <Card style={styles.card} status='basic'>
        <Text category='s1'>Bank Account via Plaid</Text>
        <Text status='hint' style={styles.detail}>
          Connect your bank account via Plaid for transaction history and income verification
        </Text>
        {bankStatus === 'idle' && <Button onPress={() => handleConnect(setBankStatus)}>Connect Bank Account</Button>}
        {bankStatus === 'loading' && <Spinner />}
        {bankStatus === 'connected' && <Text status='success'>✓ Connected</Text>}
      </Card>

      <Card style={styles.card} status={gigStatus === 'connected' ? 'success' : 'basic'}>
        <Text category='s1'>Gig Work History via Argyle</Text>
        <Text status='hint' style={styles.detail}>
          Link your gig work accounts (Uber, DoorDash, etc.) for employment verification
        </Text>
        {gigStatus === 'idle' && <Button onPress={() => handleConnect(setGigStatus)}>Connect Gig Work</Button>}
        {gigStatus === 'loading' && <Spinner />}
        {gigStatus === 'connected' && <Text status='success'>✓ Connected</Text>}
      </Card>

      <Card style={styles.card} status={jobStatus === 'connected' ? 'primary' : 'basic'}>
        <Text category='s1'>Traditional Employment via Argyle</Text>
        <Text status='hint' style={styles.detail}>
          Verify your traditional employment history and income
        </Text>
        {jobStatus === 'idle' && <Button onPress={() => handleConnect(setJobStatus)}>Connect Traditional Employment</Button>}
        {jobStatus === 'loading' && <Spinner />}
        {jobStatus === 'connected' && <Text status='success'>✓ Connected</Text>}
      </Card>

      {bankStatus === 'connected' && gigStatus === 'connected' && jobStatus === 'connected' && (
        <Button style={styles.finish} onPress={finish} appearance='filled'>
          Finish Setup
        </Button>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  desc: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
  },
  detail: {
    marginVertical: 8,
  },
  finish: {
    marginTop: 24,
    width: '100%',
  },
});
