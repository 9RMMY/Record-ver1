import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom, ticketsCountAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';

interface MainPageProps {
  navigation: any;
}

const MainPage: React.FC<MainPageProps> = ({ navigation }) => {
  const [tickets] = useAtom(ticketsAtom);
  const [ticketsCount] = useAtom(ticketsCountAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status: '공개' | '비공개') => {
    switch (status) {
      case '공개':
        return '#4ECDC4';
      case '비공개':
        return '#FF6B6B';
      default:
        return '#E0E0E0';
    }
  };

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity style={styles.ticketCard} onPress={() => handleTicketPress(item)}>
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketInfo}>
        {item.artist} - {item.place}
      </Text>
      <Text style={styles.ticketInfo}>
        공연일: {item.performedAt.toLocaleDateString()}
      </Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.dateText}>업데이트: {item.updatedAt.toLocaleDateString()}</Text>
      
      {/* Show indicators for review and images */}
      <View style={styles.indicatorsContainer}>
        {item.review && (
          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>⭐ 후기</Text>
          </View>
        )}
        {item.images && item.images.length > 0 && (
          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>📷 {item.images.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket Book</Text>
        <Text style={styles.ticketCount}>Total: {ticketsCount} tickets</Text>
      </View>

      {tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tickets yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first ticket</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTicket')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TicketDetailModal
        visible={modalVisible}
        ticket={selectedTicket}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
  ticketCount: { fontSize: 16, color: '#7F8C8D' },
  listContainer: { padding: 16 },
  ticketCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  ticketInfo: { fontSize: 14, color: '#7F8C8D', marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  statusText: { color: '#FFFFFF', fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#BDC3C7', marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 24, fontWeight: 'bold', color: '#BDC3C7', marginBottom: 8 },
  emptySubtext: { fontSize: 16, color: '#BDC3C7', textAlign: 'center', lineHeight: 24 },
  indicatorsContainer: { flexDirection: 'row', marginTop: 8, gap: 8 },
  indicator: { backgroundColor: '#ECF0F1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  indicatorText: { fontSize: 12, color: '#7F8C8D', fontWeight: '600' },
  addButton: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3498DB', justifyContent: 'center', alignItems: 'center' },
  addButtonText: { fontSize: 30, color: '#FFFFFF', fontWeight: 'bold' },
});

export default MainPage;
