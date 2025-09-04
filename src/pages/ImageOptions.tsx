import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  ActionSheetIOS,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  launchImageLibrary,
  launchCamera,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

type RootStackParamList = {
  ImageOptions: { ticketData: any; reviewData: any };
  AIImageSettings: { ticketData: any; reviewData: any; images?: string[] };
  TicketComplete: { ticketData: any; reviewData: any; images?: string[] };
};

type ImageOptionsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ImageOptions'
>;
type ImageOptionsRouteProp = RouteProp<RootStackParamList, 'ImageOptions'>;

const ImageOptions = () => {
  const navigation = useNavigation<ImageOptionsNavigationProp>();
  const route = useRoute<ImageOptionsRouteProp>();
  const { ticketData, reviewData } = route.params;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // AI 이미지 생성 페이지 이동
  const handleAIImageSelect = () => {
    navigation.navigate('AIImageSettings', {
      ticketData,
      reviewData,
      images: [],
    });
  };

  // 갤러리에서 선택 (데모용)
  const handleGallerySelect = () => {
    /*
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
        selectionLimit: 1,
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error(response.errorMessage);
          return;
        }

        const asset: Asset | undefined = response.assets?.[0];
        if (asset?.uri) {
          navigation.navigate('TicketComplete', {
            ticketData,
            reviewData,
            images: [asset.uri],
          });
        }
      });
    */
    const demoImage = 'https://placekitten.com/800/800'; // 데모 이미지
    setSelectedImage(demoImage);
  };

  // 카메라 또는 갤러리 선택 UI (iOS ActionSheet, Android는 갤러리 바로)
  const handleGalleryOrCameraSelect = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '사진 찍기', '사진 보관함에서 선택'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            // 카메라
            launchCamera(
              {
                mediaType: 'photo',
                maxHeight: 2000,
                maxWidth: 2000,
                quality: 0.8,
              },
              response => {
                const asset: Asset | undefined = response.assets?.[0];
                if (asset?.uri) setSelectedImage(asset.uri);
              },
            );
          } else if (buttonIndex === 2) {
            // 갤러리
            handleGallerySelect();
          }
        },
      );
    } else {
      // Android는 바로 데모 이미지 선택
      handleGallerySelect();
    }
  };

  // 다음 화면으로 이동
  const handleNext = () => {
    if (!selectedImage) return;
    navigation.navigate('TicketComplete', {
      ticketData,
      reviewData,
      images: [selectedImage],
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
        <Text style={styles.headerTitle}>Image Options</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>티켓 이미지 선택하기</Text>
        <Text style={styles.subtitle}>
          기억에 남는 장면을 이미지로 표현해보세요!
        </Text>

        <View style={styles.optionsContainer}>
          {/* AI 이미지 */}
          <TouchableOpacity
            style={[styles.optionButton, styles.AIImageButton]}
            onPress={handleAIImageSelect}
          >
            <Image
              source={require('../assets/mic.png')}
              style={styles.buttonIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.optionButtonText}>AI 이미지</Text>
              <Text style={styles.optionButtonSubText}>
                AI가 만들어주는 나만의 티켓 이미지 ~
              </Text>
            </View>
          </TouchableOpacity>

          {/* 직접 선택하기 (갤러리/카메라 선택) */}
          <TouchableOpacity
            style={[styles.optionButton, styles.GalleryButton]}
            onPress={handleGalleryOrCameraSelect}
          >
            <Image
              source={require('../assets/mic.png')}
              style={styles.buttonIcon}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.optionButtonText, { color: '#000' }]}>
                직접 선택하기
              </Text>
              <Text style={[styles.optionButtonSubText, { color: '#000' }]}>
                사진 찍기 또는 사진 보관함에서 선택하세요.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 선택된 이미지 미리보기 */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>선택된 이미지:</Text>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          </View>
        )}

        {/* 다음 버튼 */}
        {selectedImage && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음으로</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50' },
  placeholder: { width: 40 },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },
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

  optionsContainer: { width: '100%', gap: 20,},
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  buttonIcon: { width: 100, height: 100, marginRight: 8 },
  AIImageButton: { backgroundColor: 'rgba(219, 88, 88, 1)', height: 140 },
  GalleryButton: { backgroundColor: '#ECF0F1', height: 140 },
  textContainer: { flexDirection: 'column' },

  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionButtonSubText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },

  // 미리보기 컨테이너 스타일 개선
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  nextButton: {
    backgroundColor: '#DB5858',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },

  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ImageOptions;
