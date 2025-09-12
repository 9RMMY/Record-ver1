import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Ticket } from '../types/ticket';

interface TicketGridProps {
  tickets: Ticket[];
  onTicketPress: (ticket: Ticket) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // 3 columns with padding (20px * 2 + 20px gaps)

const TicketGrid: React.FC<TicketGridProps> = ({ tickets, onTicketPress }) => {
  const renderTicketCard = ({ item }: { item: Ticket }) => {
    const hasImages = item.images && item.images.length > 0;
    
    return (
      <TouchableOpacity
        style={[
          styles.ticketCard,
          !hasImages && styles.ticketCardNoImage
        ]}
        onPress={() => onTicketPress(item)}
      >
        {hasImages ? (
          <Image source={{ uri: item.images![0] }} style={styles.ticketImage} />
        ) : (
          <View style={styles.ticketImagePlaceholder}>
            <Text style={styles.ticketTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.ticketArtist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (tickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 티켓이 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      <FlatList
        data={tickets}
        renderItem={renderTicketCard}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 20,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  ticketCard: {
    width: cardWidth,
    height: cardWidth * 1.4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  ticketCardNoImage: {
    backgroundColor: '#FFEBEE',
    borderWidth: 0.5,
    borderColor: '#FF3B30',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ticketImagePlaceholder: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  ticketTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  ticketArtist: {
    fontSize: 10,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default TicketGrid;
