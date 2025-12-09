import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import * as API from '../../services/api';

const PillSearchScreen = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState<'recent' | 'result'>('recent');
  const [isLoading, setIsLoading] = useState(false);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query?: string) => {
    const targetText = typeof query === 'string' ? query : searchText;

    if (!targetText.trim()) return;

    Keyboard.dismiss();
    setIsLoading(true);
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== targetText);
      return [targetText, ...filtered].slice(0, 10);
    });

    if (targetText !== searchText) {
        setSearchText(targetText);
    }

    setSelectedTab('result');

    try {
      const response = await API.searchPills(targetText);

      if (response.success && response.data) {
        const data = response.data;
        // itemName이 있으면 결과가 있는 것으로 간주
        if (data.itemName) {
            setSearchResults([data]);
        } else {
            setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '검색 중 문제가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeRecentSearch = (target: string) => {
    setRecentSearches(prev => prev.filter(item => item !== target));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
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

      {/* 검색 입력 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="약 이름을 입력하세요 (예: 타이레놀)"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); setSelectedTab('recent'); }} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setSelectedTab('recent')}
        >
          <Text style={[styles.tabText, selectedTab === 'recent' && styles.tabTextActive]}>최근 검색</Text>
          {selectedTab === 'recent' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setSelectedTab('result')}
        >
          <Text style={[styles.tabText, selectedTab === 'result' && styles.tabTextActive]}>검색 결과</Text>
          {selectedTab === 'result' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* 리스트 영역 */}
      <ScrollView style={styles.listContainer} contentContainerStyle={{paddingBottom: 20}}>
        
        {isLoading && (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#08504a" />
          </View>
        )}

        {/* 1. 최근 검색어 탭 */}
        {!isLoading && selectedTab === 'recent' && (
          <>
            {recentSearches.length > 0 ? (
                <>
                 <View style={{flexDirection:'row', justifyContent:'flex-end', paddingHorizontal: wp(16), paddingTop:wp(10)}}>
                    <TouchableOpacity onPress={clearRecentSearches}>
                        <Text style={{color:'#999', fontSize:wp(12)}}>전체 삭제</Text>
                    </TouchableOpacity>
                 </View>
                 {recentSearches.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.listItem}
                        onPress={() => handleSearch(item)}
                    >
                        <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                            <Text style={styles.clockIcon}>🕐</Text>
                            <Text style={styles.listItemText}>{item}</Text>
                        </View>
                        <TouchableOpacity onPress={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(item);
                        }} style={{padding:5}}>
                            <Text style={{color:'#ccc'}}>✕</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                 ))}
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptySubText}>최근 검색 내역이 없습니다.</Text>
                </View>
            )}
          </>
        )}

        {/* 2. 검색 결과 탭 */}
        {!isLoading && selectedTab === 'result' && (
            searchResults.length > 0 ? (
                searchResults.map((pill, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.resultCard}
                      onPress={() => navigation.navigate('PillDetail', { pillData: pill })}
                    >
                        <View style={styles.routineButtonContainer}>
                          <TouchableOpacity 
                            style={styles.routineButton} 
                            onPress={(e) => {
                              e.stopPropagation();
                              navigation.navigate('RoutineRegistration', { pillName: pill.itemName });
                            }}
                          >
                            <Image 
                              source={require("../../../assets/clock1.png")} 
                              style={styles.clockImage} 
                              resizeMode="contain" 
                            />
                            <Text style={styles.routineButtonText}>루틴 등록하기</Text>
                          </TouchableOpacity>
                        </View>
                        {/* 약 이미지 표시 */}
                        {pill.itemImage ? (
                          <View style={styles.imageContainer}>
                            <Image 
                              source={{ uri: pill.itemImage }} 
                              style={styles.pillImage} 
                              resizeMode="contain" 
                            />
                          </View>
                        ) : null}

                        <View style={styles.resultHeader}>
                            <Text style={styles.pillName}>{pill.itemName}</Text>
                        </View>
                        
                        {/* 효능 정보 */}
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>✅ 효능·효과</Text>
                            <Text style={styles.infoText} numberOfLines={3}>
                                {pill.efcyQesitm || '정보가 없습니다.'}
                            </Text>
                        </View>

                         {/* 복용법 정보 */}
                         <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>📋 용법·용량</Text>
                            <Text style={styles.infoText} numberOfLines={3}>
                                {pill.useMethodQesitm || '정보가 없습니다.'}
                            </Text>
                        </View>

                        {/* 주의사항 정보 (새로 추가됨) */}
                        <View style={styles.infoGroup}>
                            <Text style={[styles.infoLabel, {color: '#e84444'}]}>⚠️ 사용상 주의사항</Text>
                            <Text style={styles.infoText} numberOfLines={3}>
                                {pill.atpnWarnQesitm || '정보가 없습니다.'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    <Text style={styles.emptySubText}>정확한 약 이름을 입력해 주세요.</Text>
                </View>
            )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), paddingVertical: wp(12), height: wp(60) },
  backButton: { width: wp(40), height: wp(40), justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: wp(20), color: '#08504a', fontWeight: 'bold' },
  headerTitle: { fontSize: wp(20), fontWeight: '700', color: '#08504a', marginLeft: wp(8) },
  
  searchContainer: { paddingHorizontal: wp(16), paddingVertical: wp(12) },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebecee', borderRadius: wp(10), paddingHorizontal: wp(16), height: wp(44) },
  searchInput: { flex: 1, fontSize: wp(14), color: '#000', height: '100%' },
  clearButton: { width: wp(24), height: wp(24), justifyContent: 'center', alignItems: 'center' },
  clearIcon: { fontSize: wp(16), color: '#3e9f97' },
  
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d9d9d9' },
  tab: { flex: 1, paddingVertical: wp(12), alignItems: 'center', position: 'relative' },
  tabText: { fontSize: wp(14), fontWeight: '700', color: '#999' },
  tabTextActive: { color: '#000' },
  tabIndicator: { position: 'absolute', bottom: -1, left: wp(16), right: wp(16), height: wp(2), backgroundColor: '#5cc5bc', borderRadius: wp(14) },
  
  listContainer: { flex: 1 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(16), paddingVertical: wp(16), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  clockIcon: { fontSize: wp(16), marginRight: wp(12), color: '#777777' },
  listItemText: { fontSize: wp(14), fontWeight: '700', color: '#2f2f2f' },

  routineButtonContainer: {
    marginBottom: wp(12),
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

  /* 검색 결과 카드 스타일 */
  resultCard: {
    marginHorizontal: wp(16),
    marginTop: wp(16),
    padding: wp(16),
    backgroundColor: '#fff',
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
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
    height: wp(150), // 이미지 높이 설정
  },
  resultHeader: { marginBottom: wp(12) },
  pillName: { fontSize: wp(18), fontWeight: 'bold', color: '#08504a' },
  
  infoGroup: { marginBottom: wp(16) },
  infoLabel: { fontSize: wp(14), fontWeight: '700', color: '#08504a', marginBottom: wp(4) },
  infoText: { fontSize: wp(13), color: '#333', lineHeight: wp(20) },

  emptyContainer: { alignItems: 'center', marginTop: wp(60) },
  emptyText: { fontSize: wp(16), fontWeight: 'bold', color: '#333', marginBottom: wp(8) },
  emptySubText: { fontSize: wp(13), color: '#999' },
});

export default PillSearchScreen;