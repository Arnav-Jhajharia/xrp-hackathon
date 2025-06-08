// LendersScreen.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import {
  Layout,
  Text,
  Input,
  Button,
} from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const lenders = [
  {
    name: 'GigCredit',
    subtitle: 'Gig Worker Specialist',
    icon: 'car-outline',
    rating: 4.8,
    reviews: 1250,
    amount: '$5,000',
    minScore: 65,
    term: '1-12 months',
    apr: '4.9% - 9.9%',
    tags: ['No collateral required', 'Fast approval', 'Gig-friendly'],
    description: 'Specialized loans for gig workers'
  },
  {
    name: 'Anonymous#1',
    subtitle: 'From India',
    icon: 'person-outline',
    rating: 4.6,
    reviews: 890,
    amount: '$25,000',
    minScore: 70,
    term: '6-18 months',
    apr: '6.5% - 18.9%',
    tags: ['Crypto collateral', 'Global access', 'Low rates'],
    description: 'Anonymous lender from India'  
  },
  {
    name: 'FlexiFund',
    subtitle: 'Personal Loans',
    icon: 'cash-multiple',
    rating: 4.7,
    reviews: 2100,
    amount: '$15,000',
    minScore: 60,
    term: '6-18 months',
    apr: '6.5% - 12.5%',
    tags: ['Flexible terms', 'Quick decisions', 'Multiple use cases'],
    description: 'Personal loans for freelancers'
  },
  {
    name: 'StartupBoost',
    subtitle: 'Business Loans',
    icon: 'rocket-launch-outline',
    rating: 4.5,
    reviews: 650,
    amount: '$100,000',
    minScore: 75,
    term: '12-48 months',
    apr: '5.9% - 12.9%',
    tags: ['Business focus', 'Growth capital', 'Mentorship'],
    description: 'Business loans for freelancers'
  },
];

const LenderCard = ({ lender }) => (
  <Layout style={styles.card}>
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons
        name={lender.icon}
        size={24}
        style={styles.cardIcon}
      />
      <View style={styles.cardTitle}>
        <Text category='s1'>{lender.name}</Text>
        <Text appearance='hint' category='c1'>{lender.subtitle}</Text>
      </View>
      <View style={styles.rating}>
        <MaterialCommunityIcons name='star' size={16} color='#FFD700' />
        <Text category='s2' style={styles.ratingText}>{lender.rating}</Text>
        <Text appearance='hint' category='c2'>({lender.reviews})</Text>
      </View>
    </View>

    <Text style={styles.description} appearance='hint'>
      {lender.description}
    </Text>

    <View style={styles.infoRow}>
      <MaterialCommunityIcons name='currency-usd' size={20} />
      <Text category='p2' style={styles.infoText}>Up to {lender.amount}</Text>
      <MaterialCommunityIcons name='account-outline' size={20} />
      <Text category='p2' style={styles.infoText}>Min score: {lender.minScore}</Text>
    </View>
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name='clock-outline' size={20} />
      <Text category='p2' style={styles.infoText}>{lender.term}</Text>
      <MaterialCommunityIcons name='chart-bar' size={20} />
      <Text category='p2' style={styles.infoText}>APR: {lender.apr}</Text>
    </View>

    <View style={styles.tagsRow}>
      {lender.tags.map((tag, i) => (
        <Layout key={i} style={styles.tag}><Text category='c2'>{tag}</Text></Layout>
      ))}
    </View>

    <View style={styles.buttonsRow}>
      <Button style={styles.applyBtn}>Apply Now</Button>
      <Button appearance='outline' style={styles.interestBtn}>Express Interest</Button>
    </View>
  </Layout>
);

export default function LendersScreen() {
  // Handler for sending an open request
  const handleOpenRequest = () => {
    // TODO: integrate your open request API here
    console.log('Open request sent to all qualifying lenders');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>


       
          {/* Header */}
          <View style={styles.header}>
            <Text category='h5'>Lender Marketplace</Text>
            <Text appearance='hint' category='s2'>Find the right lender for your financial needs</Text>
          </View>

          {/* Search */}
          <Input
            placeholder='Search lenders...'
            style={styles.search}
            accessoryLeft={() => <MaterialCommunityIcons name='magnify' size={20} />}
          />

          

          {/* Score Banner */}
          <LinearGradient
            colors={['#4c6ef5', '#845ef7']}
            style={styles.scoreBanner}
          >
            <Text category='h6' status='control'>Your Financial Score: 78</Text>
            {/* <Text category='c1' status='control'>You qualify for {lenders.length} lenders</Text> */}
            <MaterialCommunityIcons name='chart-bar' size={32} color='#FFF' />
          </LinearGradient>

          <Layout style={styles.openRequestContainer}>
            <Text category='s1'>Can't find what you need?</Text>
            <Text appearance='hint' category='c1' style={styles.subText}>
              Send an open request to any qualifying lender.
            </Text>
            <Button style={styles.openRequestBtn} onPress={handleOpenRequest}>
              Send Open Request
            </Button>
          </Layout>

          {/* Lender Cards */}
          {lenders.map((l, idx) => (
            <LenderCard key={idx} lender={l} />
          ))}

          {/* Open Request Container */}
         

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
  search: { marginBottom: 16, borderRadius: 8 },

  scoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ADE8F4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { marginRight: 12 },
  cardTitle: { flex: 1 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginHorizontal: 4 },

  description: { marginBottom: 12 },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: { marginHorizontal: 8 },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },

  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  applyBtn: { flex: 1, marginRight: 8 },
  interestBtn: { flex: 1 },

  // Open Request Container
  openRequestContainer: {
    borderWidth: 1,
    borderColor: '#3366FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
  },
  openRequestBtn: { marginTop: 12 },

  subText: { marginTop: 4, marginBottom: 12, textAlign: 'center' },
});
