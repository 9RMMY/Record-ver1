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
// Note: react-native-image-picker would be used in production
// For now, we'll simulate image selection

interface AddImagePageProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
    };
  };
}

const { width } = Dimensions.get('window');

const AddImagePage: React.FC<AddImagePageProps> = ({ navigation, route }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;

  const handleImagePicker = () => {
    // Mock image selection for demo purposes
    // In production, you would use react-native-image-picker here
    const mockImages = [
      `https://picsum.photos/400/300?random=${Date.now()}`,
      `https://picsum.photos/400/300?random=${Date.now() + 1}`,
    ];
    
    Alert.alert(
      'Image Selection',
      'In a real app, this would open your photo gallery. For demo, we\'ll add sample images.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Sample Images', 
          onPress: () => {
            const availableSlots = 5 - selectedImages.length;
            const imagesToAdd = mockImages.slice(0, availableSlots);
            setSelectedImages(prev => [...prev, ...imagesToAdd]);
          }
        },
      ]
    );
  };

  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt for AI image generation');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI image generation - in real app, you'd call an AI service like OpenAI DALL-E, Midjourney, etc.
      await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
      
      // For demo purposes, we'll use a placeholder image
      const mockGeneratedImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
      setGeneratedImage(mockGeneratedImageUrl);
      
      Alert.alert('Success', 'AI image generated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddGeneratedImage = () => {
    if (generatedImage && selectedImages.length < 5) {
      setSelectedImages(prev => [...prev, generatedImage]);
      setGeneratedImage(null);
      setAiPrompt('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    // Here you would typically save the complete review with images
    const completeReviewData = {
      ...reviewData,
      ticketData,
      images: selectedImages,
    };

    // Navigate to ticket completion screen
    navigation.navigate('TicketComplete', {
      ticketData,
      reviewData,
      images: selectedImages,
    });
  };

  const handleSkip = () => {
    // Save review without images
    const completeReviewData = {
      ...reviewData,
      ticketData,
      images: [],
    };

    // Navigate to ticket completion screen even when skipping images
    navigation.navigate('TicketComplete', {
      ticketData,
      reviewData,
      images: [],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Images</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Review Summary */}
        {ticketData && reviewData && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Review Summary</Text>
            <Text style={styles.ticketTitle}>{ticketData.title}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                {'★'.repeat(reviewData.rating)}{'☆'.repeat(5 - reviewData.rating)} ({reviewData.rating}/5)
              </Text>
            </View>
            <Text style={styles.reviewPreview} numberOfLines={2}>
              {reviewData.reviewText}
            </Text>
          </View>
        )}

        {/* Upload Images Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>
          <Text style={styles.sectionDescription}>
            Add photos from your gallery ({selectedImages.length}/5)
          </Text>
          
          <TouchableOpacity 
            style={[styles.uploadButton, selectedImages.length >= 5 && styles.uploadButtonDisabled]} 
            onPress={handleImagePicker}
            disabled={selectedImages.length >= 5}
          >
            <Text style={styles.uploadButtonText}>📷 Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* AI Image Generation Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Generate AI Image</Text>
          <Text style={styles.sectionDescription}>
            Describe the image you want to generate
          </Text>
          
          <TextInput
            style={styles.promptInput}
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholder="e.g., A beautiful concert stage with colorful lights..."
            placeholderTextColor="#BDC3C7"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
            onPress={handleGenerateAIImage}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>🎨 Generate AI Image</Text>
            )}
          </TouchableOpacity>

          {/* Generated Image Preview */}
          {generatedImage && (
            <View style={styles.generatedImageContainer}>
              <Text style={styles.generatedImageTitle}>Generated Image:</Text>
              <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
              <TouchableOpacity 
                style={styles.addGeneratedButton} 
                onPress={handleAddGeneratedImage}
                disabled={selectedImages.length >= 5}
              >
                <Text style={styles.addGeneratedButtonText}>Add to Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Selected Images */}
        {selectedImages.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selected Images ({selectedImages.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
              {selectedImages.map((imageUri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipFooterButton} onPress={handleSkip}>
          <Text style={styles.skipFooterButtonText}>Save Without Images</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.finishButton,
            selectedImages.length === 0 && styles.finishButtonDisabled
          ]} 
          onPress={handleFinish}
          disabled={selectedImages.length === 0}
        >
          <Text style={[
            styles.finishButtonText,
            selectedImages.length === 0 && styles.finishButtonTextDisabled
          ]}>
            Finish Review
          </Text>
        </TouchableOpacity>
      </View>
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
  skipText: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#F39C12',
  },
  reviewPreview: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#3498DB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  promptInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 80,
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
  generatedImageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  generatedImageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  generatedImage: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  addGeneratedButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addGeneratedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imagesContainer: {
    marginTop: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  skipFooterButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  skipFooterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  finishButton: {
    flex: 2,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  finishButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  finishButtonTextDisabled: {
    color: '#7F8C8D',
  },
});

export default AddImagePage;
