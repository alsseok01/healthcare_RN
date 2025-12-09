import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from '../../../utils/scaling';
import { useNavigation } from '@react-navigation/native';
import * as API from '../../services/api';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[]; 
}

type TopicType = 'general' | 'pill' | 'exercise' | 'supplement' | 'checkup';

const AIChatScreen = () => {
  const navigation = useNavigation<any>();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentTopic, setCurrentTopic] = useState<TopicType>('general');
  
  const scrollViewRef = useRef<ScrollView>(null);

  const frequentQuestions = [
    '건강검진 결과',
    '영양제 추천',
    '알약 물어보기',
    '운동 방법'
  ];

  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: 'init-greeting',
        text: '안녕하세요! Pokit의 AI 박사입니다. 건강 관련 궁금증은 모두 물어봐주세요!',
        isUser: false,
        timestamp: new Date(),
      },
      {
        id: 'init-questions',
        text: '', 
        isUser: false,
        timestamp: new Date(),
        suggestions: frequentQuestions,
      }
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    let response;
    switch (currentTopic) {
      case 'pill':
        response = await API.searchPillByDescription(text.trim());
        break;
      case 'exercise':
        response = await API.getExerciseAdvice(text.trim());
        break;
      case 'supplement':
        response = await API.getSupplementAdvice(text.trim());
        break;
      case 'checkup':
        response = await API.getCheckupAdvice(text.trim());
        break;
      default:
        response = await API.sendGeneralMessage(text.trim());
        break;
    }
    
    setIsLoading(false); 

    let aiMessage: ChatMessage;

    if (response.success && response.data) {
      const data = response.data;
      let aiText = '';

      if (data.itemName) {
        aiText = `💊 **${data.itemName}**\n\n`;
        if (data.efcyQesitm) aiText += `✅ 효능:\n${data.efcyQesitm}\n\n`;
        if (data.useMethodQesitm) aiText += `📋 복용법:\n${data.useMethodQesitm}\n\n`;
        if (data.atpnWarnQesitm) aiText += `⚠️ 주의사항:\n${data.atpnWarnQesitm}`;
      } else {
        aiText = data.response || "죄송합니다. 정보를 찾을 수 없습니다.";
      }

      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };
    } else {
      aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.error || '죄송합니다. 응답을 받는데 실패했습니다.',
        isUser: false,
        timestamp: new Date(),
      };
    }

    const questionBoxMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      text: '', 
      isUser: false,
      timestamp: new Date(),
      suggestions: frequentQuestions, 
    };

    setMessages(prev => [...prev, aiMessage, questionBoxMessage]);
    
    setCurrentTopic('general');
  };

  const handleQuestionPress = (question: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };

    let aiPromptText = '';
    
    if (question === '알약 물어보기') {
      setCurrentTopic('pill');
      aiPromptText = '찾으시는 알약의 모양, 색상, 식별 문자 등을 자세히 묘사해 주세요.\n(예: "분홍색 원형인 약이고 AB각인이 있어")';
    } 
    else if (question === '운동 방법') {
      setCurrentTopic('exercise');
      aiPromptText = '어떤 운동에 대해 알고 싶으신가요? (예: "허리 디스크에 좋은 운동", "홈트레이닝 추천해줘")';
    } 
    else if (question === '영양제 추천') {
      setCurrentTopic('supplement');
      aiPromptText = '현재 고민이거나 개선하고 싶은 건강 상태를 알려주세요. (예: "요즘 너무 피곤해", "눈이 침침해")';
    } 
    else if (question === '건강검진 결과') {
      setCurrentTopic('checkup');
      aiPromptText = '궁금한 검진 항목이나 수치를 입력해 주세요. (예: "공복혈당 120이 나왔어", "LDL 콜레스테롤이 뭐야?")';
    } 
    else {
      setCurrentTopic('general');
      handleSendMessage(question);
      return;
    }

    const aiPrompt: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiPromptText,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, aiPrompt]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗</Text>
      </View>

      {/* 메인 컨텐츠 */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContent}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.backgroundMint} />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatArea} 
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View key={msg.id}>
              {msg.text ? (
                <View style={msg.isUser ? styles.userMessageRow : styles.messageRow}>
                  {!msg.isUser && (
                    <View style={styles.aiAvatarContainer}>
                      <Image source={require("../../../assets/Group 48.png")} style={styles.aiAvatar} resizeMode="contain" />
                    </View>
                  )}
                  <View style={msg.isUser ? styles.userMessageBubble : styles.aiMessageBubble}>
                    <Text style={msg.isUser ? styles.userMessageText : styles.aiMessageText}>
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ) : null}

              {msg.suggestions && (
                <View style={styles.messageRow}>
                  <View style={styles.aiAvatarContainer}>
                    <Image source={require("../../../assets/Group 48.png")} style={styles.aiAvatar} resizeMode="contain" />
                  </View>
                  <View style={styles.aiMessageBubble}>
                    <View style={styles.frequentQuestionsContainer}>
                      <Text style={styles.frequentTitle}>자주 물어보는 질문</Text>
                      <View style={styles.questionGrid}>
                        {msg.suggestions.map((question, index) => (
                          <TouchableOpacity 
                            key={`${msg.id}-q-${index}`} 
                            style={styles.questionButton}
                            onPress={() => handleQuestionPress(question)}
                          >
                            <Text style={styles.questionButtonText}>{question}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.messageRow}>
              <View style={styles.aiAvatarContainer}>
                <Image source={require("../../../assets/Group 48.png")} style={styles.aiAvatar} resizeMode="contain" />
              </View>
              <View style={styles.aiMessageBubble}>
                <ActivityIndicator size="small" color="#08504a" />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={() => handleSendMessage(inputText)}
          >
            <Image source={require("../../../assets/Group 8.png")} style={styles.sendIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), paddingVertical: wp(12), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { width: wp(40), height: wp(40), justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: wp(20), color: '#08504a', fontWeight: 'bold' },
  headerTitle: { fontSize: wp(20), fontWeight: '700', color: '#08504a', marginLeft: wp(8) },
  mainContent: { flex: 1, position: 'relative' },
  backgroundMint: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: 'rgba(189, 229, 226, 0.4)' },
  chatArea: { flex: 1 },
  chatContent: { paddingHorizontal: wp(16), paddingTop: wp(24), paddingBottom: wp(20) },
  messageRow: { flexDirection: 'row', marginBottom: wp(16), alignItems: 'flex-start' },
  aiAvatarContainer: { width: wp(40), height: wp(40), borderRadius: wp(20), justifyContent: 'center', alignItems: 'center', marginRight: wp(8) },
  aiAvatar: { width: wp(40), height: wp(40) },
  aiMessageBubble: { flex: 1, backgroundColor: '#fff', borderRadius: wp(15), padding: wp(16), borderWidth: 1, borderColor: '#5cc5bc' },
  aiMessageText: { fontSize: wp(14), fontWeight: '700', color: '#000', lineHeight: wp(20) },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: wp(16), alignItems: 'flex-start' },
  userMessageBubble: { backgroundColor: '#08504a', borderRadius: wp(15), padding: wp(16), maxWidth: '80%' },
  userMessageText: { fontSize: wp(14), fontWeight: '500', color: '#fff', lineHeight: wp(20) },
  frequentQuestionsContainer: { flex: 1 },
  frequentTitle: { fontSize: wp(14), fontWeight: '700', color: '#08504a', marginBottom: wp(12) },
  questionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(8) },
  questionButton: { backgroundColor: '#fff', borderRadius: wp(12), paddingHorizontal: wp(16), paddingVertical: wp(12), borderWidth: 1, borderColor: '#e0e0e0', width: '48%' },
  questionButtonText: { fontSize: wp(13), color: '#08504a', fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), paddingVertical: wp(12), backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: wp(8) },
  input: { flex: 1, backgroundColor: '#ebecee', borderRadius: wp(10), paddingHorizontal: wp(16), paddingVertical: wp(12), fontSize: wp(14), color: '#000', maxHeight: wp(100) },
  sendButton: { width: wp(44), height: wp(44), justifyContent: 'center', alignItems: 'center' },
  sendIcon: { width: wp(25), height: wp(25) },
});

export default AIChatScreen;