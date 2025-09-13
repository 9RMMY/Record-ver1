import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';
import CalendarHeader from '../components/CalendarHeader';
import CustomCalendar from '../components/CustomCalendar';
import EventsList from '../components/EventsList';
import { Colors } from '../styles/designSystem';

interface CalendarProps {
  navigation: any;
}

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [tickets] = useAtom(ticketsAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Get events for selected date
  const selectedEvents = tickets.filter(
    ticket => formatDate(new Date(ticket.performedAt)) === selectedDate,
  );

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
      
      <CalendarHeader totalTickets={totalTickets} />
      
      <CustomCalendar
        selectedDate={selectedDate}
        tickets={tickets}
        onDayPress={handleDayPress}
      />
      
      <EventsList
        selectedEvents={selectedEvents}
        onTicketPress={handleTicketPress}
      />

      {selectedTicket && (
        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
          isMine={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.systemBackground,
  },
});

export default CalendarScreen;
