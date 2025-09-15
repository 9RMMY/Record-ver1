/**
 * 후기 작성 옵션 선택 페이지
 * 사용자가 후기 작성 방식을 선택하는 화면 (음성녹음/직접작성/건너뛰기)
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { addTicketAtom, TicketStatus } from '../../atoms';
import { 
  ReviewOptionsScreenNavigationProp,
  ReviewOptionsRouteProp,
  TicketData,
  ReviewData
} from '../../types/reviewTypes';

const ReviewOptions: React.FC = () => {
  const navigation = useNavigation<ReviewOptionsScreenNavigationProp>();
  const route = useRoute<ReviewOptionsRouteProp>();
  const { ticketData } = route.params; // 이전 단계에서 전달받은 티켓 데이터
  const [, addTicket] = useAtom(addTicketAtom);

  // 후기 작성 방식 선택 처리 (음성녹음 또는 직접작성)
  const handleOptionSelect = (mode: 'text' | 'voice') => {
    navigation.navigate('AddReview', {
      ticketData,
      inputMode: 'text', // 현재는 텍스트 모드로 고정
      initialText: '',
    });
  };

  // 후기 작성을 건너뛰고 이미지 선택으로 이동
  const handleCompleteWithoutReview = () => {
    navigation.navigate('ImageOptions', {
      ticketData,
      reviewData: { text: '' }, // 빈 후기 데이터로 진행
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 상단 헤더 - 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      {/* 메인 콘텐츠 - 제목, 설명, 옵션 버튼들 */}
      <View style={styles.content}>
        <Text style={styles.title}>공연 후기 작성하기</Text>
        <Text style={styles.subtitle}>
          오늘 공연에서 기억에 남는 장면은 무엇인가요?
        </Text>

        <View style={styles.optionsContainer}>
          {/* 음성녹음 옵션 버튼 */}
          <TouchableOpacity
            style={[styles.optionButton, styles.recordButton]}
            onPress={() => handleOptionSelect('voice')}
          >
            <Image
              source={require('../../assets/mic.png')}
              style={styles.buttonIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.optionButtonText}>음성녹음하기</Text>
              <Text style={styles.optionButtonSubText}>
                마이크를 켤 수 있으면 사용하세요.{'\n'}녹음을 하면 텍스트로
                변환돼요.
              </Text>
            </View>
          </TouchableOpacity>

          {/* 직접 작성 옵션 버튼 */}
          <TouchableOpacity
            style={[styles.optionButton, styles.writeButton]}
            onPress={() => handleOptionSelect('text')}
          >
            <Image
              source={require('../../assets/mic.png')}
              style={styles.buttonIcon}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.optionButtonText, { color: '#000000' }]}>
                직접 작성하기
              </Text>
              <Text style={[styles.optionButtonSubText, { color: '#8E8E93' }]}>
                키보드로 후기를 직접 입력할 수 있어요.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 후기 작성 건너뛰기 버튼 */}
        <TouchableOpacity
          style={styles.skipReviewButton}
          onPress={handleCompleteWithoutReview}
        >
          <Text style={styles.skipReviewButtonText}>후기 건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonText: { fontSize: 20, color: '#007AFF' },
  placeholder: { width: 40 },
  content: { padding: 24, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'left',
    lineHeight: 22,
  },
  optionsContainer: { width: '100%', gap: 16, marginBottom: 220 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: { width: 80, height: 80, marginRight: 16 },
  recordButton: { backgroundColor: '#B11515', height: 120 },
  writeButton: { backgroundColor: '#FFFFFF', height: 120, borderWidth: 1, borderColor: '#E5E5EA' },
  textContainer: { flexDirection: 'column', flex: 1 },
  optionButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  optionButtonSubText: { fontSize: 15, fontWeight: '400', color: '#FFFFFF' },
  skipReviewButton: {
    backgroundColor: '#8E8E93',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  skipReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ReviewOptions;
