// InsightsScreen.js
import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MetricBar = ({ label, score, weight }) => (
  <View style={styles.metricRow}>
    <View style={styles.metricHeader}>
      <Text category='s1'>{label}</Text>
      <Text category='s1'>{score}/100</Text>
    </View>
    <View style={styles.metricBarBg}>
      <View style={[styles.metricBarFill, { width: `${score}%` }]} />
    </View>
    <Text appearance='hint' category='c1' style={styles.metricWeight}>
      Weight: {weight}% of total score
    </Text>
  </View>
);

const Recommendation = ({ icon, title, subtitle, points, color }) => (
  <Layout style={[styles.recCard, { backgroundColor: color.light }]}>  
    <View style={styles.recHeader}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={color.dark}
        style={styles.recIcon}
      />
      <Text category='s1'>{title}</Text>
    </View>
    <Text category='p2' style={styles.recSubtitle}>
      {subtitle}
    </Text>
    <Text category='c1' style={[styles.recPoints, { color: color.dark }]}>  
      {points > 0 ? `+${points} points potential` : `${points} points`}
    </Text>
  </Layout>
);

const ActionItem = ({ text }) => (
  <Layout style={styles.actionItem}>
    <MaterialCommunityIcons
      name='radiobox-blank'
      size={20}
      color='#555'
      style={styles.actionIcon}
    />
    <Text category='p2'>{text}</Text>
  </Layout>
);

const TrendRow = ({ label, change }) => {
  const up = change > 0;
  return (
    <View style={styles.trendRow}>
      <Text>{label}</Text>
      <View style={styles.trendValue}>
        <MaterialCommunityIcons
          name={up ? 'trending-up' : 'trending-down'}
          size={18}
          color={up ? '#4CAF50' : '#F44336'}
        />
        <Text style={{ color: up ? '#4CAF50' : '#F44336', marginLeft: 4 }}>
          {up ? `+${change}` : change}
        </Text>
      </View>
    </View>
  );
};

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <Text category='h5'>FinancialPassport</Text>
            <Text appearance='hint' category='s2'>
              AI-powered recommendations to improve your financial identity
            </Text>
          </View>

          {/* Score Breakdown */}
          <Layout style={styles.card}>
            <Text category='s1'>Score Breakdown</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              How your 78-point score is calculated
            </Text>
            <MetricBar label='Payment History' score={85} weight={35} />
            <MetricBar label='Income Stability' score={72} weight={30} />
            <MetricBar label='Account Activity' score={90} weight={20} />
            <MetricBar label='Employment History' score={68} weight={15} />
          </Layout>

          {/* Personalized Recommendations */}
          <Layout style={styles.card}>
            <Text category='s1'>Personalized Recommendations</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Actions to improve your financial identity score
            </Text>
            <Recommendation
              icon='check-circle-outline'
              title='Great payment consistency!'
              subtitle='You have maintained regular payments for the past 3 months.'
              points={5}
              color={{ light: '#E6FFED', dark: '#2E7D32' }}
            />
            <Recommendation
              icon='bullseye'
              title='Increase gig work frequency'
              subtitle='Working more consistently could improve your income stability score.'
              points={8}
              color={{ light: '#E8F4FF', dark: '#1565C0' }}
            />
            <Recommendation
              icon='alert-circle-outline'
              title='Low bank account balance'
              subtitle='Consider maintaining a higher minimum balance for better financial health.'
              points={3}
              color={{ light: '#FFF4E5', dark: '#E65100' }}
            />
          </Layout>

          {/* This Week's Action Items */}
          <Layout style={styles.card}>
            <Text category='s1'>This Week's Action Items</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Small steps for big improvements
            </Text>
            <ActionItem text='Complete at least 15 gig deliveries this week' />
            <ActionItem text='Maintain your bank balance above $500' />
            <ActionItem text='Avoid late cancellations on gig platforms' />
          </Layout>

          {/* Score Trend */}
          <Layout style={styles.card}>
            <Text category='s1'>Score Trend</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Your progress over time
            </Text>
            <TrendRow label='This Week' change={5} />
            <TrendRow label='This Month' change={12} />
            <TrendRow label='Last Month' change={-3} />
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

  // MetricBar
  metricRow: { marginBottom: 16 },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricBarBg: {
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: 6,
    backgroundColor: '#3366FF',
  },
  metricWeight: { marginTop: 4, fontSize: 12 },

  // Recommendation
  recCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recIcon: { marginRight: 8 },
  recSubtitle: { marginBottom: 6 },
  recPoints: { fontSize: 12, fontWeight: '600' },

  // Action Items
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  actionIcon: { marginRight: 8 },

  // Trend
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendValue: { flexDirection: 'row', alignItems: 'center' },
  trendIcon: { marginRight: 4 },
});
