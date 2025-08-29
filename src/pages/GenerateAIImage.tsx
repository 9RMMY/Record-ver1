import React, { useState } from 'react';
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
  TextInput,
  Dimensions,
} from 'react-native';

interface GenerateAIImageProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
      images?: string[];
    };
  };
}

const { width } = Dimensions.get('window');

const GenerateAIImage: React.FC<GenerateAIImageProps> = ({ navigation, route }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);

  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;
  const existingImages = route?.params?.images || [];

  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert('오류', 'AI 이미지 생성을 위한 프롬프트를 입력해주세요');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI image generation - 실제 앱에서는 OpenAI DALL-E, Midjourney 등의 AI 서비스를 호출
      await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
      
      // 데모 목적으로 랜덤 이미지 URL 생성
      const mockGeneratedImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
      setGeneratedImage(mockGeneratedImageUrl);
      
      // 생성 히스토리에 추가
      setGenerationHistory(prev => [mockGeneratedImageUrl, ...prev]);
      
      Alert.alert('성공', 'AI 이미지가 성공적으로 생성되었습니다!');
    } catch (error) {
      Alert.alert('오류', 'AI 이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = () => {
    if (generatedImage) {
      // 선택된 이미지와 함께 AddImagePage로 돌아가기
      navigation.navigate('AddImage', {
        ticketData,
        reviewData,
        images: [...existingImages, generatedImage],
        selectedAIImage: generatedImage,
      });
    }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 이미지 생성</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Image Generation Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🎨 AI 이미지 생성</Text>
          <Text style={styles.sectionDescription}>
            원하는 이미지를 자세히 설명해주세요
          </Text>

          <TextInput
            style={styles.promptInput}
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholder="예: 화려한 조명이 있는 아름다운 콘서트 무대, 밤하늘의 별들..."
            placeholderTextColor="#BDC3C7"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.generateButton,
              isGenerating && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateAIImage}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>AI 이미지 생성 중...</Text>
              </View>
            ) : (
              <Text style={styles.generateButtonText}>
                ✨ AI 이미지 생성하기
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Generated Image Preview */}
        {generatedImage && (
          <View style={styles.generatedImageContainer}>
            <Text style={styles.generatedImageTitle}>생성된 이미지</Text>
            <Image
              source={{ uri: generatedImage }}
              style={styles.generatedImage}
            />
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleRegenerateImage}
                disabled={isGenerating}
              >
                <Text style={styles.regenerateButtonText}>🔄 다시 생성</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectImage}
              >
                <Text style={styles.selectButtonText}>✅ 이 이미지 선택</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Generation History */}
        {generationHistory.length > 1 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>생성 히스토리</Text>
            <Text style={styles.sectionDescription}>
              이전에 생성된 이미지들 중에서도 선택할 수 있습니다
            </Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.historyContainer}
            >
              {generationHistory.slice(1).map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyImageWrapper}
                  onPress={() => handleSelectFromHistory(imageUrl)}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={[
                      styles.historyImage,
                      generatedImage === imageUrl && styles.selectedHistoryImage
                    ]}
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

        {/* Tips Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>💡 프롬프트 작성 팁</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipText}>• 구체적이고 상세한 설명을 해주세요</Text>
            <Text style={styles.tipText}>• 색상, 분위기, 스타일을 명시해보세요</Text>
            <Text style={styles.tipText}>• "아름다운", "화려한" 같은 형용사를 활용하세요</Text>
            <Text style={styles.tipText}>• 원하지 않는 요소는 "~없이"로 제외해주세요</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
  backButtonText: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  promptInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 100,
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  generatedImageContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  regenerateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyContainer: {
    marginTop: 12,
  },
  historyImageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  historyImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHistoryImage: {
    borderColor: '#27AE60',
  },
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
  selectedText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default GenerateAIImage;
