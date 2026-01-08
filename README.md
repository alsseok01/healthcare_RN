# 📱 Healthcare - Frontend ( 융합창업종합설계 )
본 프로젝트는 융합창업종합설계 주제 중 모든 세대를 위한 건강관리어플의 프로토타입을 만드는 것을 목적으로 한다.
디자인학과, 경영학과, 컴퓨터공학과의 협업으로 진행되었다.

프로젝트 명: Pokit
개발 목적: 처방전 분석 및 복약 루틴과 AI 챗봇을 통해 사용자의 건강 유지 및 약물 오남용을 방지한다.
대상: 모든 세대를 목적으로 하며 주요 대상은 모두의 건강을 생각하는 4050 세대 이다.
<https://miro.com/app/board/uXjVJhZ3kjM=/?share_link_id=842951903064> 링크를 통해 결과물을 확인 할 수 있다.

## 🏆 주요 담당 및 성과
Figma 디자인 시스템 구축 및 구현: Figma에서 설계된 디자인 요소를 React Native 컴포넌트로 이식
반응형 UI 대응: utils/scaling.js를 활용하여 다양한 모바일 기기 크기에 대응하는 유연한 레이아웃 설계
AI 서비스 통합: Backend의 Gemini 2.0 및 OCR API와 연동하여 사진 한 장으로 약 성분 분석 및 자동 루틴 등록 기능 구현

# 🌟 핵심 기능
1. AI 알약 식별 및 OCR 분석
   + CameraScreen: 카메라로 처방전이나 약 봉투를 촬영
   + OCRResultScreen: 텍스트 추출 결과를 바탕으로 약 목록을 파싱하여 제공
2. 스마트 복약 루틴 관리
   + RoutineRegistrationScreen: 복용 기간, 요일, 시간을 설정하여 개인 맞춤형 알람 생성
   + Home/Notification: 오늘 복용해야 할 약을 타임라인 형태로 시각화하고 푸시 알림 제공
3. AI 기반 챗봇
   + Gemini 연동: 약의 효능, 부작용, 복용 시 주의사항에 대해 AI와 실시간 채팅을 통해 정보 제공

# 🚀 실행 및 테스트 방법
1. 환경 설정
   + Node.js (v18 이상 권장)
   + Android Studio (Android emulator) 또는 Xcode (iOS simulator) 설정
2. 의존성 설치
   + npm install
   + cd ios && pod install && cd ..
3. 실행
   + npm run android ( android )
   + npm run ios ( ios )
