import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TicketDetailModal from './TicketDetailModal';
import CustomCalendar from './CustomCalendar';
import EventsList from './EventsList';
import { Ticket } from '../types/ticket';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';

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

type MarkedDate = {
  selected: boolean;
  marked?: boolean;
  selectedColor: string;
  dotColor?: string;
};

type MarkedDates = {
  [date: string]: MarkedDate;
};

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

const getMarkedDates = (): MarkedDates => {
  const marked: MarkedDates = {};

  Object.keys(performanceData).forEach(date => {
    marked[date] = {
      selected: true,
      selectedColor: '#B11515',
      dotColor: '#FFFFFF',
    };
  });

  return marked;
};

type Props = NativeStackScreenProps<RootStackParamList, 'FriendProfile'>;

// Convert performance data to Ticket format
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

const FriendProfilePage: React.FC<Props> = ({ navigation, route }) => {
  const { friend } = route.params;
  const [tickets] = useAtom(ticketsAtom);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0],
  );
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
    null,
  );
  
  // Get friend's tickets (for now, using all tickets as sample data)
  // In a real app, you would filter by friend.id or have a separate friend tickets atom
  const friendTickets = tickets.filter(ticket => ticket.status === '공개');
  
  // Convert performance data to tickets for the calendar
  const performanceTickets: Ticket[] = Object.entries(performanceData).map(([date, performance]) => 
    convertToTicket(date, performance)
  );
  
  // Combine friend tickets with performance tickets
  const allFriendTickets = [...friendTickets, ...performanceTickets];
  
  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Get events for selected date
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 프로필 정보 섹션 */}
        <View style={styles.profileSection}>
          <Image source={{ uri: friend.avatar }} style={styles.profileAvatar} />

          {/* 뱃지 - 실제 티켓 수 반영 */}
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeEmoji}>🎟️</Text>
            <Text style={styles.badgeText}>{friendTickets.length}</Text>
          </View>

          <Text style={styles.profileName}>{friend.name}</Text>
          <Text style={styles.profileUsername}>{friend.username}</Text>
        </View>

        {/* 캘린더 섹션 */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>공연 일정</Text>
          
          <CustomCalendar
            selectedDate={selectedDate}
            tickets={allFriendTickets}
            onDayPress={handleDayPress}
          />
          
          <EventsList
            selectedEvents={selectedEvents}
            onTicketPress={handleTicketPress}
          />

          {selectedTicket && (
            <TicketDetailModal
              visible={isModalVisible}
              ticket={selectedTicket}
              onClose={handleCloseModal}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    backgroundColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: '#8E8E93',
  },

  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    top: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  badgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
  },

  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  calendarSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
});

export default FriendProfilePage;
