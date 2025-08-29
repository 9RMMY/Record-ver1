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

interface AddImagePageProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
      reviewData?: {
        rating: number;
        reviewText: string;
      };
      images?: string[];
      selectedAIImage?: string;
    };
  };
}

const { width } = Dimensions.get('window');

//nav && 상태관리
const AddImagePage: React.FC<AddImagePageProps> = ({ navigation, route }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const ticketData = route?.params?.ticketData;
  const reviewData = route?.params?.reviewData;
  const selectedAIImage = route?.params?.selectedAIImage;
  const imagesFromParams = route?.params?.images;

  // Handle images from GenerateAIImage page
  React.useEffect(() => {
    if (imagesFromParams && imagesFromParams.length > 0) {
      setSelectedImages(imagesFromParams);
    }
  }, [imagesFromParams]);

  const handleImagePicker = () => {
    //수정해야함, react-native-image-picker 사용, 1장만 추가할 수 있도록
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

  const handleGenerateAIImage = () => {
    // Navigate to GenerateAIImage page
    navigation.navigate('GenerateAIImage', {
      ticketData,
      reviewData,
      images: selectedImages,
    });
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Images</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Image Generation Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Generate AI Image</Text>
          <Text style={styles.sectionDescription}>
            Describe the image you want to generate
          </Text>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateAIImage}
          >
            <Text style={styles.generateButtonText}>
              🎨 Generate AI Image
            </Text>
          </TouchableOpacity>
        </View>

                  {/* Upload Images Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload Photos</Text>
            <Text style={styles.sectionDescription}>
              Add photos from your gallery ({selectedImages.length}/5)
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                selectedImages.length >= 5 && styles.uploadButtonDisabled,
              ]}
              onPress={handleImagePicker}
              disabled={selectedImages.length >= 5}
            >
              <Text style={styles.uploadButtonText}>
                📷 Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>

        {/* Selected Images */}
        {selectedImages.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Selected Images ({selectedImages.length})
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {selectedImages.map((imageUri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.selectedImage}
                  />
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
            selectedImages.length === 0 && styles.finishButtonDisabled,
          ]}
          onPress={handleFinish}
          disabled={selectedImages.length === 0}
        >
          <Text
            style={[
              styles.finishButtonText,
              selectedImages.length === 0 && styles.finishButtonTextDisabled,
            ]}
          >
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
  generateButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
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
