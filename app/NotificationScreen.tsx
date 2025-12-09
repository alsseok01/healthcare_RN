import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { wp } from '../utils/scaling';

const notificationData = [
  {
    id: '1',
    profileImage: require('../assets/user_profile.png'),
    title: '보낸 알람 확인',
    description: '알람 내용이 여기에 표시됩니다.',
    time: '10분 전',
  },
  {
    id: '2',
    profileImage: require('../assets/user_profile.png'),
    title: '보낸 알람 확인',
    description: '알람 내용이 여기에 표시됩니다.',
    time: '1시간 전',
  },
  {
    id: '3',
    profileImage: require('../assets/user_profile.png'),
    title: '보낸 알람 확인',
    description: '알람 내용이 여기에 표시됩니다.',
    time: '2시간 전',
  },
  {
    id: '4',
    profileImage: require('../assets/user_profile.png'),
    title: '보낸 알람 확인',
    description: '알람 내용이 여기에 표시됩니다.',
    time: '1일 전',
  },
  {
    id: '5',
    profileImage: require('../assets/user_profile.png'),
    title: '보낸 알람 확인',
    description: '알람 내용이 여기에 표시됩니다.',
    time: '2일 전',
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState('전체');

  const tabs = ['전체', '가족 알림', '받은 문자', '시스템 알림'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Image source={require('../assets/Group 45.png')} style={styles.bellIcon} />
            <Image source={require('../assets/bell.fill.png')} style={[styles.bellIcon, { position: 'absolute', width: wp(15), height: wp(15), top: wp(-5), left: wp(30), transform: [{ translateX: wp(5) }] }]} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>보낸 알람 확인</Text>
              <Text style={styles.infoDescription}>
                가족들에게 보낸 알람을 확인 할 수 있어요.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.tabSelected,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextSelected,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification List */}
        {notificationData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.notificationItem}>
            <Image source={item.profileImage} style={styles.profileImage} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDescription}>{item.description}</Text>
            </View>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 하단 배너 및 탭 */}
      <View style={styles.bottomBanner}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>AD</Text>
        </View>
        <Text style={styles.bannerTitle}>얄코 맛나요 건강</Text>
        <Text style={styles.bannerDesc}>간편하고 맛있어!</Text>
      </View>

      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/house.png')} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>피드</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Report')}>
          <Image source={require('../assets/list.bullet.clipboard.png')} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리포트</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image source={require('../assets/medal.png')} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리워드</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Image source={require('../assets/person.png')} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>프로필</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#08504A',
    fontFamily: 'SUIT',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'SUIT',
    fontWeight: '700',
    color: '#08504A',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(189, 229, 226, 0.4)',
    borderWidth: 1,
    borderColor: '#5CC5BC',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bellIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    transform: [{ rotate: '-11deg' }],
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'SUIT',
    fontWeight: '700',
    color: '#08504A',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    fontFamily: 'SUIT',
    fontWeight: '400',
    color: '#2F2F2F',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
    color: '#777777',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabSelected: {
    backgroundColor: '#BDE5E2',
    borderColor: '#BDE5E2',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'SUIT',
    fontWeight: '500',
    color: '#777777',
  },
  tabTextSelected: {
    color: '#08504A',
    fontWeight: '700',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5CC5BC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 80,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#BDE5E2',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'SUIT',
    fontWeight: '700',
    color: '#08504A',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: 'SUIT',
    fontWeight: '400',
    color: '#2F2F2F',
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: 'SUIT',
    fontWeight: '400',
    color: '#777777',
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    backgroundColor: '#f9f9f9',
  },
  bannerBadge: {
    backgroundColor: '#bde5e2',
    paddingHorizontal: wp(5),
    paddingVertical: wp(2),
    borderRadius: wp(4),
    marginRight: wp(8),
  },
  bannerBadgeText: {
    fontSize: wp(9),
    color: '#08504a',
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: wp(12),
    fontWeight: '700',
    color: '#333',
    marginRight: wp(5),
  },
  bannerDesc: {
    fontSize: wp(12),
    color: '#989898',
    flex: 1,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: wp(10),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: wp(10),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: wp(24),
    height: wp(24),
    marginBottom: wp(4),
  },
});
