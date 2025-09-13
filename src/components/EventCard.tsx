import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ticket } from '../types/ticket';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../styles/designSystem';

interface EventCardProps {
  ticket: Ticket;
  onPress: (ticket: Ticket) => void;
}

const EventCard: React.FC<EventCardProps> = ({ ticket, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => onPress(ticket)}
    >
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{ticket.title}</Text>
        <Text style={styles.eventDetails}>
          @{ticket.place || '장소미정'} {ticket.artist ? ticket.artist : ''}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    ...ComponentStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    ...Typography.headline,
    color: Colors.label,
    marginBottom: Spacing.xs,
  },
  eventDetails: {
    ...Typography.subheadline,
    color: Colors.systemGray,
  },
  chevron: {
    fontSize: 32,
    color: Colors.systemGray3,
    fontWeight: '300',
  },
});

export default EventCard;
