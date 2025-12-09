import { Dimensions } from 'react-native';

// 1. 기기의 현재 화면 너비를 가져옵니다.
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 2. 피그마의 디자인 기준 너비를 적어주세요. (예: 393px)
const FIGMA_WINDOW_WIDTH = 390;

// 3. px을 반응형 크기로 바꿔주는 함수입니다.
export function wp(width) {
  const ratio = width / FIGMA_WINDOW_WIDTH; // 비율 계산 (예: 100px / 393px)
  return Math.round(SCREEN_WIDTH * ratio);  // 현재 기기 너비에 맞춰 반환
}
