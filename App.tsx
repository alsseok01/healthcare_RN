import React, { useEffect } from 'react'; 
import 'react-native-gesture-handler';
import 'react-native-screens';
import { StyleSheet } from 'react-native';
import StartScreen from './app/components/FigmaExport/StartScreen';
import OnboardingScreen from './app/components/FigmaExport/OnboardingScreen';
import Onboarding2Screen from './app/components/FigmaExport/Onboarding2Screen';
import Onboarding3Screen from './app/components/FigmaExport/Onboarding3Screen';
import HomeScreen from './app/components/FigmaExport/HomeScreen';
import ReportScreen from './app/components/FigmaExport/ReportScreen';
import MealDetailScreen from './app/components/FigmaExport/MealDetailScreen';
import NotificationScreen from './app/NotificationScreen';
import AIChatScreen from './app/components/FigmaExport/AIChatScreen';
import PillSearchScreen from './app/components/FigmaExport/PillSearchScreen';
import RoutineRegistrationScreen from './app/components/FigmaExport/RoutineRegistrationScreen';
import CameraScreen from './app/components/FigmaExport/CameraScreen';
import OCRResultScreen from './app/components/FigmaExport/OCRResultScreen';
import PillDetailScreen from './app/components/FigmaExport/PillDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationService from './app/services/notificationService';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // 앱 시작 시 알림 서비스 초기화
    NotificationService.initialize();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Start"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationDuration: 400,
        }}
      >
        {/* 온보딩 화면 */}
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
        <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
        
        {/* 메인 앱 화면들 */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="MealDetail" component={MealDetailScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="PillSearch" component={PillSearchScreen} />
        <Stack.Screen name="RoutineRegistration" component={RoutineRegistrationScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="OCRResult" component={OCRResultScreen} />
        <Stack.Screen name="PillDetail" component={PillDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 배경색 지정 (필요 시)
  },
});