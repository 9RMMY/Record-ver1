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
  Modal,
} from 'react-native';
import { useAtom } from 'jotai';
import { addTicketAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTicketPageProps {
  navigation: any;
  route?: {
    params?: {
      isFirstTicket?: boolean;
      fromEmptyState?: boolean;
      fromAddButton?: boolean;
    };
  };
}

const AddTicketPage: React.FC<AddTicketPageProps> = ({ navigation, route }) => {
  const [, addTicket] = useAtom(addTicketAtom);
  
  // 라우트 파라미터 추출
  const isFirstTicket = route?.params?.isFirstTicket || false;
  const fromEmptyState = route?.params?.fromEmptyState || false;
  const fromAddButton = route?.params?.fromAddButton || false;

  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'updatedAt' | 'status'>>({
    title: '',
    artist: '',
    place: '',
    performedAt: new Date(),
    bookingSite: '',
    createdAt: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBookingSiteModal, setShowBookingSiteModal] = useState(false);
  const [customBookingSite, setCustomBookingSite] = useState('');
  
  const bookingSiteOptions = ['인터파크', '예스24', '멜론티켓', '직접작성'];

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

  const handleBookingSiteSelect = (site: string) => {
    if (site === '직접작성') {
      setCustomBookingSite('');
    } else {
      setFormData(prev => ({ ...prev, bookingSite: site }));
      setShowBookingSiteModal(false);
    }
  };

  const handleCustomBookingSiteSubmit = () => {
    if (customBookingSite.trim()) {
      setFormData(prev => ({ ...prev, bookingSite: customBookingSite.trim() }));
      setShowBookingSiteModal(false);
      setCustomBookingSite('');
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.artist.trim() || !formData.place.trim() || !formData.bookingSite.trim()) {
      Alert.alert('Error', '모든 항목을 채워주세요');
      return;
    }

    navigation.navigate('ReviewOptions', { ticketData: formData });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      place: '',
      performedAt: new Date(),
      bookingSite: '',
      createdAt: new Date(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Ticket</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 컨텍스트 메시지 */}
      {(fromEmptyState || fromAddButton) && (
        <View style={styles.contextMessage}>
          <Text style={styles.contextTitle}>공연 정보 입력하기</Text>
          <Text style={styles.contextSubtitle}>
            관람하신 공연의 정보를 입력해주세요.
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* 제목 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>공연 제목 *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={value => handleInputChange('title', value)}
              placeholder="예: Live Club Day"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 아티스트 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>아티스트 *</Text>
            <TextInput
              style={styles.input}
              value={formData.artist}
              onChangeText={value => handleInputChange('artist', value)}
              placeholder="예: 실리카겔"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 장소 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>공연장 *</Text>
            <TextInput
              style={styles.input}
              value={formData.place}
              onChangeText={value => handleInputChange('place', value)}
              placeholder="예: KT&G 상상마당, 무신사개러지"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 공연 날짜 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>공연 날짜 *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.performedAt.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
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

          {/* 예매처
          <View style={styles.inputGroup}>
            <Text style={styles.label}>예매처 *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowBookingSiteModal(true)}
            >
              <Text style={[
                styles.dropdownButtonText,
                !formData.bookingSite && styles.dropdownPlaceholder
              ]}>
                {formData.bookingSite || '예매처를 선택해주세요'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
          */}

        </View>
      </ScrollView>

      {/* 푸터 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            다음
          </Text>
        </TouchableOpacity>
      </View>

      {/* 예매처 선택 모달 (뮤지컬 only)
      <Modal
        visible={showBookingSiteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBookingSiteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>예매처 선택</Text>

            {bookingSiteOptions.map((site, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => handleBookingSiteSelect(site)}
              >
                <Text style={styles.modalOptionText}>{site}</Text>
              </TouchableOpacity>
            ))}

            {formData.bookingSite === '직접작성' || customBookingSite ? (
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  value={customBookingSite}
                  onChangeText={setCustomBookingSite}
                  placeholder="예매처를 직접 입력해주세요"
                  placeholderTextColor="#BDC3C7"
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.customSubmitButton}
                  onPress={handleCustomBookingSiteSubmit}
                >
                  <Text style={styles.customSubmitButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBookingSiteModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      */}

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
  backButtonText: { fontSize: 20, color: '#2C3E50', fontWeight: 'bold' },

  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },

  placeholder: { width: 40 },
  content: { flex: 1 },
  formContainer: { padding: 24 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
  },
  dateButtonText: { fontSize: 16, color: '#2C3E50' },
  /*
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  dropdownPlaceholder: {
    color: '#BDC3C7',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#7F8C8D',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },

  customInputContainer: {
    marginTop: 16,
  },
  customInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 12,
  },

  customSubmitButton: {
    backgroundColor: '#B11515',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  customSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
*/

  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: { fontSize: 16, fontWeight: '600', color: '#7F8C8D' },
  
  submitButton: {
    flex: 2,
    backgroundColor: '#B11515',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },


  contextMessage: {
    backgroundColor: '#F8f8f8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  contextTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'left',
  },
  contextSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default AddTicketPage;
