import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PagerView from 'react-native-pager-view';
import TicketDetailModal from './TicketDetailModal';
import CustomCalendar from './CustomCalendar';
import EventsList from './EventsList';
import TicketGrid from './TicketGrid';
import { Ticket } from '../types/ticket';
import { useAtom } from 'jotai';
import { friendTicketsAtom } from '../atoms/friendsAtoms';
import { isPlaceholderTicket } from '../utils/isPlaceholder';

// ================== 더미 티켓 ==================
const dummyTickets: Ticket[] = [
  {
    id: 'dummy-1',
    title: '콘서트 - 인디 밴드 라이브',
    performedAt: new Date('2025-09-10T19:00:00'),
    status: '공개',
    place: '홍대 롤링홀',
    artist: '라쿠나',
    createdAt: new Date('2025-08-01T10:00:00'),
  },
  {
    id: 'dummy-2',
    title: '뮤지컬 - 캣츠',
    performedAt: new Date('2025-09-12T14:00:00'),
    status: '공개',
    place: '블루스퀘어 인터파크홀',
    artist: '뮤지컬 배우들',
    createdAt: new Date('2025-08-05T10:00:00'),
  },
  {
    id: 'dummy-3',
    title: '오페라 - 라 보엠',
    performedAt: new Date('2025-09-18T19:30:00'),
    status: '공개',
    place: '예술의전당 오페라극장',
    artist: '친구와 함께',
    createdAt: new Date('2025-08-10T10:00:00'),
  },
];

// ================== 퍼포먼스 데이터 ==================
interface PerformanceInfo {
  title: string;
  time: string;
  location: string;
}

type PerformanceData = {
  [date: string]: PerformanceInfo;
};

const performanceData: PerformanceData = {
  '2025-09-15': {
    title: '오페라 - 라 트라비아타',
    time: '19:30',
    location: '서울 예술의전당 오페라극장',
  },
  '2025-09-22': {
    title: '뮤지컬 - 레미제라블',
    time: '14:00',
    location: '블루스퀘어 인터파크홀',
  },
  '2025-10-05': {
    title: '콘서트 - 클래식 갈라쇼',
    time: '20:00',
    location: '롯데콘서트홀',
  },
};

// ================== 네비게이션 타입 ==================
type RootStackParamList = {
  FriendProfile: {
    friend: {
      id: string;
      name: string;
      username: string;
      avatar: string;
    };
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'FriendProfile'>;

// ================== 퍼포먼스 → 티켓 변환 함수 ==================
const convertToTicket = (
  date: string,
  performance: PerformanceInfo,
): Ticket => {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = performance.time.split(':').map(Number);
  const performedAt = new Date(year, month - 1, day, hours, minutes);

  return {
    id: `friend-${date}`,
    title: performance.title,
    performedAt,
    status: '공개',
    place: performance.location,
    artist: '친구와 함께',
    createdAt: new Date(),
  };
};

const { width } = Dimensions.get('window');

const FriendProfilePage: React.FC<Props> = ({ navigation, route }) => {
  const { friend } = route.params;
  const [allFriendTicketsData] = useAtom(friendTicketsAtom);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0],
  );
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
    null,
  );
  const [currentPage, setCurrentPage] = React.useState(0);

  const pagerRef = useRef<PagerView>(null);

  // 현재 친구의 티켓 데이터 가져오기
  const currentFriendTickets =
    allFriendTicketsData.find(data => data.friendId === friend.id)?.tickets ||
    [];
  const friendTickets =
    currentFriendTickets.length > 0 ? currentFriendTickets : dummyTickets;

  // 퍼포먼스 → 티켓 변환
  const performanceTickets: Ticket[] = Object.entries(performanceData).map(
    ([date, performance]) => convertToTicket(date, performance),
  );

  const allFriendTickets = [...friendTickets, ...performanceTickets];

  const realFriendTickets = allFriendTickets
    .filter(ticket => !isPlaceholderTicket(ticket))
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const selectedEvents = allFriendTickets.filter(
    ticket => formatDate(new Date(ticket.performedAt)) === selectedDate,
  );

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleTabPress = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    pagerRef.current?.setPage(pageIndex);
  };

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
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
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 프로필 + 탭 + PagerView */}
      <View style={styles.mainContent}>
        <View style={styles.profileSection}>
          <Image source={{ uri: friend.avatar }} style={styles.profileAvatar} />
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeEmoji}>🎟️</Text>
            <Text style={styles.badgeText}>{realFriendTickets.length}</Text>
          </View>
          <Text style={styles.profileName}>{friend.name}</Text>
          <Text style={styles.profileUsername}>{friend.username}</Text>
        </View>

        {/* 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, currentPage === 0 && styles.activeTab]}
            onPress={() => handleTabPress(0)}
          >
            <Text
              style={[
                styles.tabText,
                currentPage === 0 && styles.activeTabText,
              ]}
            >
              피드
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, currentPage === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}
          >
            <Text
              style={[
                styles.tabText,
                currentPage === 1 && styles.activeTabText,
              ]}
            >
              캘린더
            </Text>
          </TouchableOpacity>
        </View>

        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {/* 피드 탭 */}
          <View key="feed" style={styles.pageContainer}>
            <TicketGrid
              tickets={realFriendTickets}
              onTicketPress={handleTicketPress}
            />
          </View>

          {/* 캘린더 탭 */}
          <View key="calendar" style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <CustomCalendar
                selectedDate={selectedDate}
                tickets={allFriendTickets}
                onDayPress={handleDayPress}
              />
              <EventsList
                selectedEvents={selectedEvents}
                onTicketPress={handleTicketPress}
              />
            </ScrollView>
          </View>
        </PagerView>
      </View>

      {/* 티켓 모달 */}
      {selectedTicket && (
        <TicketDetailModal
          visible={isModalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
          isMine={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 20, color: '#2C3E50' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50' },
  placeholder: { width: 40 },
  mainContent: { flex: 1 },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#EEE',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  profileUsername: { fontSize: 16, color: '#6C757D' },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    top: -20,
  },
  badgeEmoji: { fontSize: 14, marginRight: 4 },
  badgeText: { color: '#FF3B30', fontSize: 12, fontWeight: 'bold' },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#B11515' },
  tabText: { fontSize: 16, fontWeight: '500', color: '#6C757D' },
  activeTabText: { color: '#B11515', fontWeight: '600' },
  pager: { flex: 1 },
  pageContainer: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F8F9FA' },
});

export default FriendProfilePage;
