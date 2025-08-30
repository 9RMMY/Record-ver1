import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ImageOptions: { ticketData: any; reviewData: any };
  AddImage: { ticketData: any; reviewData: any; imageSource: 'ai' | 'gallery' };
};

type ReviewOptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImageOptions'>;
type ReviewOptionsScreenRouteProp = RouteProp<RootStackParamList, 'ImageOptions'>;

const ImageOptions = () => {
  const navigation = useNavigation<ReviewOptionsScreenNavigationProp>();
  const route = useRoute<ReviewOptionsScreenRouteProp>();
  const { ticketData, reviewData } = route.params;

  const handleOptionSelect = (imageSource: 'ai' | 'gallery') => {
    navigation.navigate('AddImage', { 
      ticketData,
      reviewData,
      imageSource
    });
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
        <Text style={styles.headerTitle}>Review Options</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>티켓 이미지 선택하기</Text>
        <Text style={styles.subtitle}>
          기억에 남는 장면을 이미지로 표현해보세요!
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.recordButton]}
            onPress={() => handleOptionSelect('ai')}
          >
            <Image
              source={require('../assets/mic.png')} // 로컬 이미지
              style={styles.buttonIcon}
            />
            <Text style={styles.optionButtonText}>AI 생성 이미지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.writeButton]}
            onPress={() => handleOptionSelect('gallery')}
          >
            <Image
              source={require('../assets/mic.png')} 
              style={styles.buttonIcon}
            />

            <Text style={[styles.optionButtonText, { color: '#000000' }]}>
              갤러리에서 선택
            </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 20,
  },

  optionButton: {
    flexDirection: 'row', // 이미지와 텍스트 가로로 배치
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#B11515',
  },
  writeButton: {
    backgroundColor: '#ECF0F1',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ImageOptions;
