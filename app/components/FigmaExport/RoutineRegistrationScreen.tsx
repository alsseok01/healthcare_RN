import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Image, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import * as API from '../../services/api';
import NotificationService from '../../services/notificationService';

const WEEKDAYS = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
];

const RoutineRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const pillName = route.params?.pillName || '복용약';
  const remainingPills = route.params?.remainingPills || [];
  const isSequentialRegistration = route.params?.isSequentialRegistration || false;
  
  const [routineName, setRoutineName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  
  // 기본 알림 시간을 8시로 설정
  const getDefaultAlarmTime = () => {
    const defaultTime = new Date();
    defaultTime.setHours(8, 0, 0, 0);
    return defaultTime;
  };
  
  const [alarmTimes, setAlarmTimes] = useState<Date[]>([getDefaultAlarmTime()]);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true
  });
  const [autoRegister, setAutoRegister] = useState(true);

  // 알림 서비스 초기화
  useEffect(() => {
    NotificationService.initialize();
  }, []);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatDisplayDate = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const formatTime = (date: Date) => date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const getRepeatLabel = useMemo(() => {
    const days = Object.values(selectedDays);
    const trueCount = days.filter(v => v).length;
    if (trueCount === 7) return '매일';
    if (trueCount === 0) return '반복 없음';
    if (selectedDays.mon && selectedDays.tue && selectedDays.wed && selectedDays.thu && selectedDays.fri && !selectedDays.sat && !selectedDays.sun) return '평일';
    if (!selectedDays.mon && !selectedDays.tue && !selectedDays.wed && !selectedDays.thu && !selectedDays.fri && selectedDays.sat && selectedDays.sun) return '주말';
    return WEEKDAYS.filter(d => selectedDays[d.key as keyof typeof selectedDays]).map(d => d.label).join(', ');
  }, [selectedDays]);

  const toggleDay = (key: string) => {
    setSelectedDays(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const changeFrequency = (count: number) => {
    if (count < 1 || count > 10) return;
    
    // 기본 시간 설정 (8시, 13시, 18시 순서)
    const defaultHours = [8, 13, 18, 22, 10, 15, 20, 7, 12, 16];
    
    const newTimes = Array(count).fill(null).map((_, index) => {
      if (index < alarmTimes.length) return alarmTimes[index];
      
      // 새로운 알림 시간 생성
      const newTime = new Date();
      newTime.setHours(defaultHours[index] || 9, 0, 0, 0);
      return newTime;
    });
    setAlarmTimes(newTimes);
    setShowFrequencyModal(false);
  };

  const updateAlarmTime = (index: number, time: Date) => {
    const newTimes = [...alarmTimes];
    newTimes[index] = time;
    setAlarmTimes(newTimes);
  };

  const addAlarmTime = () => {
    // 기본 시간 설정 (8시, 13시, 18시 순서로 추가)
    const defaultHours = [8, 13, 18, 22, 10, 15, 20, 7, 12, 16];
    const currentIndex = alarmTimes.length;
    
    const newTime = new Date();
    newTime.setHours(defaultHours[currentIndex] || 9, 0, 0, 0);
    setAlarmTimes([...alarmTimes, newTime]);
  };

  const removeAlarmTime = (index: number) => {
    if (alarmTimes.length <= 1) {
      Alert.alert('알림', '최소 1개의 알림 시간은 필요합니다.');
      return;
    }
    setAlarmTimes(alarmTimes.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!routineName.trim()) {
      Alert.alert('알림', '루틴 이름을 입력해주세요.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('오류', '종료 날짜는 시작 날짜보다 늦어야 합니다.');
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    const requestData = {
      title: routineName,
      pillNames: [routineName],
      isGrouped: true,
      frequencyHours: Math.floor(24 / alarmTimes.length),
      durationDays: durationDays > 0 ? durationDays : 1,
      startDate: formatDate(startDate),
      alarmTimes: alarmTimes.map(time => formatTime(time)),
      ...selectedDays
    };

    try {
      const response = await API.createRoutine(requestData);
      if (response.success) {
        // 루틴 ID 생성 (실제로는 백엔드에서 받아와야 함)
        const routineId = `routine-${Date.now()}`;
        
        // 알림 스케줄링
        const notificationScheduled = await NotificationService.scheduleRoutineNotifications(
          routineId,
          routineName,
          alarmTimes.map(time => formatTime(time)),
          selectedDays,
          startDate,
          endDate
        );

        if (notificationScheduled) {
          console.log('알림이 성공적으로 등록되었습니다.');
        }

        if (isSequentialRegistration && remainingPills.length > 0) {
          Alert.alert('성공', `${routineName} 루틴과 알림이 등록되었습니다.\n\n남은 약: ${remainingPills.length}개`, [
            {
              text: '다음 약 등록',
              onPress: () => {
                const [nextPill, ...rest] = remainingPills;
                navigation.replace('RoutineRegistration', {
                  pillName: nextPill,
                  remainingPills: rest,
                  isSequentialRegistration: true
                });
              }
            },
            { text: '등록 완료', onPress: () => navigation.navigate('Home') }
          ]);
        } else {
          const message = isSequentialRegistration ? '모든 루틴과 알림이 등록되었습니다.' : '루틴과 알림이 등록되었습니다.';
          Alert.alert('성공', message, [{ text: '확인', onPress: () => navigation.navigate('Home') }]);
        }
      } else {
        Alert.alert('오류', response.error || '루틴 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>루틴 기록하기</Text>
        <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
          <Text style={styles.completeText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.pillNameContainer}>
          <Image source={require("../../../assets/clock1.png")} style={{width: wp(20), height: wp(20), marginRight: wp(8)}} resizeMode="contain" />
          <TextInput
            style={styles.routineNameInput}
            placeholder="루틴 이름을 입력하세요"
            placeholderTextColor="#999"
            value={routineName}
            onChangeText={setRoutineName}
            returnKeyType="done"
          />
        </View>
        <View style={styles.divider} />

        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{pillName}</Text>
            {isSequentialRegistration && remainingPills.length > 0 && (
              <Text style={styles.remainingCount}>남은 약: {remainingPills.length}개</Text>
            )}
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.settingLabel}>시작 날짜</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{formatDisplayDate(startDate)}</Text>
              <Text style={styles.chevronIcon}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.settingLabel}>종료 날짜</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{formatDisplayDate(endDate)}</Text>
              <Text style={styles.chevronIcon}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowDayModal(true)}>
            <Text style={styles.settingLabel}>반복</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{getRepeatLabel}</Text>
              <Text style={styles.chevronIcon}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowFrequencyModal(true)}>
            <Text style={styles.settingLabel}>하루 복용 횟수</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{alarmTimes.length}번</Text>
              <Text style={styles.chevronIcon}>{'>'}</Text>
            </View>
          </TouchableOpacity>
          
          
          {alarmTimes.map((time, index) => (
            <View key={index} style={styles.timeItemRow}>
              <TouchableOpacity style={styles.timeItem} onPress={() => setShowTimePickerIndex(index)}>
                <Text style={styles.settingLabel}>알림 {index + 1}</Text>
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>{formatTime(time)}</Text>
                  <Text style={styles.chevronIcon}>{'>'}</Text>
                </View>
              </TouchableOpacity>
              {alarmTimes.length > 1 && (
                <TouchableOpacity style={styles.deleteTimeButton} onPress={() => removeAlarmTime(index)}>
                  <Text style={styles.deleteTimeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {alarmTimes.length < 10 && (
            <TouchableOpacity style={styles.addTimeButton} onPress={addAlarmTime}>
              <Text style={styles.addTimeText}>+ 알림 시간 추가</Text>
            </TouchableOpacity>
          )}

          <View style={styles.toggleItem}>
            <Text style={styles.settingLabel}>자동으로 루틴 일정 등록</Text>
            <Switch
              value={autoRegister}
              onValueChange={setAutoRegister}
              trackColor={{ false: '#eeeeee', true: '#BDE5E2' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>

      <DatePicker modal open={showStartPicker} date={startDate} mode="date" title="시작 날짜 선택" confirmText="확인" cancelText="취소"
        onConfirm={(date) => { setShowStartPicker(false); setStartDate(date); }} onCancel={() => setShowStartPicker(false)} />

      <DatePicker modal open={showEndPicker} date={endDate} mode="date" title="종료 날짜 선택" confirmText="확인" cancelText="취소" minimumDate={startDate}
        onConfirm={(date) => { setShowEndPicker(false); setEndDate(date); }} onCancel={() => setShowEndPicker(false)} />

      {showTimePickerIndex !== null && (
        <DatePicker modal open={true} date={alarmTimes[showTimePickerIndex]} mode="time" title={`알림 ${showTimePickerIndex + 1} 시간 선택`}
          confirmText="확인" cancelText="취소" onConfirm={(date) => { updateAlarmTime(showTimePickerIndex, date); setShowTimePickerIndex(null); }}
          onCancel={() => setShowTimePickerIndex(null)} />
      )}

      <Modal visible={showDayModal} transparent={true} animationType="fade" onRequestClose={() => setShowDayModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>반복 요일 선택</Text>
            <View style={styles.dayGrid}>
              {WEEKDAYS.map((day) => (
                <TouchableOpacity key={day.key} style={[styles.dayButton, selectedDays[day.key as keyof typeof selectedDays] && styles.dayButtonActive]}
                  onPress={() => toggleDay(day.key)}>
                  <Text style={[styles.dayText, selectedDays[day.key as keyof typeof selectedDays] && styles.dayTextActive]}>{day.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalConfirmButton} onPress={() => setShowDayModal(false)}>
              <Text style={styles.modalConfirmText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFrequencyModal} transparent={true} animationType="fade" onRequestClose={() => setShowFrequencyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>하루 복용 횟수</Text>
            <ScrollView style={styles.frequencyList}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                <TouchableOpacity key={count} style={[styles.frequencyItem, alarmTimes.length === count && styles.frequencyItemActive]}
                  onPress={() => changeFrequency(count)}>
                  <Text style={[styles.frequencyText, alarmTimes.length === count && styles.frequencyTextActive]}>{count}번</Text>
                  {alarmTimes.length === count && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalConfirmButton} onPress={() => setShowFrequencyModal(false)}>
              <Text style={styles.modalConfirmText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(16), paddingVertical: wp(12), height: wp(60) },
  backButton: { width: wp(40), height: wp(40), justifyContent: 'center', alignItems: 'flex-start' },
  backIcon: { fontSize: wp(20), color: '#989898', fontWeight: 'bold' },
  headerTitle: { fontSize: wp(20), fontWeight: '700', color: '#2f2f2f', position: 'absolute', left: '50%', transform: [{ translateX: -56 }] },
  completeButton: { paddingHorizontal: wp(8) },
  completeText: { fontSize: wp(14), fontWeight: '700', color: '#08504a' },
  content: { flex: 1 },
  pillNameContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(28), paddingVertical: wp(20) },
  routineNameInput: { flex: 1, fontSize: wp(14), fontWeight: '700', color: '#08504a', padding: 0 },
  divider: { height: wp(2), backgroundColor: '#eeeeee', marginHorizontal: wp(28), marginBottom: wp(20) },
  settingsContainer: { paddingHorizontal: wp(28) },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: wp(15), paddingHorizontal: wp(16), height: wp(60), marginBottom: wp(12) },
  settingLabel: { fontSize: wp(14), fontWeight: '700', color: '#2f2f2f' },
  remainingCount: { fontSize: wp(12), fontWeight: '600', color: '#3e9f97', marginLeft: wp(8) },
  settingValueContainer: { flexDirection: 'row', alignItems: 'center' },
  settingValue: { fontSize: wp(14), fontWeight: '700', color: '#08504a', marginRight: wp(8) },
  chevronIcon: { fontSize: wp(20), color: '#989898' },
  toggleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: wp(15), paddingHorizontal: wp(16), height: wp(49), marginBottom: wp(12) },
  timeItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: wp(12) },
  timeItem: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: wp(15), paddingHorizontal: wp(16), height: wp(60) },
  deleteTimeButton: { width: wp(36), height: wp(36), justifyContent: 'center', alignItems: 'center', marginLeft: wp(8), backgroundColor: '#ff6b6b', borderRadius: wp(18) },
  deleteTimeText: { color: '#fff', fontSize: wp(18), fontWeight: 'bold' },
  addTimeButton: { backgroundColor: '#BDE5E2', borderRadius: wp(15), paddingHorizontal: wp(16), height: wp(50), justifyContent: 'center', alignItems: 'center', marginBottom: wp(12), borderWidth: wp(2), borderColor: '#3e9f97', borderStyle: 'dashed' },
  addTimeText: { fontSize: wp(14), fontWeight: '700', color: '#08504a' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: wp(20), padding: wp(24), width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: wp(18), fontWeight: '700', color: '#2f2f2f', marginBottom: wp(20) },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: wp(8), marginBottom: wp(24) },
  dayButton: { width: wp(40), height: wp(40), borderRadius: wp(20), backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  dayButtonActive: { backgroundColor: '#BDE5E2' },
  dayText: { fontSize: wp(14), color: '#999' },
  dayTextActive: { color: '#08504a', fontWeight: 'bold' },
  modalConfirmButton: { backgroundColor: '#08504a', paddingHorizontal: wp(32), paddingVertical: wp(12), borderRadius: wp(10) },
  modalConfirmText: { color: '#fff', fontSize: wp(14), fontWeight: '700' },
  frequencyList: { maxHeight: wp(300), width: '100%' },
  frequencyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: wp(16), paddingHorizontal: wp(20), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  frequencyItemActive: { backgroundColor: 'rgba(189, 229, 226, 0.3)' },
  frequencyText: { fontSize: wp(16), color: '#2f2f2f', fontWeight: '600' },
  frequencyTextActive: { color: '#08504a', fontWeight: '700' },
  checkIcon: { fontSize: wp(18), color: '#3e9f97', fontWeight: 'bold' },
});

export default RoutineRegistrationScreen;
