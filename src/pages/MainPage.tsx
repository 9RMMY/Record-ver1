import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';

interface MainPageProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const MainPage: React.FC<MainPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tickets] = useAtom(ticketsAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'밴드' | '연극/뮤지컬'>(
    '밴드',
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  const handleTicketPress = (ticket: Ticket) => {
    if (!ticket.id || !ticket.performedAt) return; // 빈 카드나 날짜 없는 카드 모달 열리지 않음
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getMonth() + 1}월`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const handleFilterSelect = (filter: '밴드' | '연극/뮤지컬') => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // 티켓이 없는 경우 빈 배열 사용
  const hasTickets = tickets.length > 0;

  const renderMainTicket = () => {
    // 티켓이 없는 경우 빈 상태 표시
    if (!hasTickets) {
      return (
        <View style={styles.mainTicketContainer}>
          <View style={styles.mainTicketCard}>
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>첫 번째 티켓을 추가해보세요!</Text>
              <Text style={styles.emptyStateSubtitle}>
                관람한 공연의 소중한 기억을{'\n'}기록해보세요
              </Text>
              <TouchableOpacity
                style={styles.emptyStateAddButton}
                onPress={() => navigation.navigate('AddTicket', { 
                  isFirstTicket: true,
                  fromEmptyState: true 
                })}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyStateAddButtonText}>+ 티켓 추가하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    

    // 티켓이 있는 경우 기존 로직
    const currentTicket = tickets[currentTicketIndex];
    const isPlaceholder = !currentTicket.id || !currentTicket.performedAt;

    return (
      <View style={styles.mainTicketContainer}>
        <TouchableOpacity
          style={styles.mainTicketCard}
          onPress={() => handleTicketPress(currentTicket)}
          activeOpacity={isPlaceholder ? 1 : 0.7}
        >
          {currentTicket.images && currentTicket.images.length > 0 ? (
            <Image
              source={{ uri: currentTicket.images[0] }}
              style={styles.mainTicketImage}
            />
          ) : (
            <View style={styles.mainTicketPlaceholder}>
              <Text style={styles.placeholderText}>이미지 없음</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 날짜 버튼: 날짜 없으면 표시하지 않음 */}
        {!isPlaceholder && currentTicket.performedAt && (
          <View style={styles.dateButtonContainer}>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>
                {formatDate(currentTicket.performedAt)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Re:cord</Text>
          <View style={styles.headerRight}>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Text style={styles.filterButtonText}>{selectedFilter}</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>

            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === '밴드' && styles.filterOptionSelected,
                  ]}
                  onPress={() => handleFilterSelect('밴드')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === '밴드' &&
                        styles.filterOptionTextSelected,
                    ]}
                  >
                    밴드
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedFilter === '연극/뮤지컬' &&
                      styles.filterOptionSelected,
                  ]}
                  onPress={() => handleFilterSelect('연극/뮤지컬')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilter === '연극/뮤지컬' &&
                        styles.filterOptionTextSelected,
                    ]}
                  >
                    연극/뮤지컬
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Sub Header */}
        <View style={styles.subHeader}>
          <Text style={styles.monthTitle}>
            {`${getCurrentMonth()}에 관람한 공연`}
          </Text>
          <Text style={styles.monthSubtitle}>
            {hasTickets 
              ? '한 달의 기록, 옆으로 넘기며 다시 만나보세요!' 
              : '소중한 공연의 순간들을 기록하고 추억해보세요'}
          </Text>
        </View>

        {/* Main Ticket */}
        <View style={styles.contentContainer}>{renderMainTicket()}</View>

        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000000' },
  headerRight: { position: 'relative' },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonText: { fontSize: 14, color: '#666666', marginRight: 4 },
  filterArrow: { fontSize: 10, color: '#666666' },
  filterDropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    minWidth: 140,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 1000,
  },
  filterOption: { paddingHorizontal: 16, paddingVertical: 12 },
  filterOptionSelected: { backgroundColor: '#F2F2F7' },
  filterOptionText: { fontSize: 15, color: '#3C3C43' },
  filterOptionTextSelected: { color: '#B11515', fontWeight: '600' },
  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  monthSubtitle: { fontSize: 14, color: '#666666', lineHeight: 20 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  mainTicketContainer: { alignItems: 'center' },
  mainTicketCard: {
    width: width - 80,
    height: (width - 80) * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#8FBC8F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainTicketImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mainTicketPlaceholder: {
    flex: 1,
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: { fontSize: 16, color: '#666666', fontWeight: '500' },
  dateButtonContainer: { marginTop: 16, alignItems: 'center' },
  dateButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: { fontSize: 14, color: '#333333', fontWeight: '500' },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyStateAddButton: {
    backgroundColor: '#B11515',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateAddButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B11515',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 20,
  },
});

export default MainPage;
