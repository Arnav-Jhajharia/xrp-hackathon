// DashboardScreen.js

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Layout,
  Text,
  Button,
  Icon,
} from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
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

          {/* Score Card */}
          <LinearGradient
            colors={['#4c6ef5', '#845ef7']}
            style={styles.scoreCard}
          >
            <View style={styles.scoreHeader}>
              <Text category='s1' status='control'>
                Financial Identity Score
              </Text>
              <Icon
                name='trending-up-outline'
                fill='#FFF'
                style={styles.trendingIcon}
              />
            </View>
            <Text category='h1' status='control'>
              78
            </Text>
            <Text category='s2' status='control'>
              out of 100
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '78%' }]} />
            </View>
            <Text category='p2' status='control' style={styles.scoreFooter}>
              +5 points this week · Keep it up!
            </Text>
          </LinearGradient>

          {/* Connected Data Sources */}
          <View style={styles.section}>
            <Text category='s1'>Connected Data Sources</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              2 of 3 sources connected
            </Text>

            <View style={styles.sourceItem}>
              <Icon
                name='credit-card-outline'
                style={styles.sourceIcon}
                fill='#3366FF'
              />
              <View style={styles.sourceText}>
                <Text> XRP Wallet</Text>
                <Text appearance='hint' category='c1'>
                  Connected
                </Text>
              </View>
              <Icon
                name='checkmark-circle-2-outline'
                fill='#4CAF50'
                style={styles.statusIcon}
              />
            </View>

            <View style={styles.sourceItem}>
              <Icon
                name='person-outline'
                style={styles.sourceIcon}
                fill='#3366FF'
              />
              <View style={styles.sourceText}>
                <Text> Gig Work (Argyle)</Text>
                <Text appearance='hint' category='c1'>
                  Connected
                </Text>
              </View>
              <Icon
                name='checkmark-circle-2-outline'
                fill='#4CAF50'
                style={styles.statusIcon}
              />
            </View>

            <View style={styles.sourceItem}>
              <Icon
                name='link-outline'
                style={styles.sourceIcon}
                fill='#A1A1A1'
              />
              <View style={styles.sourceText}>
                <Text> Bank Account (Plaid)</Text>
                <Text appearance='hint' category='c1'>
                  Not connected
                </Text>
              </View>
              <Button size='tiny' appearance='outline'>
                Connect
              </Button>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text category='s1'>Recent Activity</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Your latest financial activities
            </Text>

            <View style={styles.activityItem}>
              <View>
                <Text> XRP Transaction</Text>
                <Text appearance='hint' category='c1'>
                  2 hours ago
                </Text>
              </View>
              <Text status='success' category='s1'>
                +$120
              </Text>
            </View>

            <View style={styles.activityItem}>
              <View>
                <Text> Gig Earnings</Text>
                <Text appearance='hint' category='c1'>
                  5 hours ago
                </Text>
              </View>
              <Text status='success' category='s1'>
                +$85
              </Text>
            </View>

            <View style={styles.activityItem}>
              <View>
                <Text> Bank Transfer</Text>
                <Text appearance='hint' category='c1'>
                  1 day ago
                </Text>
              </View>
              <Text status='danger' category='s1'>
                -$200
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Button style={styles.actionButton}>View Insights</Button>
              <Button style={styles.actionButton}>Find Lenders</Button>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Tab Bar */}
    

      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },

  header: { marginBottom: 16 },
  section: { marginBottom: 24 },
  subText: { marginBottom: 8 },

  scoreCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingIcon: { width: 24, height: 24 },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFF',
  },
  scoreFooter: { marginTop: 4 },

  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  sourceIcon: { width: 32, height: 32, marginRight: 12 },
  sourceText: { flex: 1 },
  statusIcon: { width: 24, height: 24 },

  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: { flex: 1, marginHorizontal: 4 },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  tabItem: { alignItems: 'center' },
  tabIcon: { width: 24, height: 24 },
});
