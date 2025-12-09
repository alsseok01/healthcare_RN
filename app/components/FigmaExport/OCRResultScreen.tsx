import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as API from '../../services/api';

const OCRResultScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // CameraScreen에서 넘겨준 데이터 수신
  const imageUri = route.params?.imageUri || '';
  const passedResults: API.PillDto[] = route.params?.ocrResults || [];
  
  const [ocrResults, setOcrResults] = useState<API.PillDto[]>(passedResults);
  const [selectedPills, setSelectedPills] = useState<Set<string>>(new Set());

  const togglePillSelection = (pillName: string) => {
    setSelectedPills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pillName)) {
        newSet.delete(pillName);
      } else {
        newSet.add(pillName);
      }
      return newSet;
    });
  };

  const handleResultPress = async (pillName: string) => {
    try {
      // 선택한 약 이름으로 상세 정보 조회
      const response = await API.searchPills(pillName);
      
      if (response.success && response.data && response.data.itemName) {
        // 약 상세 정보 화면으로 이동
        navigation.navigate('PillDetail', { pillData: response.data });
      } else {
        Alert.alert('오류', '약 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '약 정보 조회 중 문제가 발생했습니다.');
    }
  };

  const handleRegisterRoutine = () => {
    if (selectedPills.size === 0) {
      Alert.alert('알림', '루틴에 등록할 약을 선택해주세요.');
      return;
    }

    const selectedPillNames = Array.from(selectedPills);
    
    if (selectedPillNames.length === 1) {
      // 1개 선택: 바로 루틴 등록 화면으로 이동
      navigation.navigate('RoutineRegistration', { pillName: selectedPillNames[0] });
    } else {
      // 여러 개 선택: 각각 등록 vs 모두 함께 등록 선택
      Alert.alert(
        '루틴 등록 방식',
        '선택한 약들을 어떻게 등록하시겠습니까?',
        [
          {
            text: '각각 등록',
            onPress: () => registerSeparately(selectedPillNames)
          },
          {
            text: '모두 함께 등록',
            onPress: () => {
              navigation.navigate('RoutineRegistration', { 
                pillName: selectedPillNames.join(', '),
                pillNames: selectedPillNames 
              });
            }
          },
          {
            text: '취소',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const registerSeparately = (pillNames: string[]) => {
    if (pillNames.length === 0) return;

    const [currentPill, ...remainingPills] = pillNames;
    
    // 첫 번째 약으로 루틴 등록 화면 이동
    // 나머지 약들의 정보를 함께 전달
    navigation.navigate('RoutineRegistration', { 
      pillName: currentPill,
      remainingPills: remainingPills,
      isSequentialRegistration: true
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복용약 검색하기</Text>
      </View>

      {/* 검색 입력 (비활성화 상태로 표시) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchPlaceholder}>이미지 분석 완료</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 예상 검색 결과 타이틀 */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>예상 검색 결과</Text>
          <Text style={styles.resultSubtitle}>결과를 보려면 클릭해주세요!</Text>
        </View>

        {/* OCR 결과 리스트 */}
        {ocrResults.length > 0 ? (
          <View style={styles.resultList}>
            {ocrResults.map((pill, index) => {
              const isSelected = selectedPills.has(pill.itemName);
              return (
                <View key={index} style={styles.resultItemContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                    onPress={() => togglePillSelection(pill.itemName)}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.resultItem, isSelected && styles.resultItemSelected]}
                    onPress={() => handleResultPress(pill.itemName)}
                  >
                    <Text style={styles.resultItemText}>{pill.itemName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            <Text style={styles.emptySubText}>이미지를 다시 촬영해 주세요.</Text>
          </View>
        )}
      </ScrollView>

      {/* 하단 루틴 등록 버튼 */}
      {ocrResults.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.viewResultButton, 
              selectedPills.size > 0 && styles.viewResultButtonActive
            ]} 
            onPress={handleRegisterRoutine}
          >
            <Text style={styles.viewResultText}>
              루틴 등록하기 {selectedPills.size > 0 && `(${selectedPills.size})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: wp(12),
    height: wp(60),
  },
  backButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: wp(20),
    color: '#08504a',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: wp(20),
    fontWeight: '700',
    color: '#08504a',
    marginLeft: wp(8),
  },
  searchContainer: {
    paddingHorizontal: wp(16),
    paddingVertical: wp(12),
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebecee',
    borderRadius: wp(10),
    paddingHorizontal: wp(16),
    height: wp(44),
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: wp(14),
    color: '#08504a',
    fontWeight: '600',
  },
  clearButton: {
    width: wp(24),
    height: wp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: wp(16),
    color: '#3e9f97',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(16),
  },
  resultHeader: {
    marginTop: wp(20),
    marginBottom: wp(10),
  },
  resultTitle: {
    fontSize: wp(20),
    fontWeight: '700',
    color: '#08504a',
    marginBottom: wp(8),
  },
  resultSubtitle: {
    fontSize: wp(12),
    fontWeight: '400',
    color: '#08504a',
  },
  resultList: {
    marginTop: wp(10),
  },
  resultItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(18),
  },
  checkbox: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(6),
    borderWidth: wp(2),
    borderColor: '#bde5e2',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(12),
  },
  checkboxSelected: {
    backgroundColor: '#3e9f97',
    borderColor: '#3e9f97',
  },
  checkmark: {
    color: '#fff',
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  resultItem: {
    flex: 1,
    backgroundColor: 'rgba(189, 229, 226, 0.4)',
    borderRadius: wp(11),
    height: wp(77),
    justifyContent: 'center',
    paddingHorizontal: wp(20),
  },
  resultItemSelected: {
    backgroundColor: 'rgba(62, 159, 151, 0.2)',
    borderWidth: wp(2),
    borderColor: '#3e9f97',
  },
  resultItemText: {
    fontSize: wp(18),
    fontWeight: '700',
    color: '#08504a',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: wp(60),
  },
  emptyText: {
    fontSize: wp(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: wp(8),
  },
  emptySubText: {
    fontSize: wp(13),
    color: '#999',
  },
  bottomContainer: {
    paddingHorizontal: wp(16),
    paddingVertical: wp(20),
  },
  viewResultButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: wp(26),
    height: wp(52),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewResultButtonActive: {
    backgroundColor: '#3e9f97',
  },
  viewResultText: {
    fontSize: wp(20),
    fontWeight: '700',
    color: '#fff',
  },
});

export default OCRResultScreen;