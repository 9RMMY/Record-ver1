import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ticket } from '../types/ticket';
import EventCard from './EventCard';
import { Colors, Typography, Spacing } from '../styles/designSystem';

interface EventsListProps {
  selectedEvents: Ticket[];
  onTicketPress: (ticket: Ticket) => void;
}

const EventsList: React.FC<EventsListProps> = ({ selectedEvents, onTicketPress }) => {
  return (
    <ScrollView style={styles.eventsContainer}>
      {selectedEvents.length > 0 ? (
        selectedEvents.map(ticket => {
          const eventDate = new Date(ticket.performedAt);
          const dateString = `${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일`;
          
          return (
            <View key={ticket.id} style={styles.eventSection}>
              <Text style={styles.eventDateTitle}>{dateString}</Text>
              <EventCard ticket={ticket} onPress={onTicketPress} />
            </View>
          );
        })
      ) : (
        <View style={styles.noEvents}>
          <Text style={styles.noEventsText}>선택한 날짜에 일정이 없습니다.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eventsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },
  eventSection: {
    marginBottom: Spacing.sectionSpacing,
  },
  eventDateTitle: {
    ...Typography.title3,
    fontWeight: '700',
    color: Colors.label,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noEvents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl + Spacing.sm,
  },
  noEventsText: {
    ...Typography.body,
    color: Colors.systemGray,
    textAlign: 'center',
  },
});

export default EventsList;
