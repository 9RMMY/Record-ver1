import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface AIImageResultsProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
      images?: string[];
      settings?: {
        backgroundColor: string;
        includeText: boolean;
        imageStyle: string;
        aspectRatio: string;
      };
    };
  };
}

const { width } = Dimensions.get('window');

const AIImageResults: React.FC<AIImageResultsProps> = ({ navigation, route }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);

  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;
  const existingImages = route?.params?.images || [];
  const settings = route?.params?.settings;

  useEffect(() => {
    // 페이지 진입 시 자동으로 이미지 생성 시작
    handleGenerateAIImage();
  }, []);

  const handleGenerateAIImage = async () => {
    setIsGenerating(true);

    try {
      // 설정값을 기반으로 프롬프트 생성
      let enhancedPrompt = '공연 후기 기반 AI 이미지';

      if (settings?.backgroundColor && settings.backgroundColor !== '자동') {
        enhancedPrompt += `, ${settings.backgroundColor} 배경`;
      }

      if (settings?.includeText === false) {
        enhancedPrompt += ', 텍스트나 글자 없이';
      }

      if (settings?.imageStyle && settings.imageStyle !== '사실적') {
        enhancedPrompt += `, ${settings.imageStyle} 스타일`;
      }

      // 화면 비율에 따른 이미지 크기 설정
      let imageWidth = 400;
      let imageHeight = 400;

      if (settings?.aspectRatio === '세로형') {
        imageWidth = 300;
        imageHeight = 500;
      } else if (settings?.aspectRatio === '가로형') {
        imageWidth = 500;
        imageHeight = 300;
      }

      console.log('Enhanced Prompt:', enhancedPrompt);

      // AI 이미지 생성 시뮬레이션
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));

      const mockGeneratedImageUrl = `https://picsum.photos/${imageWidth}/${imageHeight}?random=${Date.now()}`;
      setGeneratedImage(mockGeneratedImageUrl);
      setGenerationHistory((prev) => [mockGeneratedImageUrl, ...prev]);

      Alert.alert('성공', 'AI 이미지가 성공적으로 생성되었습니다!');
    } catch (error) {
      Alert.alert('오류', 'AI 이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = () => {
    if (generatedImage) {
      navigation.navigate('TicketComplete', {
        ticketData,
        reviewData,
        images: [...existingImages, generatedImage],
      });
    }
  };

  const handleModifySettings = () => {
    // 현재 설정값을 가지고 설정 페이지로 돌아가기
    navigation.navigate('AIImageSettings', {
      ticketData,
      reviewData,
      images: existingImages,
      existingSettings: settings,
    });
  };

  const handleRegenerateImage = () => {
    setGeneratedImage(null);
    handleGenerateAIImage();
  };

  const handleSelectFromHistory = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // 현재 설정 요약 텍스트 생성
  const getSettingsSummary = () => {
    const parts = [];
    if (settings?.backgroundColor && settings.backgroundColor !== '자동') {
      parts.push(`${settings.backgroundColor} 배경`);
    }
    if (settings?.includeText === false) parts.push('텍스트 제외');
    if (settings?.imageStyle && settings.imageStyle !== '사실적') {
      parts.push(`${settings.imageStyle} 스타일`);
    }
    if (settings?.aspectRatio) {
      parts.push(`${settings.aspectRatio} 비율`);
    }
    return parts.join(' • ') || '기본 설정';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 이미지 결과</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleModifySettings}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 현재 설정 표시 */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>현재 생성 조건</Text>
          <Text style={styles.settingsText}>{getSettingsSummary()}</Text>
          <TouchableOpacity style={styles.modifyButton} onPress={handleModifySettings}>
            <Text style={styles.modifyButtonText}>조건 수정하기</Text>
          </TouchableOpacity>
        </View>

        {/* 생성 중 또는 결과 표시 */}
        {isGenerating ? (
          <View style={styles.generatingContainer}>
            <ActivityIndicator size="large" color="#9B59B6" />
            <Text style={styles.generatingTitle}>AI 이미지 생성 중...</Text>
            <Text style={styles.generatingText}>
              설정하신 조건에 맞는 이미지를 생성하고 있습니다
            </Text>
          </View>
        ) : (
          generatedImage && (
            <View style={styles.generatedImageContainer}>
              <Text style={styles.generatedImageTitle}>생성된 이미지</Text>
              <Image source={{ uri: generatedImage }} style={styles.generatedImage} />

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.regenerateButton}
                  onPress={handleRegenerateImage}
                  disabled={isGenerating}
                >
                  <Text style={styles.regenerateButtonText}>🔄 다시 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectButton} onPress={handleSelectImage}>
                  <Text style={styles.selectButtonText}>✅ 이 이미지 선택</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}

        {/* Generation History */}
        {generationHistory.length > 1 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>생성 히스토리</Text>
            <Text style={styles.sectionDescription}>이전 생성 이미지 중 선택 가능</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyContainer}>
              {generationHistory.slice(1).map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyImageWrapper}
                  onPress={() => handleSelectFromHistory(imageUrl)}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={[styles.historyImage, generatedImage === imageUrl && styles.selectedHistoryImage]}
                  />
                  {generatedImage === imageUrl && (
                    <View style={styles.selectedOverlay}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9B59B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: { fontSize: 18 },
  content: { flex: 1 },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingsTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  settingsText: { fontSize: 14, color: '#7F8C8D', lineHeight: 20, marginBottom: 12 },
  modifyButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#9B59B6',
  },
  modifyButtonText: { fontSize: 14, fontWeight: '500', color: '#9B59B6' },
  generatingContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  generatingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  generatingText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
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
  sectionDescription: { fontSize: 14, color: '#7F8C8D', marginBottom: 16 },
  generatedImageContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  generatedImageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  generatedImage: {
    width: width - 80,
    height: width - 80,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionButtonsContainer: { flexDirection: 'row', width: '100%', gap: 12 },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  regenerateButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  selectButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  historyContainer: { marginTop: 12 },
  historyImageWrapper: { position: 'relative', marginRight: 12 },
  historyImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHistoryImage: { borderColor: '#27AE60' },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(39, 174, 96, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
});

export default AIImageResults;
