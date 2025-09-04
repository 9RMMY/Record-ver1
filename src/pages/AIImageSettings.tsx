import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface AIImageSettingsProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
      images?: string[];
      // 기존 설정값들 (수정 시 사용)
      existingSettings?: {
        backgroundColor: string;
        includeText: boolean;
        imageStyle: string;
        aspectRatio: string;
      };
    };
  };
}

const AIImageSettings: React.FC<AIImageSettingsProps> = ({ navigation, route }) => {
  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;
  const existingImages = route?.params?.images || [];
  const existingSettings = route?.params?.existingSettings;

  // 커스터마이징 옵션 (기존 설정이 있으면 사용)
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    existingSettings?.backgroundColor || '자동'
  );
  const [includeText, setIncludeText] = useState(
    existingSettings?.includeText !== undefined ? existingSettings.includeText : true
  );
  const [imageStyle, setImageStyle] = useState(
    existingSettings?.imageStyle || '사실적'
  );
  const [aspectRatio, setAspectRatio] = useState(
    existingSettings?.aspectRatio || '정사각형'
  );

  const backgroundColors = [
    { label: '자동', value: '자동', color: '#FFFFFF' },
    { label: '흰색', value: '흰색', color: '#FFFFFF' },
    { label: '검은색', value: '검은색', color: '#000000' },
    { label: '파란색', value: '파란색', color: '#3498DB' },
    { label: '보라색', value: '보라색', color: '#9B59B6' },
    { label: '핑크색', value: '핑크색', color: '#E91E63' },
    { label: '주황색', value: '주황색', color: '#FF9800' },
    { label: '초록색', value: '초록색', color: '#4CAF50' },
  ];

  const imageStyles = ['사실적', '일러스트', '수채화', '유화', '만화', '미니멀'];

  const aspectRatios = [
    { label: '정사각형', value: '정사각형' },
    { label: '세로형', value: '세로형' },
    { label: '가로형', value: '가로형' },
  ];

  const handleStartGeneration = () => {
    const settings = {
      backgroundColor: selectedBackgroundColor,
      includeText,
      imageStyle,
      aspectRatio,
    };

    navigation.navigate('AIImageResults', {
      ticketData,
      reviewData,
      images: existingImages,
      settings,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 이미지 설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 설명 섹션 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🎨 이미지 생성 조건 설정</Text>
          <Text style={styles.sectionDescription}>
            원하는 이미지 스타일과 조건을 선택해주세요
          </Text>
        </View>

        {/* 커스터마이징 옵션들 */}
        <View style={styles.customizationContainer}>
          {/* 배경색 선택 */}
          <View style={styles.optionSection}>
            <Text style={styles.optionLabel}>배경색</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScrollView}>
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color },
                    selectedBackgroundColor === color.value && styles.selectedColorOption,
                    color.value === '검은색' && styles.blackColorOption,
                  ]}
                  onPress={() => setSelectedBackgroundColor(color.value)}
                >
                  <Text style={[styles.colorLabel, color.value === '검은색' && { color: '#FFFFFF' }]}>
                    {color.label}
                  </Text>
                  {selectedBackgroundColor === color.value && (
                    <Text style={[styles.checkMark, color.value === '검은색' && { color: '#FFFFFF' }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 텍스트 포함/제외 */}
          <View style={styles.optionSection}>
            <View style={styles.toggleRow}>
              <Text style={styles.optionLabel}>텍스트/글자 포함</Text>
              <TouchableOpacity
                style={[styles.toggleButton, includeText && styles.toggleButtonActive]}
                onPress={() => setIncludeText(!includeText)}
              >
                <Text style={[styles.toggleButtonText, includeText && styles.toggleButtonTextActive]}>
                  {includeText ? '포함' : '제외'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 이미지 스타일 */}
          <View style={styles.optionSection}>
            <Text style={styles.optionLabel}>이미지 스타일</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScrollView}>
              {imageStyles.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[styles.styleOption, imageStyle === style && styles.selectedStyleOption]}
                  onPress={() => setImageStyle(style)}
                >
                  <Text style={[styles.styleLabel, imageStyle === style && styles.selectedStyleLabel]}>{style}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 화면 비율 */}
          <View style={styles.optionSection}>
            <Text style={styles.optionLabel}>화면 비율</Text>
            <View style={styles.ratioContainer}>
              {aspectRatios.map((ratio) => (
                <TouchableOpacity
                  key={ratio.value}
                  style={[styles.ratioOption, aspectRatio === ratio.value && styles.selectedRatioOption]}
                  onPress={() => setAspectRatio(ratio.value)}
                >
                  <Text style={[styles.ratioLabel, aspectRatio === ratio.value && styles.selectedRatioLabel]}>
                    {ratio.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 생성 시작 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleStartGeneration}>
            <Text style={styles.generateButtonText}>✨ AI 이미지 생성 시작</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 20, color: '#2C3E50', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  content: { flex: 1 },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  sectionDescription: { fontSize: 14, color: '#7F8C8D', lineHeight: 20 },
  customizationContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionSection: { marginBottom: 24 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
  colorScrollView: { marginTop: 4 },
  colorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColorOption: { borderColor: '#9B59B6' },
  blackColorOption: { borderColor: '#34495E' },
  colorLabel: { fontSize: 12, fontWeight: '500', color: '#2C3E50' },
  checkMark: { fontSize: 10, fontWeight: 'bold', color: '#9B59B6', marginTop: 2 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleButton: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: { backgroundColor: '#27AE60' },
  toggleButtonText: { fontSize: 14, fontWeight: '500', color: '#7F8C8D' },
  toggleButtonTextActive: { color: '#FFFFFF' },
  styleScrollView: { marginTop: 4 },
  styleOption: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedStyleOption: { backgroundColor: '#9B59B6', borderColor: '#9B59B6' },
  styleLabel: { fontSize: 14, fontWeight: '500', color: '#2C3E50' },
  selectedStyleLabel: { color: '#FFFFFF' },
  ratioContainer: { flexDirection: 'row', gap: 8 },
  ratioOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedRatioOption: { backgroundColor: '#9B59B6', borderColor: '#9B59B6' },
  ratioLabel: { fontSize: 14, fontWeight: '500', color: '#2C3E50' },
  selectedRatioLabel: { color: '#FFFFFF' },
  buttonContainer: { marginHorizontal: 20, marginBottom: 30 },
  generateButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
});

export default AIImageSettings;
