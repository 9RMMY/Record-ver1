import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/designSystem';

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
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.systemBackground,
  },
  appTitle: {
    ...Typography.title2,
    fontWeight: '700',
    color: Colors.label,
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionSpacing,
    backgroundColor: Colors.systemBackground,
  },
  calendarTitle: {
    ...Typography.title1,
    fontWeight: '700',
    color: Colors.label,
  },

  // Ticket count
  ticketCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.systemBackground,
    borderRadius: BorderRadius.xl,
    height: 32,
    paddingHorizontal: Spacing.md,
    ...Shadows.medium,
  },
  ticketCountText: {
    color: Colors.primary,
    ...Typography.subheadline,
    fontWeight: 'bold',
  },
});

export default CalendarHeader;
