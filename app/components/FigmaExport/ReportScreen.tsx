import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from './ScreenLayout';

const ReportScreen = () => {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState('me');

  return (
    <ScreenLayout selectedId={selected} setSelectedId={setSelected}>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>오늘의 식사</Text>
            <Text style={styles.cardMore}>›</Text>
          </View>
          <View style={styles.mealList}>
            <Text style={styles.mealText}>아침: 샌드위치</Text>
            <Text style={styles.mealText}>점심: 김치볶음밥</Text>
            <Text style={styles.mealText}>저녁: 치킨</Text>
            <Text style={styles.mealText}>야식:</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: wp(10) }}>
            <LinearGradient colors={[ '#cff6f2', '#bde5e2' ]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.mealButton}> 
              <TouchableOpacity style={styles.mealButtonInner} activeOpacity={0.9} onPress={() => navigation.navigate('MealDetail')}>
                <Text style={styles.mealButtonText}>식사 기록하기</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>혈당 기록</Text>
            <Text style={styles.cardMore}>›</Text>
          </View>
          <View style={styles.chartBox}><Text style={styles.chartPlaceholder}>차트가 여기 들어갑니다</Text></View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>체중 기록</Text>
            <Text style={styles.cardMore}>›</Text>
          </View>
          <View style={{paddingVertical: wp(8)}}>
            <Text style={styles.subText}>현재 체중: 50Kg</Text>
            <Text style={styles.subText}>목표 체중: 45Kg</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: wp(8) }}>
            <LinearGradient colors={[ '#5cc5bc', '#3e9f97' ]} style={styles.smallAction} start={{x:0, y:0}} end={{x:1, y:0}}>
              <TouchableOpacity>
                <Text style={styles.smallActionText}>식사 기록하기</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: wp(16), paddingBottom: wp(16) },

  card: { backgroundColor: '#fff', borderRadius: wp(8), padding: wp(12), marginTop: wp(12), shadowColor: '#000', shadowOffset: { width: 0, height: wp(3) }, shadowOpacity: 0.08, shadowRadius: wp(6), elevation: 3 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(8) },
  cardTitle: { fontSize: wp(14), fontWeight: '700', color: '#2f2f2f' },
  cardMore: { fontSize: wp(18), color: '#989898' },

  mealList: { paddingVertical: wp(4) },
  mealText: { fontSize: wp(12), color: '#2f2f2f', marginBottom: wp(6) },
  mealButton: { width: wp(280), borderRadius: wp(22), paddingHorizontal: wp(10), paddingVertical: wp(6) },
  mealButtonInner: { paddingHorizontal: wp(24), paddingVertical: wp(8), alignItems: 'center' },
  mealButtonText: { fontSize: wp(14), color: '#08504a', fontWeight: '700' },

  chartBox: { height: wp(160), borderRadius: wp(12), borderWidth: 1, borderColor: '#e6f0ef', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fbfffe' },
  chartPlaceholder: { color: '#9aa', fontSize: wp(12) },

  subText: { fontSize: wp(12), color: '#777777' },
  smallAction: { width: wp(303), borderRadius: wp(22), paddingVertical: wp(8), alignItems: 'center', justifyContent: 'center', marginTop: wp(8) },
  smallActionText: { color: '#fff', fontWeight: '700' },
});

export default ReportScreen;