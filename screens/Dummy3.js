// ProfileScreen.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const profileUrl = 'https://financialpassport.app/profile/abc123';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <Text category='h5'>FinancialPassport</Text>
            <Text appearance='hint' category='s2'>
              Build Your Financial Identity
            </Text>
          </View>

          {/* Profile Summary Card */}
          <Layout style={styles.card}>
            <LinearGradient
              colors={['#4c6ef5', '#845ef7']}
              style={styles.avatarGradient}
            >
              <Text category='h4' status='control'>S</Text>
            </LinearGradient>
            <Text category='h6' style={styles.name}>
              Sarah Chen
            </Text>
            <Text appearance='hint' category='c1' style={styles.email}>
              sarah.chen@lendflow.com
            </Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text category='h5'>78</Text>
                <Text appearance='hint' category='c1'>Identity Score</Text>
              </View>
              <View style={styles.metricItem}>
                <Text category='h5' status='success'>85%</Text>
                <Text appearance='hint' category='c1'>Complete</Text>
              </View>
              <View style={styles.metricItem}>
                <Text category='h5' status='info'>12</Text>
                <Text appearance='hint' category='c1'>Profile Views</Text>
              </View>
            </View>
          </Layout>

          {/* Verification Status */}
          <Layout style={styles.card}>
            <Text category='s1'>Verification Status</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Your connected and verified data sources
            </Text>
            <View style={styles.statusItem}>
              <Text>🔗 XRP Wallet</Text>
              <Text status='success' category='c1'>Verified</Text>
            </View>
            <View style={styles.statusItem}>
              <Text>👤 Gig Work History</Text>
              <Text status='success' category='c1'>Verified</Text>
            </View>
            <View style={styles.statusItem}>
              <Text>🏦 Bank Account</Text>
              <Text appearance='hint' category='c1'>Not Connected</Text>
            </View>
          </Layout>

          {/* Achievement Badges */}
          <Layout style={styles.card}>
            <Text category='s1'>Achievement Badges</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Recognition for your financial behavior
            </Text>
            <View style={styles.badgesRow}>
              <Layout style={styles.badge}><Text>Crypto Verified</Text></Layout>
              <Layout style={styles.badge}><Text>Gig Worker</Text></Layout>
              <Layout style={styles.badge}><Text>Consistent Earner</Text></Layout>
            </View>
          </Layout>

          {/* Share Your Financial Identity */}
          <Layout style={styles.card}>
            <Text category='s1'>Share Your Financial Identity</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Share your verified profile with lenders and financial institutions
            </Text>
            <Layout style={styles.urlBox}>
              <Text category='p2'>{profileUrl}</Text>
            </Layout>
            <View style={styles.shareButtons}>
              <Button appearance='outline' style={styles.shareBtn} accessoryLeft={() => <MaterialCommunityIcons name='share-variant' size={16} />}>
                Share Link
              </Button>
              <Button appearance='outline' style={styles.shareBtn} accessoryLeft={() => <MaterialCommunityIcons name='qrcode-scan' size={16} />}>
                QR Code
              </Button>
            </View>
            <Button style={styles.downloadBtn} accessoryLeft={() => <MaterialCommunityIcons name='download' size={16} color='#FFF' />}>
              Download Report
            </Button>
          </Layout>

          {/* Profile Analytics */}
          <Layout style={styles.card}>
            <Text category='s1'>Profile Analytics</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              See how your profile is performing
            </Text>
            <View style={styles.analyticsItem}>
              <MaterialCommunityIcons name='eye-outline' size={20} />
              <Text category='p2' style={styles.analyticsLabel}>Profile Views</Text>
              <Text category='s1' style={styles.analyticsValue}>12</Text>
            </View>
            <View style={styles.analyticsItem}>
              <MaterialCommunityIcons name='arrow-top-right-bold-outline' size={20} />
              <Text category='p2' style={styles.analyticsLabel}>Lender Interests</Text>
              <Text category='s1' style={styles.analyticsValue}>3</Text>
            </View>
            <Text appearance='hint' category='c1' style={styles.updatedText}>
              Last updated: 2 hours ago
            </Text>
          </Layout>

          {/* Account Action */}
          <Layout style={styles.card}>
            <Text category='s1'>Account</Text>
            <Button status='danger' style={styles.signOutBtn}>
              Sign Out
            </Button>
          </Layout>

        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  header: { marginBottom: 16 },
  subText: { marginBottom: 12 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
    elevation: 1,
  },

  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: { textAlign: 'center' },
  email: { textAlign: 'center', marginBottom: 16 },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: { alignItems: 'center', flex: 1 },

  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },

  urlBox: {
    backgroundColor: '#F7F9FC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  shareButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  shareBtn: { flex: 1, marginHorizontal: 4 },
  downloadBtn: { marginTop: 4 },

  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsLabel: { flex: 1, marginLeft: 8 },
  analyticsValue: {},
  updatedText: { marginTop: 4, fontSize: 12 },

  signOutBtn: { marginTop: 12 },
});
