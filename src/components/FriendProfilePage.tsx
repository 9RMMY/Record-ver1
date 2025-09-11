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
import { Calendar } from 'react-native-calendars';
import TicketDetailModal from './TicketDetailModal';
import { Ticket } from '../types/ticket';

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

// Types for performance data
interface PerformanceInfo {
  title: string;
  time: string;
  location: string;
}

type PerformanceData = {
  [date: string]: PerformanceInfo;
};

// Sample performance data
const performanceData: PerformanceData = {
  '2025-09-15': {
    title: '오페라 - 라 트라비아타',
    time: '19:30',
    location: '서울 예술의전당 오페라극장'
  },
  '2025-09-22': {
    title: '뮤지컬 - 레미제라블',
    time: '14:00',
    location: '블루스퀘어 인터파크홀'
  },
  '2025-10-05': {
    title: '콘서트 - 클래식 갈라쇼',
    time: '20:00',
    location: '롯데콘서트홀'
  }
};

// Generate marked dates for the calendar
const getMarkedDates = (): MarkedDates => {
  const marked: MarkedDates = {};
  
  Object.keys(performanceData).forEach(date => {
    marked[date] = {
      selected: true,
      selectedColor: '#B11515',
      dotColor: '#FFFFFF'
    };
  });
  
  return marked;
};

type Props = NativeStackScreenProps<RootStackParamList, 'FriendProfile'>;

// Convert performance data to Ticket format
const convertToTicket = (date: string, performance: PerformanceInfo): Ticket => {
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
  const [selectedDate, setSelectedDate] = React.useState<keyof PerformanceData>('2025-09-15');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const markedDates = getMarkedDates();
  
  // Set the first performance date as selected by default
  React.useEffect(() => {
    const dates = Object.keys(performanceData);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);
  
  const handleEventPress = (date: string | number) => {
    const dateStr = date.toString();
    setSelectedDate(dateStr as keyof PerformanceData);
    const performance = performanceData[dateStr as keyof PerformanceData];
    if (performance) {
      setSelectedTicket(convertToTicket(dateStr, performance));
      setIsModalVisible(true);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString as keyof PerformanceData);
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Image
            source={{ uri: friend.avatar }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{friend.name}</Text>
          <Text style={styles.profileUsername}>{friend.username}</Text>
        </View>


        {/* 통계 섹션 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>활동 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>관람한 공연</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>작성한 리뷰</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>함께한 공연</Text>
            </View>
          </View>
        </View>

        {/* 캘린더 섹션 */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>공연 일정</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: '#B11515',
                  customStyles: {
                    container: {
                      backgroundColor: '#B11515',
                      borderRadius: 16,
                    },
                    text: {
                      color: 'white',
                      fontWeight: '700',
                    },
                  },
                },
              } as any}
              theme={{
                backgroundColor: '#2C2C2E',
                calendarBackground: '#2C2C2E',
                textSectionTitleColor: '#FFFFFF',
                selectedDayBackgroundColor: '#B11515',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#B11515',
                dayTextColor: '#FFFFFF',
                textDisabledColor: '#555555',
                dotColor: '#B11515',
                selectedDotColor: '#FFFFFF',
                arrowColor: '#B11515',
                monthTextColor: '#FFFFFF',
                textDayFontWeight: '300' as const,
                textMonthFontWeight: 'bold' as const,
                textDayHeaderFontWeight: '300' as const,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
            
            {selectedDate && performanceData[selectedDate] && (
              <TouchableOpacity 
                style={styles.eventDetails}
                onPress={() => handleEventPress(selectedDate)}
                activeOpacity={0.8}
              >
                <Text style={styles.eventTitle}>{performanceData[selectedDate].title}</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventInfoText}>⏰ {performanceData[selectedDate].time}</Text>
                  <Text style={styles.eventInfoText}>📍 {performanceData[selectedDate].location}</Text>
                </View>
              </TouchableOpacity>
            )}
            
            {selectedTicket && (
              <TicketDetailModal 
                visible={isModalVisible} 
                ticket={selectedTicket} 
                onClose={handleCloseModal} 
              />
            )}
          </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
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
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
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
  },
  calendarContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  eventDetails: {
    marginTop: 20,
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  eventInfo: {
    gap: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#E5E5EA',
  },
});

export default FriendProfilePage;
