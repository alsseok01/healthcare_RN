import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as API from '../../services/api'; // API import

const CameraScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ]);
        if (
          granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.warn('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
      quality: 0.8,
    });

    if (result.didCancel) {
      console.log('User cancelled camera');
    } else if (result.errorCode) {
      Alert.alert('오류', '카메라 에러: ' + result.errorMessage);
    } else if (result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSelectFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      Alert.alert('오류', '갤러리 에러: ' + result.errorMessage);
    } else if (result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // [수정] 확인 버튼: 백엔드 OCR API 호출
  const handleConfirm = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '이미지를 선택해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      const response = await API.analyzePillImage(selectedImage);

      if (response.success && response.data && response.data.length > 0) {
        // [변경] 분석 성공 시 OCR 결과 화면으로 이동
        navigation.navigate('OCRResult', { 
          ocrResults: response.data, // 분석된 약 정보 리스트 전달
          imageUri: selectedImage 
        });
      } else {
        Alert.alert('분석 실패', response.error || '이미지에서 약 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 닫기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 카메라 프리뷰 영역 */}
      <View style={styles.cameraContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>AI가 약 정보를 분석 중입니다...</Text>
          </View>
        ) : selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>카메라로 약을 촬영하거나{'\n'}앨범에서 선택하세요</Text>
          </View>
        )}
      </View>

      {/* 하단 버튼 영역 (로딩 중엔 숨김) */}
      {!isLoading && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.galleryButton} onPress={handleSelectFromGallery}>
            <Text style={styles.galleryButtonText}>앨범</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {selectedImage ? (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: wp(50) }} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: wp(20),
    left: wp(20),
    zIndex: 10,
  },
  closeButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: wp(24),
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: wp(16),
    color: '#fff',
    textAlign: 'center',
    lineHeight: wp(24),
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: wp(16),
    color: '#fff',
    fontSize: wp(16),
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: wp(30),
    paddingHorizontal: wp(20),
  },
  galleryButton: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
  },
  galleryButtonText: {
    fontSize: wp(16),
    color: '#fff',
    fontWeight: '600',
  },
  captureButton: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(35),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: wp(4),
    borderColor: '#ddd',
  },
  captureButtonInner: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    backgroundColor: '#fff',
  },
  confirmButton: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
  },
  confirmButtonText: {
    fontSize: wp(16),
    color: '#5cc5bc',
    fontWeight: '600',
  },
});

export default CameraScreen;