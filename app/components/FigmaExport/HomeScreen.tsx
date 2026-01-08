import React, { useState, useRef, useEffect } from 'react'; 
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput, Keyboard, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from '../../../utils/scaling';
import ScreenLayout from './ScreenLayout';
import RoutineMenuModal from './RoutineMenuModal';
import * as API from '../../services/api';
import type { Schedule } from '../../services/api';

const HomeScreen = () => {
  const [selectedId, setSelectedId] = useState('me');
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isAddingCommon, setIsAddingCommon] = useState(false);
  const [newScheduleText, setNewScheduleText] = useState('');
  const [newCommonText, setNewCommonText] = useState('');
  const scheduleInputRef = useRef<TextInput>(null);
  const commonInputRef = useRef<TextInput>(null);
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 뒤로가기 버튼을 눌렀을 때 종료 확인 알림
      Alert.alert(
        '앱 종료',
        '앱을 종료하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '종료',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );
      return true; // 이벤트 처리 완료
    });

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 리스너 제거
  }, []);

  const loadSchedules = async () => {
    setIsLoading(true);
    const response = await API.getSchedules();
    if (response.success && response.data) {
      setSchedules(response.data);
    } else {
      Alert.alert('오류', response.error || '일정을 불러오는데 실패했습니다.');
    }
    setIsLoading(false);
  };

  const handleMenuPress = (schedule: Schedule) => {
    console.log('Menu button pressed, opening modal', schedule);
    setSelectedSchedule(schedule);
    setModalVisible(true);
  };

  const handleAddSchedule = () => {
    setIsAddingSchedule(true);
    // 입력창이 렌더링 된 후 포커스 및 스크롤
    setTimeout(() => {
      scheduleInputRef.current?.focus();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleAddCommon = () => {
    setIsAddingCommon(true);
    setTimeout(() => {
      commonInputRef.current?.focus();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleScheduleSubmit = async () => {
    if (newScheduleText.trim()) {
      setIsLoading(true);
      const response = await API.createSchedule(newScheduleText, 'schedule');
      
      if (response.success && response.data) {
        setSchedules([...schedules, response.data]);
        // Alert.alert('성공', '일정이 추가되었습니다.'); // (선택사항) 연속 입력을 위해 알림 제거 가능
        setNewScheduleText('');
        setIsAddingSchedule(false);
        Keyboard.dismiss();
      } else {
        Alert.alert('오류', response.error || '일정 추가에 실패했습니다.');
      }
      setIsLoading(false);
    }
  };

  const handleCommonSubmit = async () => {
    if (newCommonText.trim()) {
      setIsLoading(true);
      const response = await API.createSchedule(newCommonText, 'common');
      
      if (response.success && response.data) {
        setSchedules([...schedules, response.data]);
        // Alert.alert('성공', '공통 일정이 추가되었습니다.');
        setNewCommonText('');
        setIsAddingCommon(false);
        Keyboard.dismiss();
      } else {
        Alert.alert('오류', response.error || '공통 일정 추가에 실패했습니다.');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
    <ScreenLayout selectedId={selectedId} setSelectedId={setSelectedId}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.bodyContent} 
          contentContainerStyle={styles.bodyScrollContent}
          keyboardShouldPersistTaps="handled"
        >
        
        {/* 프로필 카드 & 공지 칩 & 달력 & 챌린지 카드 (기존 코드 유지) */}
        <View style={styles.profileCard}>
          <Image source={require("../../../assets/user_profile.png")} style={styles.profileAvatar} resizeMode="contain" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>이름</Text>
            <Text style={styles.profileDesc}>프로필에 자기소개를 입력해보세요</Text>
          </View>
        </View>

        <View style={styles.noticeChipContainer}>
          <LinearGradient
            colors={["#cff6f2", "#bde5e2", "#8ecfc2"]}
            locations={[0, 0.5, 1]}
            start={{ x: 1, y: 0.85 }}
            end={{ x: 0, y: 0 }}
            style={styles.noticeChipGradient}
          >
            <Text style={styles.noticeEmoji}>🚨</Text>
            <Text style={styles.noticeLabel}>가족 공지</Text>
          </LinearGradient>
          <Text style={styles.noticeContentInline}>금요일에 할아버지 병원 데려다 드리기!!</Text>
        </View>
          
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonth}>2025년 12월       8      7      10</Text>
            <Image source={require("../../../assets/heart.fill.png")} style={{width: wp(12), height: wp(12),position: 'absolute', left: wp(80), top: wp(5)}} resizeMode="contain" />
            <Image source={require("../../../assets/leaf.fill.png")} style={{width: wp(12), height: wp(12),position: 'absolute', left: wp(110), top: wp(5)}} resizeMode="contain" />
            <Image source={require("../../../assets/bolt.fill.png")} style={{width: wp(12), height: wp(12),position: 'absolute', left: wp(140), top: wp(5)}} resizeMode="contain" />
            <View style={styles.calendarNav}>
              <TouchableOpacity><Text style={styles.calendarNavText}>{'❮'}</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.calendarNavText}>{'❯'}</Text></TouchableOpacity>
              <TouchableOpacity><Text style={[styles.calendarNavText, {fontWeight: "bold"}]}>주</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.weekDays}>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
              <View key={day} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, idx >= 5 && {color: idx === 6 ? '#e84444' : '#0088e9'}]}>
                  {day}
                </Text>
                <View style={[styles.dateCell, idx === 3 && styles.dayCircle]}>
                  <Image source={ idx > 3  ? require('../../../assets/Ellipse 106.png') : require('../../../assets/Ellipse 119.png')} style={[styles.dayCircle, idx === 3 && {display: 'none'}]} resizeMode="contain" />
                  <Image source={ idx === 3  ? require('../../../assets/Pokit.png') : null} style={[styles.dayCircle]} resizeMode="contain" />
                  <Image source={idx === 0 ? require("../../../assets/Ellipse 109.png") : null } style={[styles.dayCircle, { position: 'absolute'}]} resizeMode="contain" />
                  <Image source={idx === 1 ? require("../../../assets/Ellipse 111.png") : null } style={[styles.dayCircle, { position: 'absolute'}]} resizeMode="contain" />
                  <Image source={idx === 2 ? require("../../../assets/Ellipse 111.png") : null } style={[styles.dayCircle, { position: 'absolute'}]} resizeMode="contain" />
                  <Text style={[styles.dateNumber, idx === 3 && {position: 'absolute', top: 29, zIndex: 1, color: '#fffefeff', fontWeight: 'bold'}]}>
                    {8 + idx}
                  </Text>
                  <Image source={ idx === 3 ? require('../../../assets/Ellipse 79.png') : null} style={[styles.dayCircle , {position: 'absolute', top: 28.5}]} resizeMode="contain" />
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={() => {}}>
          <LinearGradient
            colors={["#cff6f2", "#bde5e2", "#8ecfc2"]}
            locations={[0, 0.5, 1]}
            start={{ x: 1, y: 0.85 }}
            end={{ x: 0, y: 0 }}
            style={styles.challengeCard}
          >
            <Text style={styles.challengeText}>OO가족님의 챌린지 현황 알아보기</Text>
            <Text style={styles.challengeArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 루틴 섹션 */}
        <View style={styles.routineSection}>
          <View style={styles.routineHeader}>
            <Text style={styles.routineTitle}>이름님 루틴</Text>
          </View>
          <Text style={styles.routineDesc}>평균 00% 루틴을 이행해왔어요. 좀 더 힘내볼까요?</Text>
          
          {/* [루틴] 타입 목록 */}
          {schedules.filter(s => s.type === 'routine').map((schedule) => (
            <View key={schedule.id} style={styles.routineItem}>
              <TouchableOpacity 
                style={styles.checkBox}
                onPress={async () => {
                  setIsLoading(true);
                  const response = await API.toggleComplete(schedule.id, !schedule.completed);
                  if (response.success && response.data) {
                    setSchedules(schedules.map(s => 
                      s.id === schedule.id ? { ...s, completed: response.data!.completed } : s
                    ));
                  }
                  setIsLoading(false);
                }}
              >
                <Image 
                  source={schedule.completed ? require("../../../assets/Ellipse 112.png") : require("../../../assets/Ellipse 106.png")} 
                  style={[styles.checkIconImg, {position: 'absolute'}]} 
                  resizeMode="contain" 
                />
                <Text style={styles.checkIcon}>{schedule.completed ? '✓' : ''}</Text>
              </TouchableOpacity>
              <Text style={styles.itemText}>{schedule.title}</Text>
              <TouchableOpacity onPress={() => handleMenuPress(schedule)} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <Text style={styles.itemMenu}>⋯</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* [일정] 그룹 헤더 */}
          <View style={styles.routineGroup}>
            <TouchableOpacity style={styles.groupBadge} onPress={handleAddSchedule}>
              <Image source={require("../../../assets/sun.max.png")} style={styles.groupIconImg} resizeMode="contain" />
              <TouchableOpacity onPress={handleAddSchedule} style={{position: 'absolute', zIndex: 1, left: wp(57), width: wp(28), height: wp(28), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.groupIcon, {left: wp(-5), zIndex: 1}]}>{'>'}</Text>
                <Image source={require("../../../assets/Ellipse 85.png")} style={[styles.groupIconImg, {left: 0}]} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={styles.groupLabel}>일정</Text>
            </TouchableOpacity>
          </View>

          {/* [일정] 리스트 - 먼저 보여줌 (기존에는 입력창이 위였음) */}
          {schedules.filter(s => s.type === 'schedule').map((schedule) => (
            <View key={schedule.id} style={styles.routineItem}>
              <TouchableOpacity 
                style={[styles.checkBox, styles.checkBoxActive]}
                onPress={async () => {
                  setIsLoading(true);
                  const response = await API.toggleComplete(schedule.id, !schedule.completed);
                  if (response.success && response.data) {
                    setSchedules(schedules.map(s => 
                      s.id === schedule.id ? { ...s, completed: response.data!.completed } : s
                    ));
                  }
                  setIsLoading(false);
                }}
              >
                <Image 
                  source={schedule.completed ? require("../../../assets/Ellipse 112.png") : require("../../../assets/Ellipse 106.png")} 
                  style={[styles.checkIconImg, {position: 'absolute'}]} 
                  resizeMode="contain" 
                />
                <Text style={styles.checkIcon}>{schedule.completed ? '✓' : ''}</Text>
              </TouchableOpacity>
              <Text style={styles.itemText}>{schedule.title}</Text>
              {schedule.isImportant && (
                <Image source={require("../../../assets/Star 4.png")} style={{width: wp(16), height: wp(16), marginRight: wp(4)}} resizeMode="contain" />
              )}
              <TouchableOpacity onPress={() => handleMenuPress(schedule)} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <Text style={styles.itemMenu}>⋯</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* [일정] 입력창 - 리스트 아래로 이동 */}
          {isAddingSchedule && (
            <View style={styles.routineItem}>
              <View style={styles.checkBox}>
                <Image source={require("../../../assets/Ellipse 106.png")} style={[styles.checkIconImg, {position: 'absolute'}]} resizeMode="contain" />
              </View>
              <TextInput
                ref={scheduleInputRef}
                style={styles.inputText}
                placeholder="새 일정을 입력하세요"
                placeholderTextColor="#999999"
                value={newScheduleText}
                onChangeText={setNewScheduleText}
                onSubmitEditing={handleScheduleSubmit}
                onBlur={() => {
                  if (!newScheduleText.trim()) {
                    setIsAddingSchedule(false);
                  }
                }}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleScheduleSubmit} style={styles.addButton}>
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* [공통] 그룹 헤더 */}
          <View style={styles.routineGroup}>
            <TouchableOpacity style={styles.groupBadge} onPress={handleAddCommon}>
              <Image source={require("../../../assets/flame.png")} style={styles.groupIconImg} resizeMode="contain" />
              <TouchableOpacity onPress={handleAddCommon} style={{position: 'absolute', zIndex: 1, left: wp(57), width: wp(28), height: wp(28), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.groupIcon, {left: wp(-5), zIndex: 1}]}>{'>'}</Text>
                <Image source={require("../../../assets/Ellipse 85.png")} style={[styles.groupIconImg, {left: 0}]} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={styles.groupLabel}>공통</Text>
            </TouchableOpacity>
          </View>

          {/* [공통] 리스트 - 먼저 보여줌 */}
          {schedules.filter(s => s.type === 'common').map((schedule) => (
            <View key={schedule.id} style={styles.routineItem}>
              <TouchableOpacity 
                style={styles.checkBox}
                onPress={async () => {
                  setIsLoading(true);
                  const response = await API.toggleComplete(schedule.id, !schedule.completed);
                  if (response.success && response.data) {
                    setSchedules(schedules.map(s => 
                      s.id === schedule.id ? { ...s, completed: response.data!.completed } : s
                    ));
                  }
                  setIsLoading(false);
                }}
              >
                <Image 
                  source={schedule.completed ? require("../../../assets/Ellipse 112.png") : require("../../../assets/Ellipse 106.png")} 
                  style={[styles.checkIconImg, {position: 'absolute'}]} 
                  resizeMode="contain" 
                />
                <Text style={styles.checkIcon}>{schedule.completed ? '✓' : ''}</Text>
              </TouchableOpacity>
              <Text style={styles.itemText}>{schedule.title}</Text>
              <TouchableOpacity onPress={() => handleMenuPress(schedule)} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <Text style={styles.itemMenu}>⋯</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* [공통] 입력창 - 리스트 아래로 이동 */}
          {isAddingCommon && (
            <View style={styles.routineItem}>
              <View style={styles.checkBox}>
                <Image source={require("../../../assets/Ellipse 106.png")} style={[styles.checkIconImg, {position: 'absolute'}]} resizeMode="contain" />
              </View>
              <TextInput
                ref={commonInputRef}
                style={styles.inputText}
                placeholder="새 공통 일정을 입력하세요"
                placeholderTextColor="#999999"
                value={newCommonText}
                onChangeText={setNewCommonText}
                onSubmitEditing={handleCommonSubmit}
                onBlur={() => {
                  if (!newCommonText.trim()) {
                    setIsAddingCommon(false);
                  }
                }}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleCommonSubmit} style={styles.addButton}>
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 하단 광고 배너 */}
      <TouchableOpacity style={styles.bottomBanner} onPress={() => {}}>
        <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>AD</Text></View>
        <Text style={styles.bannerTitle}>힘쑥쑥 영양제</Text>
        <Text style={styles.bannerDesc} numberOfLines={1}>피곤한 오늘! 오메가 3로 지치지 않는 힘을...</Text>
      </TouchableOpacity>

      {/* 하단 탭 바 - HomeScreen에 직접 추가 */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/house.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={[styles.tabText, { color: '#08504a', fontWeight: 'bold' }]}>피드</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/list.bullet.clipboard.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리포트</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/medal.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>리워드</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <Image source={require("../../../assets/person.png")} style={styles.tabIcon} resizeMode="contain" />
          <Text style={styles.tabText}>프로필</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>

    {/* 루틴 메뉴 모달 */}
    <RoutineMenuModal
      visible={modalVisible}
      title={selectedSchedule?.title} // 선택된 제목 표시
      onClose={() => {
        setModalVisible(false);
        setSelectedSchedule(null);
      }}
      onEdit={async () => {
        if (!selectedSchedule) return;
        setModalVisible(false);
        Alert.alert('수정하기', '수정 기능 구현 예정');
        setSelectedSchedule(null);
      }}
      onDelete={async () => {
        if (!selectedSchedule) return;
        setModalVisible(false);
        
        Alert.alert(
          '삭제 확인',
          `'${selectedSchedule.title}' 일정을 삭제하시겠습니까?`,
          [
            { text: '취소', style: 'cancel' },
            {
              text: '삭제',
              style: 'destructive',
              onPress: async () => {
                setIsLoading(true);
                const response = await API.deleteSchedule(selectedSchedule.id);
                if (response.success) {
                  setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
                  Alert.alert('성공', '일정이 삭제되었습니다.');
                } else {
                  Alert.alert('오류', response.error || '삭제 실패');
                }
                setIsLoading(false);
                setSelectedSchedule(null);
              },
            },
          ]
        );
      }}
      onToggleFavorite={async () => {
        if (!selectedSchedule) return;
        setModalVisible(false);
        setIsLoading(true);
        const response = await API.toggleImportant(selectedSchedule.id, !selectedSchedule.isImportant);
        if (response.success && response.data) {
          setSchedules(schedules.map(s => 
            s.id === selectedSchedule.id ? { ...s, isImportant: response.data!.isImportant } : s
          ));
          Alert.alert('성공', response.data.isImportant ? '중요 일정으로 등록되었습니다.' : '중요 일정이 해제되었습니다.');
        } else {
          Alert.alert('오류', '실패');
        }
        setIsLoading(false);
        setSelectedSchedule(null);
      }}
      onToggleNotification={async () => {
        // "루틴 등록하기"
        if (!selectedSchedule) return;
        setModalVisible(false);
        setIsLoading(true);
        const response = await API.toggleRoutine(selectedSchedule.id, !selectedSchedule.isRoutine);
        if (response.success && response.data) {
          const newIsRoutine = response.data.isRoutine!;
          setSchedules(schedules.map(s => 
            s.id === selectedSchedule.id ? { 
              ...s, 
              isRoutine: newIsRoutine,
              // 루틴으로 등록되면 'routine' 섹션으로 이동, 아니면 원래대로(여기선 'schedule'로 가정)
              type: newIsRoutine ? 'routine' : 'schedule' 
            } : s
          ));
          Alert.alert('성공', newIsRoutine ? '루틴으로 등록되었습니다.' : '루틴이 해제되었습니다.');
        } else {
          Alert.alert('오류', '실패');
        }
        setIsLoading(false);
        setSelectedSchedule(null);
      }}
      onAutoComplete={async () => {
        // "가족 공통 일정 등록하기"
        if (!selectedSchedule) return;
        setModalVisible(false);
        setIsLoading(true);
        
        const response = await API.toggleCommon(selectedSchedule.id, !selectedSchedule.isCommon);
        
        if (response.success && response.data) {
          const newIsCommon = response.data.isCommon!;
          // 공통 일정으로 등록되면 type을 'common'으로 변경하여 섹션 이동
          setSchedules(schedules.map(s => 
            s.id === selectedSchedule.id ? { 
                ...s, 
                isCommon: newIsCommon,
                // 공통으로 설정되면 'common' 타입으로, 해제되면 기본 'schedule' 타입으로 복귀
                type: newIsCommon ? 'common' : 'schedule' 
            } : s
          ));
          Alert.alert('성공', newIsCommon ? '가족 공통 일정으로 등록되었습니다.' : '공통 일정이 해제되었습니다.');
        } else {
          Alert.alert('오류', '공통 일정 등록에 실패했습니다.');
        }
        setIsLoading(false);
        setSelectedSchedule(null);
      }}
    />

    
    </>
  );
};

const styles = StyleSheet.create({
  // 스타일 기존과 동일
  bodyContent: { flex: 1 },
  bodyScrollContent: { paddingHorizontal: wp(16), paddingVertical: wp(16) },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: wp(16), backgroundColor: '#f9f9f9', padding: wp(12), borderRadius: wp(12) },
  profileAvatar: { width: wp(56), height: wp(56), borderRadius: wp(28), marginRight: wp(12) },
  profileInfo: { flex: 1 },
  profileName: { fontSize: wp(14), fontWeight: '700', color: '#2f2f2f', marginBottom: wp(4) },
  profileDesc: { fontSize: wp(12), color: '#777777' },
  noticeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3f0', paddingHorizontal: wp(12), paddingVertical: wp(8), borderRadius: wp(8), marginBottom: wp(16), borderWidth: 1, borderColor: '#f0e8e6' },
  noticeChipContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: wp(16), gap: wp(8) },
  noticeChipGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(10), paddingVertical: wp(4), borderRadius: wp(18), width: '27%' },
  noticeContentInline: { fontSize: wp(14), color: '#2f2f2f', flex: 1 },
  noticeEmoji: { fontSize: wp(16), marginRight: wp(6) },
  noticeLabel: { fontSize: wp(13), fontWeight: '700', color: '#08504a', marginRight: wp(6) },
  calendarSection: { marginBottom: wp(16) },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(12) },
  calendarMonth: { fontSize: wp(14), fontWeight: '700', color: '#2f2f2f' },
  calendarNav: { flexDirection: 'row', gap: wp(8) },
  calendarNavText: { fontSize: wp(14), color: '#989898', paddingHorizontal: wp(4) },
  weekDays: { flexDirection: 'row', justifyContent: 'space-between' },
  dayColumn: { width: wp(40), alignItems: 'center' },
  dayLabel: { fontSize: wp(11), fontWeight: '600', color: '#000', marginBottom: wp(4) },
  dateCell: { alignItems: 'center', marginBottom: wp(4) },
  dateCellActive: { paddingHorizontal: wp(8), paddingVertical: wp(4), borderRadius: wp(12) },
  dayCircle: { width: wp(16), height: wp(16) },
  dateNumber: { fontSize: wp(11), fontWeight: '600', color: '#2f2f2f' },
  challengeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(16), paddingVertical: wp(12), borderRadius: wp(14), marginBottom: wp(16), shadowColor: '#000', shadowOffset: { width: 0, height: wp(2) }, shadowOpacity: 0.08, shadowRadius: wp(6), elevation: 3,  },
  challengeText: { fontSize: wp(13), fontWeight: '700', color: '#08504a', flex: 1 },
  challengeArrow: { fontSize: wp(18), color: '#08504a' },
  routineSection: { marginBottom: wp(40) },
  routineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(6) },
  routineTitle: { fontSize: wp(16), fontWeight: '700', color: '#08504a' },
  routineStats: { flexDirection: 'row', gap: wp(6) },
  statIcon: { width: wp(12), height: wp(12) },
  statEmoji: { fontSize: wp(12) },
  routineDesc: { fontSize: wp(12), color: '#777777', marginBottom: wp(12) },
  routineGroup: { flexDirection: 'row', alignItems: 'center', marginVertical: wp(8), paddingVertical: wp(6),  },
  groupBadge: { width: wp(80), height: wp(28), borderRadius: wp(14), backgroundColor: '#bde5e2', alignItems: 'center', justifyContent: 'center', marginRight: wp(8) },
  groupIcon: { fontSize: wp(14) },
  groupIconImg: { width: wp(16), height: wp(16), position: 'absolute', left: wp(6) },
  groupLabel: { fontSize: wp(13), fontWeight: '700', color: '#08504a' },
  routineItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: wp(8), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  checkBox: { width: wp(20), height: wp(20), borderColor: '#ffffffff', alignItems: 'center', justifyContent: 'center', marginRight: wp(12) },
  checkBoxActive: { backgroundColor: '#fbfcfcff' },
  checkIcon: { fontSize: wp(14), position: 'absolute', color: '#ffffff', fontWeight: 'bold' },
  checkIconImg: { width: wp(18), height: wp(18) },
  itemText: { fontSize: wp(13), color: '#08504a', flex: 1 },
  itemMenu: { fontSize: wp(12), color: '#999999' },
  inputText: { fontSize: wp(13), color: '#08504a', flex: 1, padding: 0, margin: 0 },
  addButton: { backgroundColor: '#BDE5E2', paddingHorizontal: wp(12), paddingVertical: wp(6), borderRadius: wp(8) },
  addButtonText: { fontSize: wp(12), color: '#08504a', fontWeight: '700' },
  bottomBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(20), paddingVertical: wp(10), backgroundColor: '#f9f9f9' },
  bannerBadge: { backgroundColor: '#bde5e2', paddingHorizontal: wp(5), paddingVertical: wp(2), borderRadius: wp(4), marginRight: wp(8) },
  bannerBadgeText: { fontSize: wp(9), color: '#08504a', fontWeight: '700' },
  bannerTitle: { fontSize: wp(12), fontWeight: '700', color: '#333', marginRight: wp(5) },
  bannerDesc: { fontSize: wp(12), color: '#989898', flex: 1 },
  bottomTab: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: wp(10), paddingBottom: wp(60), borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { width: wp(24), height: wp(24), marginBottom: wp(4) },
  tabText: { fontSize: wp(10), color: '#999', fontFamily: 'SUIT' },
});

export default HomeScreen;