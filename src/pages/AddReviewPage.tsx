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
  const [status, setStatus] = useState('공개'); // 기본값 공개
  const ticketData = route?.params?.ticketData;

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    // Navigate to AddImage page with review, ticket data, and status
    navigation.navigate('AddImage', { 
      ticketData: {
        ...ticketData,
        status, // 공개/비공개 설정 추가
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

          {/* Review Text Input */}
          <View style={styles.reviewContainer}>
            <Text style={styles.sectionTitle}>Your Review *</Text>
            <TextInput
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Share your experience about this performance..."
              placeholderTextColor="#BDC3C7"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {reviewText.length}/500 characters
            </Text>
          </View>

          {/* 공개/비공개 설정 */}
          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>공개 설정 *</Text>
            <View style={styles.statusButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === '공개' && styles.statusButtonActive,
                ]}
                onPress={() => setStatus('공개')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === '공개' && styles.statusButtonTextActive,
                  ]}
                >
                  공개
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === '비공개' && styles.statusButtonActive,
                ]}
                onPress={() => setStatus('비공개')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === '비공개' && styles.statusButtonTextActive,
                  ]}
                >
                  비공개
                </Text>
              </TouchableOpacity>
            </View>
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
              Submit Review
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8f8',
  },
  flex: {
    flex: 1,
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
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  ticketInfoContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ticketInfoTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  ticketDetails: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  reviewContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#B11515',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#7F8C8D',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  statusButtonActive: {
    backgroundColor: '#B11515',
    borderColor: '#B11515',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default AddReviewPage;
