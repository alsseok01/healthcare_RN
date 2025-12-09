import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import Video from 'react-native-video';

const StartScreen = ({ navigation }: { navigation: any }) => {
  const handleNaverLogin = () => {
    // TODO: 네이버 로그인 API 연동
    console.log('네이버 로그인 시도');
    navigation.navigate('Onboarding'); // 로그인 성공 후 온보딩 화면으로
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 API 연동
    console.log('카카오 로그인 시도');
    navigation.navigate('Onboarding'); // 로그인 성공 후 온보딩 화면으로
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5CC5BC" />

      <View style={styles.content}>
        <View style={styles.characterContainer}>
          <View style={styles.characterPlaceholder}>
            <Image source={require("../../../assets/Start.png")} style={{ width: 121, height: 176 }} resizeMode="contain" />

            {/* <Video
              source={require("../../../assets/pokit.mp4")}
              style={{ width: 121, height: 176 }}
              resizeMode="contain"
              repeat={true}
              muted={true}
              playInBackground={false}
              playWhenInactive={false}
            /> */}
          </View>
        </View>

        {/* Pokit 텍스트 */}
        <Text style={styles.pokitTitle}>Pokit</Text>
        
        {/* 부제목 */}
        <Text style={styles.subtitle}>내 손 안에 건강앱</Text>

        {/* 로그인 버튼들 */}
        <View style={styles.buttonContainer}>
          {/* 네이버 로그인 버튼 */}
          <TouchableOpacity
            style={styles.naverButton}
            onPress={handleNaverLogin}
            activeOpacity={0.8}
          >
            <View style={styles.naverLogoContainer}>
                <Image source={require("../../../assets/naver.png")} style={{ width: 16, height: 16 }} resizeMode="contain" />
            </View>
            <Text style={styles.naverButtonText}>네이버 로그인</Text>
          </TouchableOpacity>

          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity
            style={styles.kakaoButton}
            onPress={handleKakaoLogin}
            activeOpacity={0.8}
          >
            <View style={styles.kakaoLogoContainer}>
                <Image source={require("../../../assets/kakao.png")} style={{ width: 18, height: 18, right: 11 }} resizeMode="contain" />
            </View>
            <Text style={styles.kakaoButtonText}>카카오 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsla(175, 48%, 57%, 1.00)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  characterContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  characterPlaceholder: {
    width: 121,
    height: 176,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterText: {
    fontSize: 80,
  },
  pokitTitle: {
    fontSize: 96,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#BDE5E2',
    textAlign: 'center',
    marginBottom: 110,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  naverButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6EA',
    borderRadius: 4,
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    gap: 15,
  },
  naverLogoContainer: {
    width: 16,
    height: 16,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  naverLogo: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  naverButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#767678',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 6,
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    gap: 8,
  },
  kakaoLogoContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoLogo: {
    color: '#000000',
    fontSize: 18,
  },
  kakaoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.85)',
  },
});

export default StartScreen;
