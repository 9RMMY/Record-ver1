import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';

interface AddReviewPageProps {
  navigation: any;
  route?: {
    params?: {
      ticketData?: any;
    };
  };
}

const AddReviewPage: React.FC<AddReviewPageProps> = ({ navigation, route }) => {
  const [reviewText, setReviewText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const ticketData = route?.params?.ticketData;

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    // Navigate to ImageOptions page with review, ticket data, and status
    navigation.navigate('ImageOptions', { 
      ticketData: {
        ...ticketData,
        status: isPublic ? '공개' : '비공개',
      },
      reviewData: {
        reviewText,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Review Text Input + 공개/비공개 토글 */}
          <View style={styles.reviewContainer}>
            {/* 제목 + 토글 */}
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.sectionTitle}>Your Review *</Text>
              <View style={styles.toggleRow}>
                <Text style={styles.statusLabel}>{isPublic ? '공개' : '비공개'}</Text>
                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: '#BDC3C7', true: '#B11515' }}
                  thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                />
              </View>
            </View>

            {/* 입력창 */}
            <TextInput
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Share your experience about this performance..."
              placeholderTextColor="#BDC3C7"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.characterCount}>
              {reviewText.length}/1000 characters
            </Text>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!reviewText.trim()) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmitReview}
            disabled={!reviewText.trim()}
          >
            <Text style={[
              styles.submitButtonText,
              (!reviewText.trim()) && styles.submitButtonTextDisabled
            ]}>
              완료
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8f8' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, backgroundColor: '#F8F8f8',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECF0F1',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { fontSize: 20, color: '#2C3E50', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  placeholder: { width: 40 },
  content: { flex: 1 },
  reviewContainer: {
    backgroundColor: '#FFFFFF', marginHorizontal: 24, marginBottom: 20,
    padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, padding: 16, fontSize: 16, color: '#2C3E50', minHeight: 120,
  },
  characterCount: { fontSize: 12, color: '#7F8C8D', textAlign: 'right', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { fontSize: 14, fontWeight: '500', color: '#2C3E50', marginRight: 8 },
  footer: {
    flexDirection: 'row', padding: 20, backgroundColor: '#F8f8f8',
  },
  cancelButton: {
    flex: 1, backgroundColor: '#ECF0F1', borderRadius: 12, padding: 16,
    alignItems: 'center', marginRight: 8,
  },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#7F8C8D' },
  submitButton: {
    flex: 2, backgroundColor: '#B11515', borderRadius: 12, padding: 16,
    alignItems: 'center', marginLeft: 8,
  },
  submitButtonDisabled: { backgroundColor: '#BDC3C7' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  submitButtonTextDisabled: { color: '#7F8C8D' },
});

export default AddReviewPage;
