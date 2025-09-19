/**
 * 후기 작성 페이지
 * 텍스트 입력 또는 음성 녹음을 통해 공연 후기를 작성하는 화면
 * 공개/비공개 설정 및 글자 수 제한 기능 포함
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TicketData } from '../../types/reviewTypes';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles, Layout } from '../../styles/designSystem';
import { voiceManager } from '../../utils/voiceUtils';

// 후기 작성 페이지 Props 타입 정의
type AddReviewPageProps = NativeStackScreenProps<RootStackParamList, 'AddReview'>;

const AddReviewPage = ({ navigation, route }: AddReviewPageProps) => {
  const [reviewText, setReviewText] = useState(''); // 후기 텍스트 상태
  const [isPublic, setIsPublic] = useState(true); // 공개/비공개 설정

  // 음성 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false);
  const isVoiceMode = route?.params?.inputMode === 'voice'; // 음성 입력 모드 여부
  const ticketData = route?.params?.ticketData; // 이전 단계에서 전달받은 티켓 데이터

  // 음성 인식 초기 설정 및 이벤트 리스너 등록
  useEffect(() => {
    const setupVoice = async () => {
      if (!(await voiceManager.isVoiceAvailable())) {
        console.warn('Voice module is not available');
        return;
      }

      // 음성 인식 결과 처리 리스너 설정
      await voiceManager.setListeners({
        onSpeechResults: (event: any) => {
          const results: string[] | undefined = event?.value;
          if (results && results.length > 0) {
            const best = results[0];
            setReviewText(prev => (prev ? `${prev.trim()} ${best}` : best));
          }
        },
        onSpeechError: (e: any) => {
          setIsRecording(false);
          Alert.alert('음성 인식 오류', e?.error?.message ?? '알 수 없는 오류가 발생했어요.');
        },
        onSpeechEnd: () => {
          setIsRecording(false);
        },
      });
    };

    setupVoice();

    // 컴포넌트 언마운트 시 음성 인식 정리
    return () => {
      voiceManager.destroy();
    };
  }, []);

  // 음성 녹음 시작 함수
  const startRecording = async () => {
    if (!(await voiceManager.isVoiceAvailable())) {
      Alert.alert('음성 인식 오류', '음성 인식 기능을 사용할 수 없습니다.');
      return;
    }

    try {
      await voiceManager.startRecording('ko-KR'); // 한국어로 음성 인식 시작
      setIsRecording(true);
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert('권한 또는 초기화 오류', e?.message ?? '녹음을 시작할 수 없습니다.');
    }
  };

  // 음성 녹음 중지 함수
  const stopRecording = async () => {
    if (!(await voiceManager.isVoiceAvailable())) {
      setIsRecording(false);
      return;
    }

    try {
      await voiceManager.stopRecording();
      setIsRecording(false);
    } catch (e: any) {
      setIsRecording(false);
    }
  };

  // 후기 작성 완료 처리 및 다음 단계로 이동
  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }
    // 이미지 선택 페이지로 이동하며 후기 데이터 전달
    navigation.navigate('ImageOptions', {
      ticketData: ticketData,
      reviewData: { 
        reviewText,
        isPublic
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 - 뒤로가기 버튼과 제목 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* 후기 입력 영역 - 텍스트 입력창과 공개/비공개 토글 */}
          <View style={styles.reviewContainer}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.sectionTitle}>Your Review *</Text>
              <View style={styles.toggleRow}>
                <Text style={styles.statusLabel}>{isPublic ? '공개' : '비공개'}</Text>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: '#BDC3C7', true: '#B11515' }}
                  thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                />
              </View>
            </View>

            <TextInput
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Share your experience about this performance..."
              placeholderTextColor="#BDC3C7"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.characterCount}>
              {reviewText.length}/1000 characters
            </Text>

            {/* 음성 입력 모드일 때만 표시되는 음성 녹음 UI */}
            {isVoiceMode && (
              <View style={styles.voiceHint}>
                <Text style={styles.voiceHintText}>🎤 길게 눌러 말하고, 손을 떼면 텍스트로 들어가요.</Text>
              </View>
            )}
            {isVoiceMode && (
              <TouchableOpacity
                style={[styles.micButton, isRecording && styles.micButtonActive]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
                activeOpacity={0.9}
              >
                <Text style={[styles.micButtonText, isRecording && { color: '#fff' }]}>
                  {isRecording ? '말씀하세요… (손을 떼면 완료)' : '🎤 길게 눌러 말하기'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* 하단 버튼 영역 - 취소 및 완료 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!reviewText.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitReview}
            disabled={!reviewText.trim()}
          >
            <Text style={[
              styles.submitButtonText,
              (!reviewText.trim()) && styles.submitButtonTextDisabled
            ]}>
              완료
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    height: Layout.navigationBarHeight,
    backgroundColor: Colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: { ...Typography.body, color: Colors.systemBlue, fontWeight: '400' },
  headerTitle: { ...Typography.headline, color: Colors.label },
  placeholder: {
    position: 'absolute',
    right: Spacing.lg,
    width: 44,
    height: 44,
  },
  content: { flex: 1 },
  reviewContainer: {
    backgroundColor: '#FFFFFF', marginHorizontal: 20, marginBottom: 20,
    padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, padding: 16, fontSize: 16, color: '#2C3E50', minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  characterCount: { fontSize: 12, color: '#7F8C8D', textAlign: 'right', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { fontSize: 14, fontWeight: '500', color: '#2C3E50', marginRight: 8 },
  footer: {
    flexDirection: 'row', padding: 20, backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16,
    alignItems: 'center', marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#7F8C8D' },
  submitButton: {
    flex: 1, backgroundColor: '#3498DB', borderRadius: 12, padding: 16,
    alignItems: 'center', marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: { backgroundColor: '#BDC3C7' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  submitButtonTextDisabled: { color: '#7F8C8D' },

  // 음성 입력 관련 스타일
  micButton: {
    marginTop: 16, backgroundColor: '#ECF0F1', padding: 14, borderRadius: 12, alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#B11515',
  },
  micButtonText: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  voiceHint: { marginTop: 8, paddingVertical: 8 },
  voiceHintText: { fontSize: 12, color: '#7F8C8D' },
});

export default AddReviewPage;
