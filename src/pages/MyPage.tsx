import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { ticketsAtom } from '../atoms/ticketAtoms';
import { Ticket } from '../types/ticket';
import { isPlaceholderTicket } from '../utils/isPlaceholder';
import TicketDetailModal from '../components/TicketDetailModal';

interface MyPageProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3; // 3 columns with padding
const HEADER_HEIGHT = 80; // 헤더 높이 정의

const MyPage: React.FC<MyPageProps> = ({ navigation }) => {
  const [tickets] = useAtom(ticketsAtom);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  
  // 스크롤 애니메이션을 위한 Animated.Value
  const scrollY = useRef(new Animated.Value(0)).current;

  // 등록된 티켓만 필터링하고 최신순으로 정렬
  const realTickets = tickets
    .filter(ticket => !isPlaceholderTicket(ticket))
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const handleTicketPress = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  // 헤더 배경 투명도 애니메이션
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.5, 0.2],
    extrapolate: 'clamp',
  });

  // 중앙 아이디 표시 투명도 애니메이션
  const centerIdOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  // 헤더 아이콘들 투명도 애니메이션
  const headerIconsOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  const renderTicketCard = ({ item }: { item: Ticket }) => {
    const hasImages = item.images && item.images.length > 0;
    
    return (
      <TouchableOpacity
        style={[
          styles.ticketCard,
          !hasImages && styles.ticketCardNoImage
        ]}
        onPress={() => handleTicketPress(item)}
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { 
        paddingTop: insets.top,
        height: HEADER_HEIGHT + insets.top,
        backgroundColor: headerOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
        })
      }]}>
        {/* 왼쪽 앱 타이틀 */}
        <Animated.Text style={[styles.appTitle, { opacity: headerOpacity }]}>
          Re:cord
        </Animated.Text>
        
        {/* 중앙 아이디 (스크롤시 나타남) */}
        <Animated.View style={[styles.centerIdContainer, { 
          opacity: centerIdOpacity,
          top: insets.top + 10
        }]}>
          <Text style={styles.centerId}>ID1234</Text>
        </Animated.View>

        {/* 오른쪽 아이콘들 */}
        <Animated.View style={[styles.headerIcons, { opacity: headerIconsOpacity }]}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>👤+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* User Profile Section */}
        <View style={[styles.profileSection, { paddingTop: HEADER_HEIGHT + 32}]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://example.com/profile.jpg' }}
              style={styles.avatarImage}
            />
          </View>

          {/* 뱃지 - 실제 티켓 수 반영 */}
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeEmoji}>🎟️</Text>
            <Text style={styles.badgeText}>{realTickets.length}</Text>
          </View>

          {/* 유저 이름 */}
          <Text style={styles.username}>ID1234</Text>

          {/* 유저 통계 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>tickets</Text>
              <Text style={styles.statValue}>{realTickets.length}개</Text>
            </View>
            <TouchableOpacity 
              style={styles.statBox}
              onPress={() => navigation.navigate('FriendsList')}
            >
              <Text style={styles.statLabel}>친구들</Text>
              <Text style={styles.statValue}>10명</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ticket Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={realTickets}
            renderItem={renderTicketCard}
            keyExtractor={(_, index) => index.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
          />
        </View>
      </Animated.ScrollView>

      {selectedTicket && (
        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  content: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  centerIdContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  centerId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 16,
  },

  //프로필
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  avatarContainer: {

  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 40,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    top: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  badgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },

  //피드
  gridContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  gridContent: {
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'flex-start',
    marginBottom: 4,
    gap: 8,
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
  emptyCard: {
    width: cardWidth,
    height: cardWidth * 1.4,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F2F2F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
});

export default MyPage;