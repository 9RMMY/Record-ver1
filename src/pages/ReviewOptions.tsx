import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ReviewOptions: { ticketData: any };
  AddReview: { hasReview: boolean } & any;
};

type ReviewOptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewOptions'>;
type ReviewOptionsScreenRouteProp = RouteProp<RootStackParamList, 'ReviewOptions'>;

const ReviewOptions = () => {
  const navigation = useNavigation<ReviewOptionsScreenNavigationProp>();
  const route = useRoute<ReviewOptionsScreenRouteProp>();
  const { ticketData } = route.params;

  const handleOptionSelect = (hasReview: boolean) => {
    navigation.navigate('AddReview', { 
      ...ticketData,
      hasReview
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>공연 후기 작성하기</Text>
        <Text style={styles.subtitle}>
          오늘 공연에서 기억에 남는 장면은 무엇인가요?
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.recordButton]}
            onPress={() => handleOptionSelect(true)}
          >
            <Image
              source={require('../assets/mic.png')}
              style={styles.buttonIcon}
            />
            {/* 텍스트 묶음 */}
            <View style={styles.textContainer}>
              <Text style={styles.optionButtonText}>음성녹음하기</Text>
              <Text style={styles.optionButtonSubText}>
                마이크를 켤 수 있으면 사용하삼.{"\n"}마이크를 켜고 녹음을 해야겠지
                {"\n"}AMRD 아무래도라는 뜻
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.writeButton]}
            onPress={() => handleOptionSelect(false)}
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
                마이크를 켤 수 있으면 사용하삼.{"\n"}마이크를 켜고 녹음을 해야겠지
                {"\n"}AMRD 아무래도라는 뜻
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8f8',
  },
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
  backButtonText: {
    fontSize: 20,
    color: '#2C3E50',
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    marginBottom: 40,
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
    lineHeight: 20,
  },

  optionsContainer: {
    width: '100%',
    height: '85%',
    paddingHorizontal: 0,
    gap: 20,
  },
  optionButton: {
    flexDirection: 'row', // 이미지와 텍스트 가로로 배치
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  buttonIcon: {
    width: 100,
    height: 100,
    marginRight: 8, // 텍스트와 간격
  },

  recordButton: {
    backgroundColor: 'rgba(219, 88, 88, 1)',
    height: 150,
  },
  writeButton: {
    backgroundColor: '#ECF0F1',
    height: 150,
  },

  textContainer: {
    flexDirection: 'column',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionButtonSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ReviewOptions;
