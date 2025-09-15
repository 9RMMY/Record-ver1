/**
 * 메인 페이지 - 홈 화면
 * 현재 월의 티켓을 카드 형태로 보여주는 메인 화면
 * 좌우 스와이프로 티켓 간 이동 가능
 */
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
import { ticketsAtom, TicketStatus } from '../../atoms';
import { Ticket } from '../../types/ticket';
import TicketDetailModal from '../../components/TicketDetailModal';
import { isPlaceholderTicket } from '../../utils/isPlaceholder';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../../styles/designSystem';

// 메인 페이지 Props 타입 정의
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

  // 카드 스와이프 애니메이션을 위한 값들
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // 카드를 원래 위치로 되돌리는 함수
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

  // 스와이프 한계에 도달했을 때 바운스 효과 생성
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

  // 티켓 카드 클릭 시 상세 모달 열기
  const handleTicketPress = (ticket: Ticket) => {
    if (!ticket.id || !ticket.performedAt) return;
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

  // 필터 선택 처리
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

  // 실제 티켓만 필터링 (빈 카드 제외)
  const realTickets = tickets.filter(ticket => !isPlaceholderTicket(ticket));

  // 현재 월의 티켓만 필터링하고 날짜순 정렬
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

  // 화면에 표시할 티켓들 (현재 월 티켓이 없으면 빈 카드 표시)
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
            status: TicketStatus.PUBLIC,
            userId: 'placeholder',
            images: [],
            review: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPlaceholder: true,
          },
        ];

  const currentTicketIndexRef = useRef(0);

  useEffect(() => {
    currentTicketIndexRef.current = currentTicketIndex;
  }, [currentTicketIndex]);

  // 카드 스와이프 제스처 처리
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
        // 스와이프 임계값 설정
        const swipeThreshold = 80;
        const velocityThreshold = 0.3;
        const totalCards = displayTickets.length;
        const currentIndex = currentTicketIndexRef.current;

        // 스와이프 방향 판단
        const shouldSwipeRight =
          gestureState.dx > swipeThreshold ||
          (gestureState.dx > 30 && gestureState.vx > velocityThreshold);
        const shouldSwipeLeft =
          gestureState.dx < -swipeThreshold ||
          (gestureState.dx < -30 && gestureState.vx < -velocityThreshold);

        // 스와이프 방향에 따른 카드 이동 처리
        if (shouldSwipeRight) {
          if (currentIndex === 0) {
            createBounceEffect('left'); // 첫 번째 카드에서 더 이상 이동 불가
          } else {
            setCurrentTicketIndex(currentIndex - 1);
            resetCardPosition();
          }
        } else if (shouldSwipeLeft) {
          if (currentIndex === totalCards - 1) {
            createBounceEffect('right'); // 마지막 카드에서 더 이상 이동 불가
          } else {
            setCurrentTicketIndex(currentIndex + 1);
            resetCardPosition();
          }
        } else {
          resetCardPosition(); // 스와이프 임계값에 도달하지 않으면 원위치
        }
      },
    }),
  ).current;

  // 티켓 목록이 변경되었을 때 인덱스 조정
  useEffect(() => {
    if (currentTicketIndex >= displayTickets.length) {
      setCurrentTicketIndex(0);
    }
  }, [displayTickets.length, currentTicketIndex]);

  // 필터 변경 시 첫 번째 카드로 이동
  useEffect(() => {
    setCurrentTicketIndex(0);
    resetCardPosition();
  }, [selectedFilter]);

  // 현재 표시할 티켓과 빈 카드 여부 확인
  const currentTicket = displayTickets[currentTicketIndex] || displayTickets[0];
  const isPlaceholder = isPlaceholderTicket(currentTicket);

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
                    selectedFilter === '밴드' &&
                      styles.filterOptionSelectedBand,
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
                      styles.filterOptionSelectedMusical,
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
            한 달의 기록, 옆으로 넘기며 다시 만나보세요 ( ♪˶´・‎ᴗ・ `˶ ♪)
          </Text>
        </View>

        {/* 메인 콘텐츠 - 티켓 카드 영역 */}
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            {/* 페이지 인디케이터 - 여러 티켓이 있을 때만 표시 */}
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
                {/* 티켓 이미지 또는 플레이스홀더 */}
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

            {/* 공연 날짜 버튼 - 실제 티켓일 때만 표시 */}
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
  container: { flex: 1, backgroundColor: Colors.systemBackground },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.systemBackground,
    zIndex: 1,
  },
  headerTitle: { 
    ...Typography.title2, 
    fontWeight: '700', 
    color: Colors.label 
  },
  headerRight: { position: 'relative' },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondarySystemBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.systemGray5,
    ...Shadows.small,
  },
  filterButtonText: { 
    ...Typography.subheadline, 
    color: Colors.secondaryLabel, 
    marginRight: Spacing.xs 
  },
  filterArrow: { 
    fontSize: 10, 
    color: Colors.secondaryLabel 
  },

  filterDropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: Colors.systemBackground,
    borderRadius: BorderRadius.xl,
    minWidth: 110,
    borderWidth: 0.5,
    borderColor: Colors.systemGray5,
    ...Shadows.large,
    zIndex: 1000,
  },
  filterOption: { 
    paddingHorizontal: Spacing.lg, 
    paddingVertical: Spacing.md 
  },
  filterOptionSelectedBand: {
    backgroundColor: Colors.secondarySystemBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  filterOptionSelectedMusical: {
    backgroundColor: Colors.secondarySystemBackground,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  filterOptionText: { 
    ...Typography.subheadline, 
    color: Colors.label, 
    textAlign: 'center' 
  },
  filterOptionTextSelected: { 
    color: Colors.primary, 
    fontWeight: '600' 
  },

  subHeader: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.systemBackground,
  },
  monthTitle: {
    ...Typography.title1,
    fontWeight: 'bold',
    color: Colors.label,
    marginBottom: Spacing.sm,
  },
  monthSubtitle: { 
    ...Typography.subheadline, 
    color: Colors.secondaryLabel, 
    lineHeight: 20 
  },

  contentContainer: { 
    flex: 1, 
    paddingTop: Spacing.xxxl, 
    paddingHorizontal: Spacing.screenPadding 
  },
  cardContainer: { alignItems: 'center', flex: 1 },

  indicatorContainer: { marginBottom: Spacing.md },
  indicatorText: { 
    ...Typography.subheadline, 
    color: Colors.secondaryLabel, 
    fontWeight: '500' 
  },

  animatedCard: { alignItems: 'center' },
  mainTicketCard: {
    width: width - 80,
    height: (width - 80) * 1.3,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.systemGray6,
    shadowColor: Colors.label,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  mainTicketCardNoImage: {
    backgroundColor: '#FFEBEE',
    borderWidth: 0.5,
    borderColor: Colors.systemRed,
  },
  disabledCard: { opacity: 0.75 },
  mainTicketImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mainTicketPlaceholder: {
    flex: 1,
    backgroundColor: Colors.systemGray6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: { 
    ...Typography.callout, 
    color: Colors.secondaryLabel, 
    fontWeight: '500' 
  },

  dateButtonContainer: { 
    marginTop: Spacing.lg, 
    alignItems: 'center' 
  },
  dateButton: {
    backgroundColor: Colors.secondarySystemBackground,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.systemGray5,
    ...Shadows.small,
  },
  dateButtonText: { 
    ...Typography.subheadline, 
    color: Colors.label, 
    fontWeight: '500' 
  },
});

export default MainPage;
