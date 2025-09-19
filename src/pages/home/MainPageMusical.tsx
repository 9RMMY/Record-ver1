/**
 * 뮤지컬 메인 페이지 - 홈 화면 (뮤지컬 버전)
 * 티켓을 단일 카드 형태로 보여주는 메인 화면
 * 스와이프 기능 없이 단순한 카드 표시
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom, TicketStatus } from '../../atoms';
import { Ticket } from '../../types/ticket';
import TicketDetailModal from '../../components/TicketDetailModal';
import { isPlaceholderTicket } from '../../utils/isPlaceholder';

// 뮤지컬 메인 페이지 Props 타입 정의
interface MainPageProps {
  navigation: any;
}

// 화면 너비 가져오기
const { width } = Dimensions.get('window');

const MainPage: React.FC<MainPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tickets] = useAtom(ticketsAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'밴드' | '연극/뮤지컬'>(
    '밴드',
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  // 티켓 카드 클릭 시 상세 모달 열기
  const handleTicketPress = (ticket: Ticket) => {
    if (!ticket.id || !ticket.performedAt) return; // 빈 카드나 날짜 없는 카드는 모달 열리지 않음
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  // 티켓 상세 모달 닫기
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // 현재 월을 한국어 형식으로 반환
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getMonth() + 1}월`;
  };

  // 날짜를 한국어 형식으로 포맷팅
  const formatDate = (date?: Date) => {
    if (!date) return '';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  // 필터 선택 처리 (밴드/뮤지컬 분기)
  const handleFilterSelect = (filter: '밴드' | '연극/뮤지컬') => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // 화면에 표시할 티켓들 (티켓이 없으면 빈 카드 표시)
  const displayTickets: Ticket[] =
    tickets.length > 0 // 티켓이 있으면 그대로 표시
      ? tickets
      : [
          {
            id: '', // 빈 카드 표시용
            title: '',
            artist: '',
            place: '',
            performedAt: undefined as any,
            bookingSite: '',
            status: TicketStatus.PUBLIC,
            userId: 'placeholder',
            images: [],
            review: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPlaceholder: true,
          },
        ];

  // 메인 티켓 카드 렌더링 함수
  const renderMainTicket = () => {
    const currentTicket = displayTickets[currentTicketIndex];
    const isPlaceholder = isPlaceholderTicket(currentTicket);

    return (
      <View style={styles.mainTicketContainer}>
        <TouchableOpacity
          disabled={isPlaceholder}
          style={[
            styles.mainTicketCard, 
            isPlaceholder && styles.disabledCard,
            !isPlaceholder && (!currentTicket.images || currentTicket.images.length === 0) && styles.mainTicketCardNoImage,
          ]}
          onPress={() => handleTicketPress(currentTicket)}
          activeOpacity={isPlaceholder ? 1 : 0.7}
        >
          {/* 티켓 이미지 또는 플레이스홀더 */}
          {currentTicket.images && currentTicket.images.length > 0 ? (
            <Image
              source={{ uri: currentTicket.images[0] }}
              style={styles.mainTicketImage}
            />
          ) : (
            <View style={styles.mainTicketPlaceholder}>
              <Text style={styles.placeholderText}>
                {isPlaceholder ? '새 티켓을 추가해보세요!' : '이미지 없음'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 공연 날짜 버튼 - 실제 티켓이고 날짜가 있을 때만 표시 */}
        {!isPlaceholder && currentTicket.performedAt && (
          <View style={styles.dateButtonContainer}>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>
                {formatDate(currentTicket.performedAt)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 상단 헤더 - 앱 제목과 필터 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Re:cord</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Text style={styles.filterButtonText}>{selectedFilter}</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>

            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === '밴드' && styles.filterOptionSelected,
                  ]}
                  onPress={() => handleFilterSelect('밴드')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === '밴드' &&
                        styles.filterOptionTextSelected,
                    ]}
                  >
                    밴드
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === '연극/뮤지컬' &&
                      styles.filterOptionSelected,
                  ]}
                  onPress={() => handleFilterSelect('연극/뮤지컬')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === '연극/뮤지컬' &&
                        styles.filterOptionTextSelected,
                    ]}
                  >
                    연극/뮤지컬
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 서브 헤더 - 월별 제목과 설명 */}
        <View style={styles.subHeader}>
          <Text style={styles.monthTitle}>
            {getCurrentMonth()}에 관람한 공연
          </Text>
          <Text style={styles.monthSubtitle}>
            한 달의 기록, 옆으로 넘기며 다시 만나보세요!
          </Text>
        </View>

        {/* 메인 콘텐츠 - 티켓 카드 영역 */}
        <View style={styles.contentContainer}>{renderMainTicket()}</View>

        {/* 티켓 상세 모달 */}
        {selectedTicket && (
          <TicketDetailModal
            visible={modalVisible}
            ticket={selectedTicket}
            onClose={handleCloseModal}
            isMine={true}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000000' },
  headerRight: { position: 'relative' },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: { fontSize: 14, color: '#666666', marginRight: 4 },
  filterArrow: { fontSize: 10, color: '#666666' },
  filterDropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 140,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
  },
  filterOption: { paddingHorizontal: 16, paddingVertical: 12 },
  filterOptionSelected: { backgroundColor: '#F2F2F7' },
  filterOptionText: { fontSize: 15, color: '#3C3C43' },
  filterOptionTextSelected: { color: '#007AFF', fontWeight: '600' },
  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  monthSubtitle: { fontSize: 14, color: '#666666', lineHeight: 20 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  mainTicketContainer: { alignItems: 'center' },
  mainTicketCard: {
    width: width - 80,
    height: (width - 80) * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#8FBC8F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  mainTicketCardNoImage: {
    backgroundColor: '#FFEBEE',
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  disabledCard: {
    opacity: 0.5, // 빈 카드일 때 흐리게 표시
  },
  mainTicketImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mainTicketPlaceholder: {
    flex: 1,
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: { fontSize: 16, color: '#666666', fontWeight: '500' },
  dateButtonContainer: { marginTop: 16, alignItems: 'center' },
  dateButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: { fontSize: 14, color: '#333333', fontWeight: '500' },
});

export default MainPage;
