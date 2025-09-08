import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';

interface CalenderProps {
  navigation: any;
}

const CalenderScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [tickets] = useAtom(ticketsAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Mark dates with events
  const markedDates: { [key: string]: any } = tickets.reduce((acc, ticket) => {
    const date = formatDate(new Date(ticket.performedAt));
    return {
      ...acc,
      [date]: {
        marked: true,
        dotColor: '#B11515',
        selected: date === selectedDate,
        selectedColor: '#B11515',
      },
    };
  }, {} as { [key: string]: any });

  // Get events for selected date
  const selectedEvents = tickets.filter(
    ticket => formatDate(new Date(ticket.performedAt)) === selectedDate,
  );

  // Configure calendar locale
  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    dayNames: [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
  };
  LocaleConfig.defaultLocale = 'ko';

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // Get total ticket count
  const totalTickets = tickets.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Re:cord</Text>
      </View>
      
      {/* Calendar Title and Count */}
      <View style={styles.titleSection}>
        <Text style={styles.calendarTitle}>캘린더</Text>
        <View style={styles.ticketCountBadge}>
          <Text style={styles.ticketCountText}>🎟️ {totalTickets}개</Text>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#B11515',
            },
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#000000',
            selectedDayBackgroundColor: '#B11515',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#B11515',
            dayTextColor: '#000000',
            textDisabledColor: '#8E8E93',
            dotColor: '#B11515',
            selectedDotColor: '#ffffff',
            arrowColor: '#000000',
            monthTextColor: '#000000',
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 17,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 15,
          }}
          style={styles.calendar}
        />
      </View>

      {/* Events List */}
      <ScrollView style={styles.eventsContainer}>
        {selectedEvents.length > 0 ? (
          selectedEvents.map(ticket => {
            const eventDate = new Date(ticket.performedAt);
            const dateString = `${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일`;
            
            return (
              <View key={ticket.id} style={styles.eventSection}>
                <Text style={styles.eventDateTitle}>{dateString}</Text>
                <TouchableOpacity
                  style={styles.eventCard}
                  onPress={() => handleTicketPress(ticket)}
                >
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{ticket.title}</Text>
                    <Text style={styles.eventDetails}>
                      @{ticket.place || '장소미정'} {ticket.artist ? ticket.artist : ''}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={styles.noEvents}>
            <Text style={styles.noEventsText}>선택한 날짜에 일정이 없습니다.</Text>
          </View>
        )}
      </ScrollView>

      {selectedTicket && (
        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  calendarTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },

  //ticket count
  ticketCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  ticketCountText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Calendar
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendar: {
    borderRadius: 16,
  },

  // Events
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventSection: {
    marginBottom: 24,
  },
  eventDateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 15,
    color: '#8E8E93',
  },


  chevron: {
    fontSize: 32,
    color: '#C7C7CC',
    fontWeight: '300',
  },

  // No Events
  noEvents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noEventsText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default CalenderScreen;
