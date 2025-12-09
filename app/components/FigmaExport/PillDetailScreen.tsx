import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as API from '../../services/api';

const PillDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const pillData: API.PillInfo = route.params?.pillData;

  if (!pillData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>약 정보를 불러올 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복용약 정보</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.resultCard}>
          {/* 루틴 등록 버튼 */}
          <TouchableOpacity 
            style={styles.routineButton} 
            onPress={() => navigation.navigate('RoutineRegistration', { pillName: pillData.itemName })}
          >
            <Image 
              source={require("../../../assets/clock1.png")} 
              style={styles.clockImage} 
              resizeMode="contain" 
            />
            <Text style={styles.routineButtonText}>루틴 등록하기</Text>
          </TouchableOpacity>

          {/* 약 이미지 표시 */}
          {pillData.imageUrl ? (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: pillData.imageUrl }} 
                style={styles.pillImage} 
                resizeMode="contain" 
              />
            </View>
          ) : null}

          {/* 약 이름 */}
          <View style={styles.resultHeader}>
            <Text style={styles.pillName}>{pillData.itemName}</Text>
          </View>
          
          {/* 효능·효과 */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>✅ 효능·효과</Text>
            <Text style={styles.infoText}>
              {pillData.efcyQesitm || '정보가 없습니다.'}
            </Text>
          </View>

          {/* 용법·용량 */}
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>📋 용법·용량</Text>
            <Text style={styles.infoText}>
              {pillData.useMethodQesitm || '정보가 없습니다.'}
            </Text>
          </View>

          {/* 주의사항 */}
          <View style={styles.infoGroup}>
            <Text style={[styles.infoLabel, {color: '#e84444'}]}>⚠️ 사용상 주의사항</Text>
            <Text style={styles.infoText}>
              {pillData.atpnWarnQesitm || '정보가 없습니다.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: wp(16), 
    paddingVertical: wp(12), 
    height: wp(60) 
  },
  backButton: { 
    width: wp(40), 
    height: wp(40), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backIcon: { 
    fontSize: wp(20), 
    color: '#08504a', 
    fontWeight: 'bold' 
  },
  headerTitle: { 
    fontSize: wp(20), 
    fontWeight: '700', 
    color: '#08504a', 
    marginLeft: wp(8) 
  },
  content: { 
    flex: 1 
  },
  routineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(8),
    paddingHorizontal: wp(12),
    marginBottom: wp(12),
  },
  clockImage: {
    width: wp(16),
    height: wp(16),
    marginRight: wp(6),
  },
  routineButtonText: {
    fontSize: wp(14),
    fontWeight: '600',
    color: '#08504a',
  },
  resultCard: {
    marginHorizontal: wp(16),
    marginTop: wp(16),
    padding: wp(16),
    backgroundColor: '#fff',
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: wp(16),
    backgroundColor: '#f9f9f9',
    borderRadius: wp(8),
    padding: wp(8),
  },
  pillImage: {
    width: '100%',
    height: wp(150),
  },
  resultHeader: { 
    marginBottom: wp(12) 
  },
  pillName: { 
    fontSize: wp(18), 
    fontWeight: 'bold', 
    color: '#08504a' 
  },
  infoGroup: { 
    marginBottom: wp(16) 
  },
  infoLabel: { 
    fontSize: wp(14), 
    fontWeight: '700', 
    color: '#08504a', 
    marginBottom: wp(4) 
  },
  infoText: { 
    fontSize: wp(13), 
    color: '#333', 
    lineHeight: wp(20) 
  },
});

export default PillDetailScreen;
