import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import MenuModal from './MenuModal';
import PillSearchModal from './PillSearchModal';

interface ScreenLayoutProps {
  children: React.ReactNode;
  selectedId?: string;
  setSelectedId?: (id: string) => void;
}

const ScreenLayout = ({ children, selectedId = 'me', setSelectedId }: ScreenLayoutProps) => {
  const navigation = useNavigation<any>();
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [pillSearchModalVisible, setPillSearchModalVisible] = useState(false);

  const renderStoryItem = (id: string, name: string, imageSource: any, isMe = false) => {
    const isSelected = selectedId === id;

    return (
      <TouchableOpacity
        key={id}
        style={styles.storyItem}
        onPress={() => {
          setSelectedId?.(id);
        }}
      >
        {isSelected ? (
          <View style={styles.storyActiveContainer}>
            <Image source={require("../../../assets/Ellipse 88.png")} style={styles.storyBg} resizeMode="contain" />
            <Image source={imageSource} style={styles.storyProfile} resizeMode="contain" />
          </View>
        ) : (
          <View style={styles.storyInactiveContainer}>
            <Image source={imageSource} style={styles.storyImage} resizeMode="contain" />
          </View>
        )}

        <Text style={[styles.storyText, isSelected && styles.storyTextSelected]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/Vector.png")} style={{ width: wp(50), height: wp(50), top: wp(5) }} resizeMode="contain" />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require("../../../assets/calendar.png")} style={styles.icon24} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image source={require("../../../assets/message.badge.png")} style={styles.icon24} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
            <Image source={require("../../../assets/ellipsis.circle.png")} style={styles.icon24} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 스토리 영역 */}
      <View style={styles.storySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyScrollContent}>
          {renderStoryItem('me', '나', require("../../../assets/user_profile.png"), true)}
          {renderStoryItem('dad', '아빠', require("../../../assets/user_profile.png"))}
          {renderStoryItem('daughter', '딸', require("../../../assets/user_profile.png"))}
          {renderStoryItem('husband', '남편', require("../../../assets/user_profile.png"))}

          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => {
              setSelectedId?.('ad');
            }}
          >
            <View style={selectedId === 'ad' ? styles.storyActiveContainer : styles.storyInactiveContainer}>
              {selectedId === 'ad' ? (
                <>
                  <Image source={require("../../../assets/Ellipse 74.png")} style={styles.storyProfile} resizeMode="contain" />
                </>
              ) : (
                <Image source={require("../../../assets/Ellipse 74.png")} style={styles.storyImage} />
              )}
              <View style={styles.adBadge}><Text style={styles.adBadgeText}>AD</Text></View>
            </View>
            <Text style={[styles.storyText, { color: '#989898' }]}>오메가 3...</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 메인 컨텐츠 영역 */}
      {children}

      {/* 하단 광고 배너 */}
      <TouchableOpacity style={styles.bottomBanner} onPress={() => {}}>
        <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>AD</Text></View>
        <Text style={styles.bannerTitle}>힘쑥쑥 영양제</Text>
        <Text style={styles.bannerDesc} numberOfLines={1}>피곤한 오늘! 오메가 3로 지치지 않는 힘을...</Text>
      </TouchableOpacity>

      {/* 하단 탭 바 */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => { navigation.navigate('Home'); }}>
          <Image source={require("../../../assets/house.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={[styles.tabText, { color: '#08504a', fontWeight: 'bold' }]}>피드</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => { navigation.navigate('Report'); }}>
          <Image source={require("../../../assets/list.bullet.clipboard.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리포트</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/medal.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리워드</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/person.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>프로필</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 모달 */}
      <MenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        onFamilyAnalysis={() => {
          setMenuModalVisible(false);
          // TODO: 가족력 분석 화면으로 이동
        }}
        onAlarmSettings={() => {
          setMenuModalVisible(false);
          setPillSearchModalVisible(true);
        }}
        onAIChat={() => {
          setMenuModalVisible(false);
          navigation.navigate('AIChat');
        }}
      />

      {/* 복용약 검색 모달 */}
      <PillSearchModal
        visible={pillSearchModalVisible}
        onClose={() => setPillSearchModalVisible(false)}
        onCamera={() => {
          setPillSearchModalVisible(false);
          navigation.navigate('Camera');
        }}
        onSearch={() => {
          setPillSearchModalVisible(false);
          navigation.navigate('PillSearch');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* 헤더 */
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(20), paddingVertical: wp(10), height: wp(50) },
  logoContainer: { justifyContent: 'center' },
  headerIcons: { flexDirection: 'row', gap: wp(15) },
  icon24: { width: wp(24), height: wp(24) },

  /* 스토리 영역 */
  storySection: { paddingVertical: wp(10) },
  storyScrollContent: { paddingHorizontal: wp(20), gap: wp(15) },
  storyItem: { alignItems: 'center', width: wp(54) },

  /* [Active] 선택됨: 테두리가 있는 겹침 스타일 */
  storyActiveContainer: {
    width: wp(54),
    height: wp(54),
    marginBottom: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  storyBg: { width: wp(54), height: wp(54), position: 'absolute' },
  storyProfile: { width: wp(48), height: wp(48), borderRadius: wp(24) },

  /* [Inactive] 선택 안 됨: 그냥 이미지 하나 */
  storyInactiveContainer: {
    width: wp(54),
    height: wp(54),
    marginBottom: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyImage: {
    width: wp(54),
    height: wp(54),
    borderRadius: wp(27),
    backgroundColor: '#eee',
  },

  /* 텍스트 */
  storyText: { fontSize: wp(12), color: '#989898', fontFamily: 'SUIT', textAlign: 'center' },
  storyTextSelected: { color: '#000', fontWeight: 'bold' },

  /* 광고 뱃지 */
  adBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: wp(5), paddingHorizontal: wp(3) },
  adBadgeText: { fontSize: wp(8), fontWeight: 'bold' },

  /* 하단 배너 및 탭 */
  bottomBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(20), paddingVertical: wp(10), backgroundColor: '#f9f9f9' },
  bannerBadge: { backgroundColor: '#bde5e2', paddingHorizontal: wp(5), paddingVertical: wp(2), borderRadius: wp(4), marginRight: wp(8) },
  bannerBadgeText: { fontSize: wp(9), color: '#08504a', fontWeight: '700' },
  bannerTitle: { fontSize: wp(12), fontWeight: '700', color: '#333', marginRight: wp(5) },
  bannerDesc: { fontSize: wp(12), color: '#989898', flex: 1 },

  bottomTab: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: wp(10), borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingBottom: wp(10) },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { width: wp(24), height: wp(24), marginBottom: wp(4) },
  tabText: { fontSize: wp(10), color: '#999', fontFamily: 'SUIT' },
});

export default ScreenLayout;
