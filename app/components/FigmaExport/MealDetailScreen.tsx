import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';

const mealData = [
  {
    id: 'meal1',
    time: '25.11.18 오전 9:05',
    name: '루꼴라 샌드위치',
    desc: '따님이 만들어준 샌드위치! 존맛탱',
    calories: '478Kcal',
    image: require('../../../assets/user_profile.png'),
    nutrition: {
      carbs: { percent: '50%', value: '59.75g' },
      protein: { percent: '30%', value: '35.85g' },
      fat: { percent: '20%', value: '10.62g' },
    },
  },
  {
    id: 'meal2',
    time: '25.11.18 오후 12:34',
    name: '김치볶음밥',
    desc: '오랜만에 만든 김치볶음밥!',
    calories: '524Kcal',
    image: require('../../../assets/user_profile.png'),
    nutrition: {
      carbs: { percent: '50%', value: '65.6g' },
      protein: { percent: '37.6%', value: '16.4g' },
      fat: { percent: '12.4%', value: '21.9g' },
    },
  },
  {
    id: 'meal3',
    time: '25.11.18 오후 6:21',
    name: '치킨',
    desc: '따님께서 치밥하자고 하셨다.',
    calories: '1100Kcal',
    image: require('../../../assets/user_profile.png'),
    nutrition: {
      carbs: { percent: '60%', value: '73.3g' },
      protein: { percent: '30%', value: '82.5g' },
      fat: { percent: '10%', value: '27.5g' },
    },
  },
];

const MealDetailScreen = () => {
  const navigation = useNavigation<any>();

  const renderNutritionBar = (meal: typeof mealData[0]) => {
    return (
      <View>
        <LinearGradient
          colors={['#3e9f97', '#5cc5bc', '#bde5e2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.nutritionBar}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>􀆉</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>식사 기록</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {mealData.map((meal, idx) => (
          <View key={meal.id} style={styles.mealCard}>
            {/* 시간 정보 */}
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealDesc}>{meal.desc}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.editText}>수정하기</Text>
              </TouchableOpacity>
            </View>

            {/* 식사 이름 */}
            <View style={styles.divider} />
            <Text style={styles.mealName}>{meal.name}</Text>

            {/* 총 섭취 칼로리 */}
            <View style={styles.calorieRow}>
              <Text style={styles.calorieLabel}>총 섭취 열량</Text>
              <Text style={styles.calorieValue}>{meal.calories}</Text>
            </View>

            {/* 영양 정보 바 */}
            <View style={{ marginVertical: wp(8) }}>
              {renderNutritionBar(meal)}
            </View>

            {/* 영양 정보 상세 */}
            <View style={styles.nutritionDetails}>
              {/* 탄수화물 */}
              <View style={styles.nutritionRow}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, { backgroundColor: '#3e9f97' }]} />
                </View>
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionLabel}>탄수화물({meal.nutrition.carbs.percent})</Text>
                  <Text style={styles.nutritionValue}>{meal.nutrition.carbs.value}</Text>
                </View>
              </View>

              {/* 단백질 */}
              <View style={styles.nutritionRow}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, { backgroundColor: '#5cc5bc' }]} />
                </View>
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionLabel}>단백질({meal.nutrition.protein.percent})</Text>
                  <Text style={styles.nutritionValue}>{meal.nutrition.protein.value}</Text>
                </View>
              </View>

              {/* 지방 */}
              <View style={styles.nutritionRow}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, { backgroundColor: '#bde5e2' }]} />
                </View>
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionLabel}>지방({meal.nutrition.fat.percent})</Text>
                  <Text style={styles.nutritionValue}>{meal.nutrition.fat.value}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* AD 배너 */}
      <View style={styles.adBanner}>
        <View style={styles.adBadge}>
          <Text style={styles.adBadgeText}>AD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.adTitle}>힘쑥쑥 영양제</Text>
          <Text style={styles.adDesc} numberOfLines={1}>피곤한 오늘! 오메가 3로 지치지 않는 힘을...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: wp(15),
    height: wp(60),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backIcon: { fontSize: wp(24), marginRight: wp(12) },
  headerTitle: { fontSize: wp(18), fontWeight: '700', color: '#2f2f2f', flex: 1, textAlign: 'center' },

  /* 컨텐츠 */
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: wp(16), paddingVertical: wp(16) },

  /* 식사 카드 */
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: wp(8),
    padding: wp(16),
    marginBottom: wp(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: wp(3) },
    shadowOpacity: 0.08,
    shadowRadius: wp(6),
    elevation: 3,
  },

  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealTime: { fontSize: wp(12), fontWeight: '700', color: '#777777', marginBottom: wp(4) },
  mealDesc: { fontSize: wp(12), color: '#989898', maxWidth: wp(200) },
  editText: { fontSize: wp(12), color: '#989898' },

  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: wp(8) },

  mealName: { fontSize: wp(12), fontWeight: '700', color: '#2f2f2f', marginBottom: wp(8) },

  calorieRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: wp(8) },
  calorieLabel: { fontSize: wp(12), fontWeight: '700', color: '#000' },
  calorieValue: { fontSize: wp(12), fontWeight: '700', color: '#000' },

  nutritionBar: { height: wp(8), borderRadius: wp(4), marginVertical: wp(8) },

  nutritionDetails: { marginTop: wp(12) },

  nutritionRow: { flexDirection: 'row', marginBottom: wp(8) },
  dotContainer: { marginRight: wp(8), justifyContent: 'center' },
  dot: { width: wp(9), height: wp(9), borderRadius: wp(4.5) },

  nutritionInfo: { flex: 1 },
  nutritionLabel: { fontSize: wp(12), fontWeight: '700', color: '#000', marginBottom: wp(2) },
  nutritionValue: { fontSize: wp(12), fontWeight: '700', color: '#000' },

  /* AD 배너 */
  adBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: wp(10),
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  adBadge: { backgroundColor: '#bde5e2', paddingHorizontal: wp(6), paddingVertical: wp(4), borderRadius: wp(6), marginRight: wp(8) },
  adBadgeText: { fontSize: wp(9), fontWeight: '700', color: '#08504a' },
  adTitle: { fontSize: wp(12), fontWeight: '700', color: '#777777', marginBottom: wp(2) },
  adDesc: { fontSize: wp(12), color: '#989898' },
});

export default MealDetailScreen;
