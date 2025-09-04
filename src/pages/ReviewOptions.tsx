import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ReviewOptions: { ticketData: any };
  AddReview: { ticketData: any; inputMode: 'text' | 'voice' };
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

  const handleOptionSelect = (mode: 'text' | 'voice') => {
    navigation.navigate('AddReview', {
      ticketData,
      inputMode: mode,
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
              <Text style={[styles.optionButtonText, { color: '#000' }]}>
                직접 작성하기
              </Text>
              <Text style={[styles.optionButtonSubText, { color: '#000' }]}>
                키보드로 후기를 직접 입력할 수 있어요.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8F8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8f8',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 20, color: '#2C3E50' },
  placeholder: { width: 40 },
  content: { padding: 24, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
    lineHeight: 20,
  },
  optionsContainer: { width: '100%', gap: 20, marginBottom: 220 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  buttonIcon: { width: 100, height: 100, marginRight: 8 },
  recordButton: { backgroundColor: 'rgba(219, 88, 88, 1)', height: 140 },
  writeButton: { backgroundColor: '#ECF0F1', height: 140 },
  textContainer: { flexDirection: 'column' },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionButtonSubText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
});

export default ReviewOptions;
