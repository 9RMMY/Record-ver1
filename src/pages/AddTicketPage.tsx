import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useAtom } from 'jotai';
import { addTicketAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/designSystem';

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

  // 공연 시간 초기값을 오늘 오후 7시로 설정
  const getDefaultPerformanceTime = () => {
    const defaultDate = new Date();
    defaultDate.setHours(19, 0, 0, 0); // 오후 7시로 설정
    return defaultDate;
  };

  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'updatedAt' | 'status'>>({
    title: '',
    artist: '',
    place: '',
    performedAt: getDefaultPerformanceTime(),
    bookingSite: '',
    createdAt: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time'>('date');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      setFormData(prev => ({ ...prev, performedAt: selectedDate }));
      
      // Android에서 날짜 선택 후 시간 선택 모드로 전환
      if (Platform.OS === 'android' && dateTimeMode === 'date') {
        setTimeout(() => {
          setDateTimeMode('time');
          setShowTimePicker(true);
        }, 100);
      }
    }
  };

  const showDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      // Android에서는 먼저 날짜를 선택하고 그 다음 시간을 선택
      setDateTimeMode('date');
      setShowDatePicker(true);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', '제목을 입력해주세요');
      return;
    }

    navigation.navigate('ReviewOptions', { ticketData: formData });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      place: '',
      performedAt: getDefaultPerformanceTime(),
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

          {/* 공연 날짜 및 시간 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>공연 날짜 및 시간 *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDateTimePicker}
            >
              <Text style={styles.dateButtonText}>
                {formData.performedAt.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} {formData.performedAt.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </TouchableOpacity>
            
            {/* iOS에서는 datetime 모드 사용 */}
            {showDatePicker && Platform.OS === 'ios' && (
              <DateTimePicker
                value={formData.performedAt}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            {/* Android에서는 날짜 선택 */}
            {showDatePicker && Platform.OS === 'android' && dateTimeMode === 'date' && (
              <DateTimePicker
                value={formData.performedAt}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            {/* Android에서는 시간 선택 */}
            {showTimePicker && Platform.OS === 'android' && dateTimeMode === 'time' && (
              <DateTimePicker
                value={formData.performedAt}
                mode="time"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondarySystemBackground },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.screenPadding,
    backgroundColor: Colors.systemBackground,
    ...Shadows.small,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  backButtonText: { 
    ...Typography.title3, 
    color: Colors.label, 
    fontWeight: 'bold' 
  },

  headerTitle: { 
    ...Typography.title3, 
    fontWeight: 'bold', 
    color: Colors.label 
  },

  placeholder: { width: 40 },
  content: { flex: 1 },
  formContainer: { padding: Spacing.sectionSpacing },
  inputGroup: { marginBottom: Spacing.sectionSpacing },
  label: { 
    ...Typography.callout, 
    fontWeight: '600', 
    color: Colors.label, 
    marginBottom: Spacing.sm 
  },
  input: {
    ...ComponentStyles.input,
  },
  dateButton: {
    backgroundColor: Colors.systemBackground,
    borderWidth: 1,
    borderColor: Colors.systemGray5,
    borderRadius: BorderRadius.md,
    padding: Spacing.inputPadding,
    ...Shadows.small,
  },
  dateButtonText: { 
    ...Typography.body, 
    color: Colors.label 
  },
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
    padding: Spacing.screenPadding,
    backgroundColor: Colors.systemBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.systemGray5,
    shadowColor: Colors.label,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButton: {
    ...ComponentStyles.secondaryButton,
    flex: 1,
    marginRight: Spacing.sm,
  },
  resetButtonText: { 
    ...Typography.callout, 
    fontWeight: '600', 
    color: Colors.secondaryLabel 
  },
  
  submitButton: {
    ...ComponentStyles.primaryButton,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  
  nextButton: {
    ...ComponentStyles.primaryButton,
    flex: 1,
  },
  submitButtonText: { 
    ...Typography.callout, 
    fontWeight: '600', 
    color: Colors.systemBackground 
  },


  contextMessage: {
    backgroundColor: Colors.secondarySystemBackground,
    paddingHorizontal: Spacing.sectionSpacing,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.systemGray5,
  },
  contextTitle: {
    ...Typography.title1,
    fontWeight: 'bold',
    color: Colors.label,
    marginBottom: Spacing.xs,
    textAlign: 'left',
  },
  contextSubtitle: {
    ...Typography.subheadline,
    color: Colors.secondaryLabel,
    textAlign: 'left',
    lineHeight: 20,
  },
});

export default AddTicketPage;
