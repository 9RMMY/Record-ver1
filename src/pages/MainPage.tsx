import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom, ticketsCountAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import TicketDetailModal from '../components/TicketDetailModal';

interface MainPageProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = (CARD_WIDTH * 4) / 3;

const MainPage: React.FC<MainPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tickets] = useAtom(ticketsAtom);
  const [ticketsCount] = useAtom(ticketsCountAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    '밴드' | '연극/뮤지컬'
  >('밴드');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  const handleTicketPress = (ticket: Ticket) => {
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

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const handleFilterSelect = (
    filter: '밴드' | '연극/뮤지컬',
  ) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // Mock ticket data for demo
  const mockTicket: Ticket = {
    id: '1',
    title: '지구의 마지막 밤',
    artist: '2 Day Old Sneakers',
    place: '생기 스튜디오',
    performedAt: new Date('2025-07-06'),
    bookingSite: '구글폼',
    status: '비공개',
    images: ['https://picsum.photos/400/600?random=1'],
    review: {
      reviewText: 'Amazing performance!',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const displayTickets = tickets.length > 0 ? tickets : [mockTicket];

  const renderMainTicket = () => {
    const currentTicket =
      displayTickets[currentTicketIndex] || displayTickets[0];

    return (
      <View style={styles.mainTicketContainer}>
        <TouchableOpacity
          style={styles.mainTicketCard}
          onPress={() => handleTicketPress(currentTicket)}
        >
          {currentTicket.images && currentTicket.images.length > 0 ? (
            <Image
              source={{ uri: currentTicket.images[0] }}
              style={styles.mainTicketImage}
            />
          ) : (
            <View style={styles.mainTicketPlaceholder}>
              <Text style={styles.placeholderText}>
                새 티켓을 추가해보세요!
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.dateButtonContainer}>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {formatDate(currentTicket.performedAt)}
            </Text>
          </TouchableOpacity>
        </View>
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
                      selectedFilter === '밴드' && styles.filterOptionTextSelected,
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
          <Text style={styles.monthTitle}>{getCurrentMonth()}에 관람한 공연</Text>
          <Text style={styles.monthSubtitle}>
            한 달의 기록, 옆으로 넘기며 다시 만나보세요!
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerRight: {
    position: 'relative',
  },
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
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  filterArrow: {
    fontSize: 10,
    color: '#666666',
  },
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
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterOptionSelected: {
    backgroundColor: '#F2F2F7',
  },
  filterOptionText: {
    fontSize: 15,
    color: '#3C3C43',
  },
  filterOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
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
  monthSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  mainTicketContainer: {
    alignItems: 'center',
  },
  mainTicketCard: {
    width: width - 80,
    height: (width - 80) * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#8FBC8F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainTicketImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainTicketPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  dateButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});

export default MainPage;
