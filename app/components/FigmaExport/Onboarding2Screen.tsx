import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

type ScreenMode = 'normal' | 'senior' | null;

const Onboarding2Screen = ({ navigation }: { navigation: any }) => {
  const [selectedMode, setSelectedMode] = useState<ScreenMode>(null);

  const handleContinue = () => {
    if (selectedMode) {
      // TODO: 선택한 화면 모드를 저장 (AsyncStorage 또는 API)
      console.log('선택한 화면 모드:', selectedMode);
      // 마지막 온보딩 화면으로 이동
      navigation.navigate('Onboarding3');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
      
      {/* 헤더 영역 */}
      <View style={styles.header}>
        
        
        {/* 프로그레스 바 */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 제목 */}
        <Text style={styles.title}>화면 스타일을 선택해주세요</Text>

        {/* 화면 모드 선택 카드들 */}
        <View style={styles.modeCardsContainer}>
          {/* 일반 모드 */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              selectedMode === 'normal' && styles.modeCardSelected,
            ]}
            onPress={() => setSelectedMode('normal')}
            activeOpacity={0.8}
          >
            <View style={styles.modeIconContainer}>
                <Image source={require("../../../assets/Group 1.png")} style={{ width: 70, height: 70 }} />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>일반글씨, 다양한 기능</Text>
              <Text style={styles.modeDescription}>
                포킷만의 다양한 서비스를 누리고 싶으신 분,{'\n'}
                건강 관리 어플이 낯설지는 않으신 분
              </Text>
            </View>
          </TouchableOpacity>

          {/* 시니어 모드 */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              selectedMode === 'senior' && styles.modeCardSelected,
            ]}
            onPress={() => setSelectedMode('senior')}
            activeOpacity={0.8}
          >
            <View style={styles.modeIconContainer}>
                <Image source={require("../../../assets/Group 2.png")} style={{ width: 70, height: 70 }} />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>큰 글씨, 간단한 화면</Text>
              <Text style={styles.modeDescription}>
                필수적인 간단한 기능만 사용해도 괜찮은 분,{'\n'}
                시니어용 모드
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 계속하기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedMode && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedMode}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>계속하기</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
    marginTop: 40,
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 16,
    marginTop: 40,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '66%', // 2/3 진행
    backgroundColor: '#5CC5BC',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#777777',
    marginBottom: 80,
  },
  modeCardsContainer: {
    gap: 28,
  },
  modeCard: {
    backgroundColor: '#BDE5E2',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 116,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeCardSelected: {
    borderColor: '#329c93ff',
    backgroundColor: '#9bdbd7ff',
  },
  modeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeIcon: {
    fontSize: 40,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#08504A',
    marginBottom: 6,
  },
  modeDescription: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#5CC5BC',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  continueButtonDisabled: {
    backgroundColor: '#D9D9D9',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Onboarding2Screen;
