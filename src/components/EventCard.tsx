import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ticket } from '../types/ticket';

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
});

export default EventCard;
