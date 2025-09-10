import React, { useState, useRef, useEffect } from 'react';
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

  // 애니메이션 값들
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // 카드 위치 리셋 함수
  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 바운스 효과
  const createBounceEffect = (direction: 'left' | 'right') => {
    const bounceDistance = direction === 'left' ? -30 : 30;

    Animated.sequence([
      Animated.timing(pan, {
        toValue: { x: bounceDistance, y: 0 },
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        tension: 300,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleTicketPress = (ticket: Ticket) => {
    if (!ticket.id || !ticket.performedAt) return;
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

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

  const handleFilterSelect = (filter: '밴드' | '연극/뮤지컬') => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const getCurrentMonthNumber = () => {
    const now = new Date();
    return now.getMonth();
  };

  const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear();
  };

  // 실제 티켓만 필터링 (placeholder 제외)
  const realTickets = tickets.filter(ticket => !isPlaceholderTicket(ticket));

  // 현재 월의 티켓만 필터링
  const currentMonthTickets = realTickets
    .filter(ticket => {
      const ticketDate = new Date(ticket.performedAt);
      return (
        ticketDate.getMonth() === getCurrentMonthNumber() &&
        ticketDate.getFullYear() === getCurrentYear()
      );
    })
    .sort((a, b) => {
      return (
        new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime()
      );
    });

  // 표시할 티켓들 (현재 월 티켓이 없으면 placeholder 하나만)
  const displayTickets: Ticket[] =
    currentMonthTickets.length > 0
      ? currentMonthTickets
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

  const currentTicketIndexRef = useRef(0);

  useEffect(() => {
    currentTicketIndexRef.current = currentTicketIndex;
  }, [currentTicketIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 80;
        const velocityThreshold = 0.3;
        const totalCards = displayTickets.length;
        const currentIndex = currentTicketIndexRef.current;

        const shouldSwipeRight =
          gestureState.dx > swipeThreshold ||
          (gestureState.dx > 30 && gestureState.vx > velocityThreshold);
        const shouldSwipeLeft =
          gestureState.dx < -swipeThreshold ||
          (gestureState.dx < -30 && gestureState.vx < -velocityThreshold);

        if (shouldSwipeRight) {
          if (currentIndex === 0) {
            createBounceEffect('left');
          } else {
            setCurrentTicketIndex(currentIndex - 1);
            resetCardPosition();
          }
        } else if (shouldSwipeLeft) {
          if (currentIndex === totalCards - 1) {
            createBounceEffect('right');
          } else {
            setCurrentTicketIndex(currentIndex + 1);
            resetCardPosition();
          }
        } else {
          resetCardPosition();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (currentTicketIndex >= displayTickets.length) {
      setCurrentTicketIndex(0);
    }
  }, [displayTickets.length, currentTicketIndex]);

  useEffect(() => {
    setCurrentTicketIndex(0);
    resetCardPosition();
  }, [selectedFilter]);

  const currentTicket = displayTickets[currentTicketIndex] || displayTickets[0];
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
            한 달의 기록, 옆으로 넘기며 다시 만나보세요 ( ♪˶´・‎ᴗ・ `˶ ♪)
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            {displayTickets.length > 1 && !isPlaceholder && (
              <View style={styles.indicatorContainer}>
                <Text style={styles.indicatorText}>
                  {currentTicketIndex + 1} / {displayTickets.length}
                </Text>
              </View>
            )}

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
                  !isPlaceholder &&
                    (!currentTicket.images ||
                      currentTicket.images.length === 0) &&
                    styles.mainTicketCardNoImage,
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
    zIndex: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#000000' },
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
    zIndex: 1000,
  },
  filterOption: { paddingHorizontal: 16, paddingVertical: 12 },
  filterOptionSelected: { backgroundColor: '#F2F2F7' },
  filterOptionText: { fontSize: 15, color: '#3C3C43' },
  filterOptionTextSelected: { color: '#B11515', fontWeight: '600' },

  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  monthSubtitle: { fontSize: 14, color: '#666666', lineHeight: 20 },

  contentContainer: { flex: 1, paddingTop: 30, paddingHorizontal: 20 },
  cardContainer: { alignItems: 'center', flex: 1 },

  indicatorContainer: { marginBottom: 10 },
  indicatorText: { fontSize: 14, color: '#666666', fontWeight: '500' },

  animatedCard: { alignItems: 'center' },
  mainTicketCard: {
    width: width - 80,
    height: (width - 80) * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  mainTicketCardNoImage: {
    backgroundColor: '#FFEBEE',
    borderWidth: 0.5,
    borderColor: '#FF3B30',
  },
  disabledCard: { opacity: 0.75 },
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
  },
  dateButtonText: { fontSize: 14, color: '#2C3E50', fontWeight: '500' },
});

export default MainPage;
