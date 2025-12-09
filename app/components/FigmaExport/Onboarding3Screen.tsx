import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Onboarding3Screen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // 3초 후 자동으로 Home 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#A5DDD7', '#C7DFCE']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        
        {/* 헤더 영역 */}
        <View style={styles.header}>
          
          {/* 프로그레스 바 (완료) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFull} />
          </View>
        </View>

        <View style={styles.content}>
          {/* 캐릭터 이미지 */}
          <View style={styles.characterContainer}>
            <Image source={require("../../../assets/Group 69.png")} style={{ width: 120, height: 120 }} resizeMode="contain" />
          </View>

          {/* 로딩중 텍스트 */}
          <Text style={styles.loadingText}>로딩중...</Text>

          {/* 메인 메시지 */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>온 가족 건강 관리</Text>
            <Text style={styles.messageText}>내 손 안의 앱 포킷과 함께!</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 16,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 40,
  },
  progressBarFull: {
    height: '100%',
    width: '100%', // 100% 완료
    backgroundColor: '#5CC5BC',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  characterContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'visible',
  },
  characterIcon: {
    fontSize: 72,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777777',
    marginBottom: 40,
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#08504A',
    textAlign: 'center',
    lineHeight: 34,
  },
});

export default Onboarding3Screen;
