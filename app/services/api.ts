import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.123.100:8088/api' 

// 일정/루틴 타입 정의
export interface Schedule {
  id: string; 
  title: string;
  type: 'schedule' | 'routine' | 'common';
  completed: boolean;
  isImportant?: boolean;
  isRoutine?: boolean;
  isCommon?: boolean;
  pillName?: string;
  time?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ChatResponse {
  response?: string;
  itemName?: string;
  efcyQesitm?: string;
  useMethodQesitm?: string;
  atpnWarnQesitm?: string;
}

export interface PillInfo {
  itemName: string;
  efcyQesitm: string;
  useMethodQesitm: string;
  atpnWarnQesitm: string;
  imageUrl?: string;
}

export interface RoutineRequest {
  title: string;
  pillNames: string[];
  isGrouped: boolean;
  frequencyHours: number; // 몇 시간 간격 (백엔드 로직상 필요)
  durationDays: number;   // 며칠 동안 (백엔드 로직상 필요)
  startDate: string;      // YYYY-MM-DD
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface PillDto {
  itemName: string;
  efcyQesitm: string;
  useMethodQesitm: string;
  atpnWarnQesitm: string;
  itemImage?: string;
}


// ==================== 일정 관리 API ====================

export const createSchedule = async (
  title: string,
  type: 'schedule' | 'routine' | 'common' = 'schedule'
): Promise<ApiResponse<Schedule>> => {
  try {
    // [수정] 타입에 따라 다른 API 주소 사용
    let url = `${BASE_URL}/alarm/create`; // 기본: 루틴(알람 포함)
    let body: any = {};

    if (type === 'routine') {
      // 1. 루틴(알람 O)인 경우 기존 로직 유지
      const today = new Date().toISOString().split('T')[0];
      url = `${BASE_URL}/alarm/create`;
      body = {
        title: title,
        pillNames: [title],
        isGrouped: true,
        frequencyHours: 24,
        durationDays: 365,
        startDate: today,
        mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true
      };
    } else {
      // 2. 일반 일정/공통 일정(알람 X)인 경우 -> 새로 만든 API 사용
      url = `${BASE_URL}/alarm/schedule`;
      body = {
        title: title,
        type: type
      };
    }

    console.log(`Sending request to ${url}`, body); // 프론트 로그 확인

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Error:', errorText);
      throw new Error('서버 응답 오류');
    }

    return {
      success: true,
      data: {
        id: Date.now().toString(), // 임시 ID
        title,
        type,
        completed: false,
      },
    };
  } catch (error) {
    console.error('일정 추가 실패:', error);
    return { success: false, error: '일정 추가에 실패했습니다.' };
  }
};

export const getSchedules = async (): Promise<ApiResponse<Schedule[]>> => {
  try {
    const response = await fetch(`${BASE_URL}/alarm/list`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 백엔드 데이터(RoutineDto)를 프론트엔드 포맷(Schedule)으로 변환
    const schedules: Schedule[] = data.map((item: any) => ({
      id: item.prescriptionId.toString(),
      title: item.title,
      type: item.type || 'routine', 
      completed: false,
      pillName: item.pillName,
      time: item.time,
    }));

    return {
      success: true,
      data: schedules,
    };
  } catch (error) {
    console.error('일정 조회 실패:', error);
    return {
      success: false,
      error: '서버 연결에 실패했습니다.',
    };
  }
};

export const updateSchedule = async (
  id: string,
  updates: Partial<Schedule>
): Promise<ApiResponse<Schedule>> => {
  try {
    // 백엔드 RoutineDto 형식에 맞춰 데이터 변환
    const body = {
      title: updates.title,
      // 필요한 다른 필드들도 여기에 추가
    };

    const response = await fetch(`${BASE_URL}/alarm/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('수정 실패');

    return {
      success: true,
      data: { id, ...updates } as Schedule,
    };
  } catch (error) {
    return {
      success: false,
      error: '수정에 실패했습니다.',
    };
  }
};

export const deleteSchedule = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${BASE_URL}/alarm/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('삭제 실패');
    }

    return {
      success: true,
      message: '삭제되었습니다.',
    };
  } catch (error) {
    console.error('일정 삭제 실패:', error);
    return {
      success: false,
      error: '일정 삭제에 실패했습니다.',
    };
  }
};

const changeScheduleType = async (id: string, newType: string): Promise<ApiResponse<Schedule>> => {
  try {
    // updateRoutine (PUT) API 활용
    const response = await fetch(`${BASE_URL}/alarm/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newType }), // 타입만 변경 요청
    });

    if (!response.ok) throw new Error('타입 변경 실패');

    // 성공 시 변경된 타입이 적용된 가짜 객체 반환 (UI 즉시 반영용)
    return {
      success: true,
      data: { id, type: newType } as any, // 부분 업데이트
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: '변경 실패' };
  }
};

export const toggleComplete = async (id: string, completed: boolean) => {
    return { success: true, data: { id, title: '', type: 'routine', completed } };
};
export const toggleImportant = async (id: string, val: boolean) => { return { success: true, data: { isImportant: val } }; };

export const toggleRoutine = async (id: string, isRoutine: boolean): Promise<ApiResponse<Schedule>> => {
    const newType = isRoutine ? 'routine' : 'schedule';
    const result = await changeScheduleType(id, newType);
    
    if(result.success && result.data) {
        result.data.isRoutine = isRoutine;
    }
    return result;
};
export const toggleCommon = async (id: string, isCommon: boolean): Promise<ApiResponse<Schedule>> => {
    // true면 'common', false면 다시 'schedule'로 복귀
    const newType = isCommon ? 'common' : 'schedule';
    const result = await changeScheduleType(id, newType);
    
    // UI 호환을 위해 데이터 포맷 맞춤
    if(result.success && result.data) {
        result.data.isCommon = isCommon;
    }
    return result;
};

// ==================== AI 챗 API ====================

export const searchPillByDescription = async (message: string): Promise<ApiResponse<ChatResponse>> => {
  try {
    const response = await fetch(`${BASE_URL}/pill/search-by-description?q=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('알약 검색 실패');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: '알약 정보를 찾는데 실패했습니다.' };
  }
};

// 2. [신규] 운동 상담 API (나중에 백엔드 연결)
export const getExerciseAdvice = async (message: string): Promise<ApiResponse<ChatResponse>> => {
  // TODO: 백엔드 API 생성 후 fetch로 변경 (예: GET /api/health/exercise?q=...)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { response: `"${message}"에 대한 운동 방법을 찾아보겠습니다.\n(백엔드 로직 연결 필요)` }
      });
    }, 1000);
  });
};

// 3. [신규] 영양제 상담 API
export const getSupplementAdvice = async (message: string): Promise<ApiResponse<ChatResponse>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { response: `"${message}"에 맞는 영양제를 분석 중입니다.\n(백엔드 로직 연결 필요)` }
      });
    }, 1000);
  });
};

// 4. [신규] 건강검진 상담 API
export const getCheckupAdvice = async (message: string): Promise<ApiResponse<ChatResponse>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { response: `"${message}"에 대한 검진 결과를 해석해 드릴게요.\n(백엔드 로직 연결 필요)` }
      });
    }, 1000);
  });
};

// 5. [신규] 일반 대화 API
export const sendGeneralMessage = async (message: string): Promise<ApiResponse<ChatResponse>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { response: "죄송합니다. 아직 학습 중인 내용입니다." }
      });
    }, 1000);
  });
};

// ==================== 약 검색 및 등록 API ====================

export const searchPills = async (message: string): Promise<ApiResponse<PillInfo>> => {
  try {
    const response = await fetch(`${BASE_URL}/pill/search?name=${encodeURIComponent(message)}`, {
      
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('알약 검색 실패');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: '알약 정보를 찾는데 실패했습니다.' };
  }
};

export const createRoutine = async (data: RoutineRequest): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_URL}/alarm/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '루틴 등록 실패');
    }

    return {
      success: true,
      message: '루틴이 성공적으로 등록되었습니다.',
    };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: '루틴 등록 중 오류가 발생했습니다.' };
  }
};

export const analyzePillImage = async (imageUri: string): Promise<ApiResponse<PillDto[]>> => {
  try {
    const formData = new FormData();

    const fileName = imageUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // React Native FormData 형식
    const file = {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: fileName,
      type: type,
    };

    formData.append('image', file as any);

    console.log('Uploading image:', fileName);

    const response = await fetch(`${BASE_URL}/pill/analyze-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '이미지 분석 실패');
    }

    const data = await response.json(); // List<PillDto> 반환됨
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: '이미지 분석 중 오류가 발생했습니다.',
    };
  }
};
