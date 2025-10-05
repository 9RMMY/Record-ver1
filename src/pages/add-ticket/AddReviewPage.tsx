import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../styles/designSystem';
import { voiceManager } from '../../utils/voiceUtils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/reviewTypes';

type AddReviewPageProps = NativeStackScreenProps<RootStackParamList, 'AddReview'>;

const { width } = Dimensions.get('window');

const AddReviewPage = ({ navigation, route }: AddReviewPageProps) => {
  const { ticketData } = route.params; // ImageOptions로 전달할 티켓 데이터

  const [reviewText, setReviewText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // ✅ 로컬 상태로 관리
  const [questions, setQuestions] = useState<string[]>([
    '이 공연을 보게 된 계기는?',
    '가장 인상 깊었던 순간은?',
    '다시 본다면 어떤 점이 기대되나요?',
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const setupVoice = async () => {
      const available = await voiceManager.isVoiceAvailable();
      if (!available || !isMounted) return;

      await voiceManager.setListeners({
        onSpeechResults: (event: any) => {
          const text = event?.value?.[0];
          if (text) setReviewText(prev => `${prev} ${text}`);
        },
        onSpeechEnd: () => setIsRecording(false),
        onSpeechError: () => setIsRecording(false),
      });
    };

    setupVoice();

    return () => {
      isMounted = false;
      voiceManager.destroy();
    };
  }, []);

  // ✅ 녹음 토글 함수
  const toggleRecording = async () => {
    if (isRecording) {
      await voiceManager.stopRecording();
      setIsRecording(false);
    } else {
      try {
        await voiceManager.startRecording('ko-KR');
        setIsRecording(true);
        setIsVoiceMode(true);
      } catch {
        Alert.alert('녹음을 시작할 수 없습니다.');
      }
    }
  };

  // ✅ 제출
  const handleSubmit = () => {
    navigation.navigate('ImageOptions', {
      ticketData,
      reviewData: { reviewText },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공연 후기 작성하기</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>

      {/* 추천 질문 스와이프 카드 */}
      <View style={styles.questionSection}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {questions.map((question, idx) => (
            <View key={idx} style={styles.questionCard}>
              <Text style={styles.questionText}>{question}</Text>
            </View>
          ))}
        </Animated.ScrollView>

        {/* 인디케이터 */}
        <View style={styles.dots}>
          {questions.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 12, 6],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ['#BDC3C7', '#2C3E50', '#BDC3C7'],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
              />
            );
          })}
        </View>
      </View>

      {/* 후기 작성 영역 */}
      <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
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
          placeholder="Share your experience about this performance..."
          placeholderTextColor="#BDC3C7"
          multiline
          numberOfLines={8}
          maxLength={1000}
          value={reviewText}
          onChangeText={setReviewText}
        />
        <Text style={styles.characterCount}>{reviewText.length}/1000 characters</Text>
      </ScrollView>

      {/* 하단 플로팅 녹음 버튼 */}
      <View style={styles.floatingContainer}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording ? styles.recordButtonActive : styles.recordButtonInactive,
          ]}
          onPress={toggleRecording} // 토글 방식
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '녹음 중' : '녹음 시작'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.screenPadding,
    backgroundColor: '#fff',
    ...Shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 18, fontWeight: 'bold' },
  headerTitle: { ...Typography.headline, color: '#000' },
  nextButtonText: { color: '#B11515', fontWeight: '600' },

  // 추천 질문 카드
  questionSection: { marginTop: 12 },
  questionCard: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#E6E6E6',
  },
  questionText: { fontSize: 16, color: '#2C3E50', fontWeight: '500' },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BDC3C7',
    marginHorizontal: 3,
  },

  // 후기 입력 영역
  reviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    ...Shadows.small,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: '600', fontSize: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { fontSize: 14, marginRight: 8 },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8F9FA',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    color: '#7F8C8D',
    fontSize: 12,
    marginTop: 6,
  },

  // 하단 플로팅 녹음 버튼
  floatingContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  recordButtonActive: { backgroundColor: '#B11515' },
  recordButtonInactive: { backgroundColor: '#E0E0E0' },
  recordButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default AddReviewPage;
