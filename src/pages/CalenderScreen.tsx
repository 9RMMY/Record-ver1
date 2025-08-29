import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
        dotColor: '#4ECDC4',
        selected: date === selectedDate,
        selectedColor: '#4ECDC4'
      }
    };
  }, {} as { [key: string]: any });

  // Get events for selected date
  const selectedEvents = tickets.filter(ticket => 
    formatDate(new Date(ticket.performedAt)) === selectedDate
  );

  // Configure calendar locale
  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    monthNamesShort: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ],
    dayNames: [
      '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>캘린더</Text>
      </View>
      
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#4ECDC4'
            }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2C3E50',
            selectedDayBackgroundColor: '#4ECDC4',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4ECDC4',
            dayTextColor: '#2C3E50',
            textDisabledColor: '#BDC3C7',
            dotColor: '#4ECDC4',
            selectedDotColor: '#ffffff',
            arrowColor: '#4ECDC4',
            monthTextColor: '#2C3E50',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        />
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          {new Date(selectedDate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}의 일정
        </Text>
        
        <ScrollView style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id} 
                style={styles.eventCard}
                onPress={() => handleTicketPress(ticket)}
              >
                <View style={styles.eventTime}>
                  <Text style={styles.eventTimeText}>
                    {new Date(ticket.performedAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {ticket.title}
                  </Text>
                  <Text style={styles.eventArtist} numberOfLines={1}>
                    {ticket.artist} @ {ticket.place}
                  </Text>
                  
                  {/* Show indicators for review and images */}
                  <View style={styles.indicatorsContainer}>
                    {ticket.review && (
                      <View style={styles.indicator}>
                        <Text style={styles.indicatorText}>⭐ 후기</Text>
                      </View>
                    )}
                    {ticket.images && ticket.images.length > 0 && (
                      <View style={styles.indicator}>
                        <Text style={styles.indicatorText}>📷 {ticket.images.length}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noEvents}>
              <Text style={styles.noEventsText}>일정이 없습니다</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <TicketDetailModal
        visible={modalVisible}
        ticket={selectedTicket}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 8,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  eventTime: {
    backgroundColor: '#F0F9F8',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  eventTimeText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  eventArtist: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  indicatorText: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  noEvents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default CalenderScreen;