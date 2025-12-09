import notifee, { TriggerType, RepeatFrequency, AndroidImportance } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  private channelId = 'pill-routine-channel';

  async initialize() {
    // Android 알림 채널 생성
    await notifee.createChannel({
      id: this.channelId,
      name: '복약 루틴 알림',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });

    // Android 13+ 알림 권한 요청
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await this.requestNotificationPermission();
    }
  }

  async requestNotificationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  }

  // 루틴 알림 스케줄링
  async scheduleRoutineNotifications(
    routineId: string,
    routineName: string,
    alarmTimes: string[], // ['09:00', '13:00', '18:00']
    selectedDays: {
      mon: boolean;
      tue: boolean;
      wed: boolean;
      thu: boolean;
      fri: boolean;
      sat: boolean;
      sun: boolean;
    },
    startDate: Date,
    endDate: Date
  ) {
    try {
      // 각 알림 시간마다 스케줄 생성
      for (let i = 0; i < alarmTimes.length; i++) {
        const timeString = alarmTimes[i];
        const [hours, minutes] = timeString.split(':').map(Number);

        // 요일 필터 생성 (0=일요일, 1=월요일, ...)
        const daysOfWeek = [];
        if (selectedDays.sun) daysOfWeek.push(0);
        if (selectedDays.mon) daysOfWeek.push(1);
        if (selectedDays.tue) daysOfWeek.push(2);
        if (selectedDays.wed) daysOfWeek.push(3);
        if (selectedDays.thu) daysOfWeek.push(4);
        if (selectedDays.fri) daysOfWeek.push(5);
        if (selectedDays.sat) daysOfWeek.push(6);

        // 첫 알림 시간 계산
        const trigger = new Date(startDate);
        trigger.setHours(hours, minutes, 0, 0);

        // 이미 지난 시간이면 다음날로
        if (trigger.getTime() < Date.now()) {
          trigger.setDate(trigger.getDate() + 1);
        }

        // 매일 반복이면 반복 설정, 아니면 개별 요일마다 알림 생성
        if (daysOfWeek.length === 7) {
          // 매일 반복
          await notifee.createTriggerNotification(
            {
              id: `${routineId}-${i}`,
              title: '💊 복약 시간입니다',
              body: `${routineName} 복용 시간이에요!`,
              android: {
                channelId: this.channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                  id: 'default',
                },
                smallIcon: 'ic_launcher',
                sound: 'default',
                vibrationPattern: [300, 500, 300, 500],
              },
            },
            {
              type: TriggerType.TIMESTAMP,
              timestamp: trigger.getTime(),
              repeatFrequency: RepeatFrequency.DAILY,
            }
          );
        } else {
          // 특정 요일만 반복 - 각 요일마다 일주일 간격으로 반복
          for (const dayOfWeek of daysOfWeek) {
            const dayTrigger = new Date(trigger);
            
            // 다음 해당 요일 찾기
            while (dayTrigger.getDay() !== dayOfWeek) {
              dayTrigger.setDate(dayTrigger.getDate() + 1);
            }

            await notifee.createTriggerNotification(
              {
                id: `${routineId}-${i}-day${dayOfWeek}`,
                title: '💊 복약 시간입니다',
                body: `${routineName} 복용 시간이에요!`,
                android: {
                  channelId: this.channelId,
                  importance: AndroidImportance.HIGH,
                  pressAction: {
                    id: 'default',
                  },
                  smallIcon: 'ic_launcher',
                  sound: 'default',
                  vibrationPattern: [300, 500, 300, 500],
                },
              },
              {
                type: TriggerType.TIMESTAMP,
                timestamp: dayTrigger.getTime(),
                repeatFrequency: RepeatFrequency.WEEKLY,
              }
            );
          }
        }
      }

      console.log(`루틴 "${routineName}"의 알림이 등록되었습니다. (${alarmTimes.length}개)`);
      return true;
    } catch (error) {
      console.error('알림 스케줄링 실패:', error);
      return false;
    }
  }

  // 루틴 알림 취소
  async cancelRoutineNotifications(routineId: string, alarmCount: number) {
    try {
      for (let i = 0; i < alarmCount; i++) {
        await notifee.cancelNotification(`${routineId}-${i}`);
      }
      console.log(`루틴 알림이 취소되었습니다. (ID: ${routineId})`);
    } catch (error) {
      console.error('알림 취소 실패:', error);
    }
  }

  // 모든 알림 취소
  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
      console.log('모든 알림이 취소되었습니다.');
    } catch (error) {
      console.error('전체 알림 취소 실패:', error);
    }
  }

  // 등록된 알림 목록 확인
  async getScheduledNotifications() {
    try {
      const notifications = await notifee.getTriggerNotifications();
      console.log('예약된 알림:', notifications);
      return notifications;
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      return [];
    }
  }

  // 즉시 테스트 알림 표시
  async displayTestNotification(routineName: string) {
    try {
      await notifee.displayNotification({
        title: '💊 복약 시간입니다',
        body: `${routineName} 복용 시간이에요!`,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          sound: 'default',
        },
      });
      return true;
    } catch (error) {
      console.error('테스트 알림 표시 실패:', error);
      return false;
    }
  }
}

export default new NotificationService();
