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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAtom } from 'jotai';
import { addTicketAtom } from '../atoms/ticketAtoms';

type RootStackParamList = {
  ReviewOptions: { ticketData: any };
  AddReview: { ticketData: any; inputMode: 'text' | 'voice' };
  ImageOptions: { ticketData: any; reviewData: any };
};

type ReviewOptionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReviewOptions'
>;
type ReviewOptionsScreenRouteProp = RouteProp<
  RootStackParamList,
  'ReviewOptions'
>;

const ReviewOptions = () => {
  const navigation = useNavigation<ReviewOptionsScreenNavigationProp>();
  const route = useRoute<ReviewOptionsScreenRouteProp>();
  const { ticketData } = route.params;
  const [, addTicket] = useAtom(addTicketAtom);

  const handleOptionSelect = (mode: 'text' | 'voice') => {
    navigation.navigate('AddReview', {
      ticketData,
      inputMode: mode,
    });
  };

  const handleCompleteWithoutReview = () => {
    navigation.navigate('ImageOptions', {
      ticketData,
      reviewData: null, // 후기 없음을 나타냄
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      {/* 본문 */}
      <View style={styles.content}>
        <Text style={styles.title}>공연 후기 작성하기</Text>
        <Text style={styles.subtitle}>
          오늘 공연에서 기억에 남는 장면은 무엇인가요?
        </Text>

        <View style={styles.optionsContainer}>
          {/* 음성 입력 모드 */}
          <TouchableOpacity
            style={[styles.optionButton, styles.recordButton]}
            onPress={() => handleOptionSelect('voice')}
          >
            <Image
              source={require('../assets/mic.png')}
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

          {/* 텍스트 입력 모드 */}
          <TouchableOpacity
            style={[styles.optionButton, styles.writeButton]}
            onPress={() => handleOptionSelect('text')}
          >
            <Image
              source={require('../assets/mic.png')}
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

        {/* 후기 스킵 버튼 */}
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
