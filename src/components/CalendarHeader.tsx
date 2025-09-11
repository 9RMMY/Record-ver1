import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalendarHeaderProps {
  totalTickets: number;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ totalTickets }) => {
  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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

  // Ticket count
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
});

export default CalendarHeader;
