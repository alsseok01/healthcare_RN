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

type UserRole = 'caregiver' | 'receiver' | null;

const OnboardingScreen = ({ navigation }: { navigation: any }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleContinue = () => {
    if (selectedRole) {
      // TODO: 선택한 역할을 저장 (AsyncStorage 또는 API)
      console.log('선택한 역할:', selectedRole);
      // 다음 온보딩 화면으로 이동
      navigation.navigate('Onboarding2');
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
        <Text style={styles.title}>당신의 역할을 골라주세요</Text>

        {/* 역할 선택 카드들 */}
        <View style={styles.roleCardsContainer}>
          {/* 챙겨주는 사람 */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'caregiver' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('caregiver')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconContainer}>
                <Image source={require("../../../assets/Group 3.png")} style={{ width: 70, height: 70 }} />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>챙겨주는 사람</Text>
              <Text style={styles.roleDescription}>
                가족의 건강을 꼼꼼히 챙겨주고 싶은 분,{'\n'}
                이 가족의 챙김이는 바로 나!
              </Text>
            </View>
          </TouchableOpacity>

          {/* 챙김 받는 사람 */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'receiver' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('receiver')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconContainer}>
                <Image source={require("../../../assets/Group 4.png")} style={{ width: 75, height: 75 }} />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>챙김 받는 사람</Text>
              <Text style={styles.roleDescription}>
                가족의 권유로 접속하시게 된 분,{'\n'}
                챙김이의 보살핌을 받는 사람은 나야!
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
            !selectedRole && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
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
    width: '33%', // 1/3 진행
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
  roleCardsContainer: {
    gap: 28,
  },
  roleCard: {
    backgroundColor: '#BDE5E2',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 116,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: '#329c93ff',
    backgroundColor: '#9bdbd7ff',
  },
  roleIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleIcon: {
    fontSize: 40,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#08504A',
    marginBottom: 6,
  },
  roleDescription: {
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

export default OnboardingScreen;
