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
  Platform,
} from 'react-native';
import { useAtom } from 'jotai';
import { addTicketAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTicketPageProps {
  navigation: any;
}

const AddTicketPage: React.FC<AddTicketPageProps> = ({ navigation }) => {
  const [, addTicket] = useAtom(addTicketAtom);

  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'updatedAt'>>({
    title: '',
    artist: '',
    place: '',
    performedAt: new Date(),
    bookingSite: '',
    status: '공개', // 기본값 공개
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, performedAt: selectedDate }));
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.artist.trim() || !formData.place.trim() || !formData.bookingSite.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Navigate to AddReview page with ticket data (don't save ticket yet)
    navigation.navigate('AddReview', { ticketData: formData });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      place: '',
      performedAt: new Date(),
      bookingSite: '',
      status: '공개',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Ticket</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* 제목 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter ticket title"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 아티스트 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Artist *</Text>
            <TextInput
              style={styles.input}
              value={formData.artist}
              onChangeText={(value) => handleInputChange('artist', value)}
              placeholder="Artist name"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 장소 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Place *</Text>
            <TextInput
              style={styles.input}
              value={formData.place}
              onChangeText={(value) => handleInputChange('place', value)}
              placeholder="Venue"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 공연 날짜 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Performed At *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.performedAt.toISOString().split('T')[0]}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.performedAt}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* 공개/비공개 토글 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === '공개' && styles.statusButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, status: '공개' }))}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === '공개' && styles.statusButtonTextActive,
                  ]}
                >
                  공개
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === '비공개' && styles.statusButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, status: '비공개' }))}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    formData.status === '비공개' && styles.statusButtonTextActive,
                  ]}
                >
                  비공개
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 예매처 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Booking Site *</Text>
            <TextInput
              style={styles.input}
              value={formData.bookingSite}
              onChangeText={(value) => handleInputChange('bookingSite', value)}
              placeholder="멜론티켓"
              placeholderTextColor="#BDC3C7"
            />
          </View>
        </View>
      </ScrollView>

      {/* 푸터 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECF0F1', justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 20, color: '#2C3E50', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  placeholder: { width: 40 },
  content: { flex: 1 },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 16, fontSize: 16, color: '#2C3E50' },
  dateButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 16 },
  dateButtonText: { fontSize: 16, color: '#2C3E50' },
  statusContainer: { flexDirection: 'row', gap: 10 },
  statusButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  statusButtonActive: { backgroundColor: '#3498DB', borderColor: '#3498DB' },
  statusButtonText: { fontSize: 16, color: '#2C3E50', fontWeight: '600' },
  statusButtonTextActive: { color: '#FFFFFF' },
  footer: { flexDirection: 'row', padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  resetButton: { flex: 1, backgroundColor: '#ECF0F1', borderRadius: 12, padding: 16, alignItems: 'center', marginRight: 8 },
  resetButtonText: { fontSize: 16, fontWeight: '600', color: '#7F8C8D' },
  submitButton: { flex: 2, backgroundColor: '#3498DB', borderRadius: 12, padding: 16, alignItems: 'center', marginLeft: 8 },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default AddTicketPage;
