import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom, ticketsCountAtom, updateTicketAtom, deleteTicketAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';

interface MyPageProps {
  navigation: any;
}

const MyPage: React.FC<MyPageProps> = ({ navigation }) => {
  const [tickets] = useAtom(ticketsAtom);
  const [ticketsCount] = useAtom(ticketsCountAtom);
  const [, updateTicket] = useAtom(updateTicketAtom);
  const [, deleteTicket] = useAtom(deleteTicketAtom);

  const handleStatusChange = (ticket: Ticket, newStatus: '공개' | '비공개') => {
    updateTicket({ ...ticket, status: newStatus });
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    Alert.alert(
      '티켓 삭제',
      `"${ticket.title}" 티켓을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteTicket(ticket.id);
            Alert.alert('완료', '티켓이 삭제되었습니다.');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: '공개' | '비공개') => {
    switch (status) {
      case '공개': return '#4ECDC4';
      case '비공개': return '#FF6B6B';
    }
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTicket(item)}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.ticketInfo}>
        {item.artist} - {item.place}
      </Text>
      <Text style={styles.ticketInfo}>
        공연일: {item.performedAt.toLocaleDateString()}
      </Text>

      <View style={styles.statusContainer}>
        {['공개', '비공개'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.statusButton, item.status === status && { backgroundColor: getStatusColor(status as any) }]}
            onPress={() => handleStatusChange(item, status as any)}
          >
            <Text style={[styles.statusButtonText, item.status === status && styles.statusButtonTextActive]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.dateText}>업데이트: {item.updatedAt.toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tickets</Text>
            <Text style={styles.emptySubtext}>Create your first ticket to get started</Text>
          </View>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1 },
  listContainer: { paddingHorizontal: 16 },
  ticketCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', flex: 1 },
  ticketInfo: { fontSize: 14, color: '#7F8C8D', marginBottom: 4 },
  deleteButton: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  statusContainer: { flexDirection: 'row', marginBottom: 8 },
  statusButton: { flex: 1, backgroundColor: '#ECF0F1', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, marginHorizontal: 2, alignItems: 'center' },
  statusButtonText: { fontSize: 12, fontWeight: '600', color: '#7F8C8D' },
  statusButtonTextActive: { color: '#FFFFFF' },
  dateText: { fontSize: 12, color: '#BDC3C7' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 40 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#BDC3C7', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#BDC3C7', textAlign: 'center', lineHeight: 20 },
});

export default MyPage;
