import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// ImagePicker와 MLKit에서 타입(Type)들도 함께 import 합니다.
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import TextRecognition, {
  TextRecognitionResult,
} from '@react-native-ml-kit/text-recognition';

// [중요] data.go.kr에서 발급받은 본인의 서비스 키(URL 인코딩된 버전)를 입력하세요.
const API_SERVICE_KEY = 'YOUR6cc28f6d1e890033344389f0ece41fa143c9a78bd24ab2a29ae101baadf0aefe_PUBLIC_DATA_PORTAL_SERVICE_KEY';
// 'e약은요' 서비스 API 엔드포인트
const API_ENDPOINT =
  'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';

// API 응답 결과 중 약물 정보의 타입을 정의합니다.
interface DrugInfo {
  name: string;
  usage?: string;
  precautions?: string;
  sideEffects?: string;
}

// API 응답 전체의 타입을 정의합니다.
interface ApiItem {
  itemName: string;
  useMethodQesitm?: string;
  atpnQesitm?: string;
  seQesitm?: string;
}
interface ApiResponseBody {
  items?: ApiItem[];
}
interface ApiResponse {
  response: {
    header: {resultCode: string; resultMsg: string};
    body: ApiResponseBody;
  };
}

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // useState에 <DrugInfo | null> 타입을 지정하여 drugInfo의 타입을 명확하게 합니다.
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);

  // 1. 이미지 런처 옵션 (타입 지정)
  const imagePickerOptions: CameraOptions | ImageLibraryOptions = {
    mediaType: 'photo',
    quality: 1,
  };

  // 2. OCR 수행 및 API 검색 (imageUri의 타입을 string | undefined로 지정)
  const processImageForOCR = async (imageUri: string | undefined) => {
    if (!imageUri) return;
    setIsLoading(true);
    try {
      // ML Kit 결과의 타입을 TextRecognitionResult로 지정
      const result: TextRecognitionResult = await TextRecognition.recognize(
        imageUri,
      );

      if (result.blocks.length > 0) {
        const firstWord = result.blocks[0]?.lines[0]?.text.split(' ')[0];

        if (firstWord) {
          Alert.alert('OCR 인식 완료', `인식된 검색어: ${firstWord}`);
          setSearchQuery(firstWord);
          await searchDrugApi(firstWord);
        } else {
          Alert.alert('OCR 실패', '텍스트를 인식하지 못했습니다.');
        }
      } else {
        Alert.alert('OCR 실패', '텍스트를 찾지 못했습니다.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('오류', '텍스트 인식 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  // 기능 1: 갤러리 (response 타입을 ImagePickerResponse로 지정)
  const handleGalleryOCR = () => {
    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // response.assets가 존재하고 비어있지 않은지 확인
        if (response.assets && response.assets.length > 0) {
          processImageForOCR(response.assets[0].uri);
        }
      }
    });
  };

  // 기능 2: 카메라 (response 타입을 ImagePickerResponse로 지정)
  const handleCameraOCR = () => {
    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        // response.assets가 존재하고 비어있지 않은지 확인
        if (response.assets && response.assets.length > 0) {
          processImageForOCR(response.assets[0].uri);
        }
      }
    });
  };

  // 기능 3: 텍스트 검색
  const handleTextSearch = () => {
    if (searchQuery.trim().length === 0) {
      Alert.alert('검색 오류', '약물 이름을 입력해주세요.');
      return;
    }
    searchDrugApi(searchQuery);
  };

  // 4. 'e약은요' API 호출 (itemName 타입을 string으로 지정)
  const searchDrugApi = async (itemName: string) => {

    setIsLoading(true);
    setDrugInfo(null);

    // URLSearchParams에 들어가는 값은 문자열이어야 함 (숫자를 '1'로 변경)
    const queryParams = new URLSearchParams({
      serviceKey: API_SERVICE_KEY,
      itemName: itemName,
      type: 'json',
      numOfRows: '1', // 1 -> '1'
      pageNo: '1', // 1 -> '1'
    });
    const requestUrl = `${API_ENDPOINT}?${queryParams.toString()}`;

    try {
      const response = await fetch(requestUrl);
      // API 응답 타입을 ApiResponse로 지정
      const data: ApiResponse = await response.json();

      if (data.response?.header?.resultCode === '00') {
        if (data.response.body.items && data.response.body.items.length > 0) {
          const item = data.response.body.items[0];

          setDrugInfo({
            name: item.itemName,
            usage: item.useMethodQesitm,
            precautions: item.atpnQesitm,
            sideEffects: item.seQesitm,
          });
          setModalVisible(true);
        } else {
          Alert.alert('검색 결과 없음', '일치하는 약물 정보를 찾지 못했습니다.');
        }
      } else {
        Alert.alert(
          'API 오류',
          data.response?.header?.resultMsg || 'API 호출에 실패했습니다.',
        );
      }
    } catch (error) {
      console.error('API Fetch Error:', error);
      Alert.alert('네트워크 오류', 'API 요청 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  // 5. 결과 표시 모달
  const renderDrugInfoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setDrugInfo(null);
      }}>
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView style={styles.modalScroll}>
          {/* drugInfo가 null이 아님을 TypeScript에 알려줌 */}
          {drugInfo && (
            <>
              <Text style={styles.modalTitle}>약물 정보: {drugInfo.name}</Text>

              <Text style={styles.modalHeader}>복용 방법</Text>
              {/* .replace 전 ?(Optional Chaining)를 붙여 null 에러 방지 */}
              <Text style={styles.modalText}>
                {drugInfo.usage?.replace(/<p>|<\/p>/g, '') ?? '정보 없음'}
              </Text>

              <Text style={styles.modalHeader}>주의 사항</Text>
              <Text style={styles.modalText}>
                {drugInfo.precautions?.replace(/<p>|<\/p>/g, '') ?? '정보 없음'}
              </Text>

              <Text style={styles.modalHeader}>주요 부작용</Text>
              <Text style={styles.modalText}>
                {drugInfo.sideEffects?.replace(/<p>|<\/p>/g, '') ?? '정보 없음'}
              </Text>
            </>
          )}
        </ScrollView>
        <Button title="닫기" onPress={() => setModalVisible(false)} />
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>약물 정보 프로토타입</Text>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>처리 중...</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="1. 갤러리에서 처방전 인식"
          onPress={handleGalleryOCR}
          disabled={isLoading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="2. 카메라로 처방전 촬영"
          onPress={handleCameraOCR}
          disabled={isLoading}
        />
      </View>
      <Text style={styles.label}>3. 약물 이름으로 직접 검색</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 한미아스피린장용정"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button
        title="검색 실행"
        onPress={handleTextSearch}
        disabled={isLoading}
      />
      {renderDrugInfoModal()}
    </SafeAreaView>
  );
};

// ... (styles 코드는 동일)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    marginTop: 20,
    padding: 20,
  },
  modalScroll: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default App;