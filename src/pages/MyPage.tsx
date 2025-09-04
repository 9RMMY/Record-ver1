import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom, ticketsCountAtom, updateTicketAtom, deleteTicketAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';

interface MyPageProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3; // 3 columns with padding

const MyPage: React.FC<MyPageProps> = ({ navigation }) => {
  const [tickets] = useAtom(ticketsAtom);
  const [ticketsCount] = useAtom(ticketsCountAtom);
  const [, updateTicket] = useAtom(updateTicketAtom);
  const [, deleteTicket] = useAtom(deleteTicketAtom);

  // Filter out placeholder tickets for display
  const realTickets = tickets.filter(ticket => !ticket.isPlaceholder);
  
  // Create grid data with placeholders to fill empty spots
  const createGridData = () => {
    const gridSize = 9; // 3x3 grid
    const gridData = [...realTickets];
    
    // Fill remaining spots with placeholder cards
    while (gridData.length < gridSize) {
      gridData.push({
        id: `placeholder-${gridData.length}`,
        title: '',
        performedAt: new Date(),
        place: '',
        artist: '',
        bookingSite: '',
        status: '공개' as const,
        updatedAt: new Date(),
        createdAt: new Date(),
        isPlaceholder: true,
      });
    }
    
    return gridData;
  };

  const handleTicketPress = (ticket: Ticket) => {
    if (ticket.isPlaceholder) {
      // Navigate to add ticket page
      navigation.navigate('AddTicket');
    } else {
      // Navigate to ticket detail
      navigation.navigate('TicketDetail', { ticket });
    }
  };

  const renderTicketCard = ({ item }: { item: Ticket }) => {
    if (item.isPlaceholder) {
      return (
        <TouchableOpacity 
          style={styles.placeholderCard}
          onPress={() => handleTicketPress(item)}
        >
          <View style={styles.placeholderContent}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.ticketCard}
        onPress={() => handleTicketPress(item)}
      >
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.ticketImage} />
        ) : (
          <View style={styles.ticketImagePlaceholder}>
            <Text style={styles.ticketTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.ticketArtist} numberOfLines={1}>{item.artist}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Re:cord</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>👤+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👩🏻‍💻</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <Text style={styles.username}>9RMMY</Text>
        </View>

        {/* Ticket Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={createGridData()}
            renderItem={renderTicketCard}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  content: { 
    flex: 1 
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  // Profile section styles
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 60,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  // Grid styles
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  gridContent: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  // Ticket card styles
  ticketCard: {
    width: cardWidth,
    height: cardWidth * 1.4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  // Placeholder card styles
  placeholderCard: {
    width: cardWidth,
    height: cardWidth * 1.4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    color: '#BDC3C7',
    fontWeight: '300',
  },
});

export default MyPage;
