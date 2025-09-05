import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';
import { isPlaceholderTicket } from '../utils/isPlaceholder';

interface MainPageProps {
  navigation: any;
}

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

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  // 애니메이션 값들
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleTicketPress = (ticket: Ticket) => {
    if (!ticket.id || !ticket.performedAt) return;
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // 날짜 관련 함수
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getMonth() + 1}월`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  // 필터 선택 핸들러
  const handleFilterSelect = (filter: '밴드' | '연극/뮤지컬') => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // 실제 티켓만 필터링 (placeholder 제외)
  const realTickets = tickets.filter(ticket => !isPlaceholderTicket(ticket));

  // 표시할 티켓들 (실제 티켓이 없으면 placeholder 하나만)
  const displayTickets: Ticket[] =
    realTickets.length > 0
      ? realTickets
      : [
          {
            id: '',
            title: '',
            artist: '',
            place: '',
            performedAt: undefined as any,
            bookingSite: '',
            status: '공개' as const,
            images: [],
            review: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

  // 다음/이전 티켓으로 이동
  const goToNextTicket = () => {
    if (currentTicketIndex < displayTickets.length - 1) {
      setCurrentTicketIndex(currentTicketIndex + 1);
      resetCardPosition();
    }
  };

  const goToPrevTicket = () => {
    if (currentTicketIndex > 0) {
      setCurrentTicketIndex(currentTicketIndex - 1);
      resetCardPosition();
    }
  };

  // 카드 위치 리셋
  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 팬 제스처 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 수평으로 크게 움직일 때만 스와이프 처리
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // 👉 오른쪽 스와이프
          if (currentTicketIndex < displayTickets.length - 1) {
            goToNextTicket(); // 오른쪽으로 넘기면 다음 티켓
          } else {
            resetPosition();
          }
        } else if (gestureState.dx < -50) {
          // 👉 왼쪽 스와이프
          if (currentTicketIndex > 0) {
            goToPrevTicket(); // 왼쪽으로 넘기면 이전 티켓
          } else {
            resetPosition();
          }
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  // 현재 티켓
  const currentTicket = displayTickets[currentTicketIndex];
  const isPlaceholder = isPlaceholderTicket(currentTicket);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
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

        {/* Sub Header */}
        <View style={styles.subHeader}>
          <Text style={styles.monthTitle}>
            {getCurrentMonth()}에 관람한 공연
          </Text>
          <Text style={styles.monthSubtitle}>
            한 달의 기록, 카드를 좌우로 넘기며 다시 만나보세요!
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            {/* 스와이프 가능한 카드 */}
            <Animated.View
              style={[
                styles.animatedCard,
                {
                  transform: pan.getTranslateTransform(),
                  opacity: opacity,
                },
              ]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity
                disabled={isPlaceholder}
                style={[
                  styles.mainTicketCard,
                  isPlaceholder && styles.disabledCard,
                ]}
                onPress={() => handleTicketPress(currentTicket)}
                activeOpacity={isPlaceholder ? 1 : 0.7}
              >
                {currentTicket.images && currentTicket.images.length > 0 ? (
                  <Image
                    source={{ uri: currentTicket.images[0] }}
                    style={styles.mainTicketImage}
                  />
                ) : (
                  <View style={styles.mainTicketPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {isPlaceholder
                        ? '새 티켓을 추가해보세요!'
                        : '이미지 없음'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* 날짜 버튼 */}
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
        </View>

        {selectedTicket && (
          <TicketDetailModal
            visible={modalVisible}
            ticket={selectedTicket}
            onClose={handleCloseModal}
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  cardContainer: {
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    alignItems: 'center',
  },
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
  disabledCard: {
    opacity: 0.5,
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
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonText: { fontSize: 14, color: '#2C3E50', fontWeight: '500' },
});

export default MainPage;
