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
  FlatList,
} from 'react-native';
import { useAtom } from 'jotai';
import { addTicketAtom, TicketStatus, CreateTicketData } from '../../atoms';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputMethodModal from '../../components/InputMethodModal';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentStyles,
} from '../../styles/designSystem';

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

  // 입력 방법 선택 모달 상태
  const [showInputMethodModal, setShowInputMethodModal] = useState(true);

  // 공연 시간 초기값
  const getDefaultPerformanceTime = () => {
    const defaultDate = new Date();
    defaultDate.setHours(19, 0, 0, 0);
    return defaultDate;
  };

  const [formData, setFormData] = useState<CreateTicketData>({
    title: '',
    artist: '',
    place: '',
    performedAt: getDefaultPerformanceTime(),
    bookingSite: '',
    genre: '밴드',
    status: TicketStatus.PUBLIC,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const genreOptions = [
    { label: '밴드', value: '밴드' },
    { label: '연극/뮤지컬', value: '연극/뮤지컬' },
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        performedAt: selectedDate,
      }));
    }
  };

  const showDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요');
      return;
    }

    if (!formData.genre || !formData.genre.trim()) {
      Alert.alert('오류', '장르를 선택해주세요');
      return;
    }

    navigation.navigate('AddReview', { ticketData: formData });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 입력 방법 선택 모달 */}
      <InputMethodModal
        visible={showInputMethodModal}
        onClose={() => navigation.goBack()}
        onSelectManual={() => setShowInputMethodModal(false)}
      />
      {/* 헤더 */}{' '}
      <View style={styles.header}>
        {' '}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {' '}
          <Text style={styles.backButtonText}>←</Text>{' '}
        </TouchableOpacity>{' '}
        <Text style={styles.headerTitle}>공연 정보 입력하기</Text>{' '}
        <TouchableOpacity onPress={handleSubmit}>
          {' '}
          <Text style={styles.nextButtonText}>다음</Text>{' '}
        </TouchableOpacity>{' '}
      </View>
      {/* 컨텍스트 메시지 */}
      {(fromEmptyState || fromAddButton) && (
        <View style={styles.contextMessage}>
          <Text style={styles.contextSubtitle}>
            관람하신 공연의 정보를 입력해주세요.{'\n'}
            같은 제목의 티켓을 등록하면 다회차 인증마크가 부여됩니다.
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
            <Text style={styles.label}>아티스트</Text>
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
            <Text style={styles.label}>공연장</Text>
            <TextInput
              style={styles.input}
              value={formData.place}
              onChangeText={value => handleInputChange('place', value)}
              placeholder="예: KT&G 상상마당, 무신사개러지"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 장르 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>장르 *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowGenreModal(true)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !formData.genre && { color: '#BDC3C7' },
                ]}
              >
                {formData.genre
                  ? genreOptions.find(opt => opt.value === formData.genre)
                      ?.label
                  : '밴드'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 장르 선택 모달 */}
          <Modal
            transparent
            visible={showGenreModal}
            animationType="fade"
            onRequestClose={() => setShowGenreModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressOut={() => setShowGenreModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>장르 선택</Text>
                <FlatList
                  data={genreOptions}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={() => {
                        handleInputChange('genre', item.value);
                        setShowGenreModal(false);
                      }}
                    >
                      <Text style={styles.modalOptionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* 공연 날짜 및 시간 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>공연 일시 *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showDateTimePicker}
              >
                <Text style={styles.dateButtonText}>
                  {formData.performedAt.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  {formData.performedAt.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && Platform.OS === 'ios' && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={formData.performedAt}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                  />
                </View>
              )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondarySystemBackground },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
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
    fontWeight: '500',
  },
  headerTitle: { ...Typography.headline, color: Colors.label },
  nextButtonText: {
    ...Typography.body,
    color: '#B11515',
  },

  contextMessage: {
    backgroundColor: Colors.secondarySystemBackground,
    paddingHorizontal: Spacing.sectionSpacing,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.systemGray5,
  },
  contextSubtitle: {
    ...Typography.footnote,
    color: Colors.secondaryLabel,
    textAlign: 'left',
    lineHeight: 20,
  },

  content: { flex: 1 },
  formContainer: { padding: Spacing.sectionSpacing },
  inputGroup: { marginBottom: Spacing.sectionSpacing },
  label: {
    ...Typography.callout,
    fontWeight: '500',
    color: Colors.label,
    marginBottom: Spacing.sm,
  },
  input: {
    ...ComponentStyles.input,
  },

  dropdownButton: {
    backgroundColor: Colors.systemBackground,
    borderWidth: 1,
    borderColor: Colors.systemGray5,
    borderRadius: BorderRadius.md,
    padding: Spacing.inputPadding,
  },
  dropdownButtonText: {
    ...Typography.body,
    color: Colors.label,
  },

  // 장르 선택 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.systemBackground,
    borderRadius: BorderRadius.lg,
    padding: 20,
    width: '70%',
  },
  modalTitle: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
  },
  modalOptionText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.label,
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
    color: Colors.label,
  },
  datePickerContainer: {
  borderRadius: BorderRadius.sm,
  marginTop: 6, // 버튼과 picker 사이 간격
  paddingVertical: 4, // picker 주변 패딩
  paddingHorizontal: 6,
  backgroundColor: Colors.systemBackground,
  borderWidth: 1,
  borderColor: Colors.systemGray5,
  ...Shadows.small,
},

});

export default AddTicketPage;
