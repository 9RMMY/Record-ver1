import React, { useState, useRef } from 'react';
import {
  View,
  Text,
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
import { ticketsAtom } from '../../atoms/ticketAtoms';
import { Ticket } from '../../types/ticket';
import { isPlaceholderTicket } from '../../utils/isPlaceholder';
import TicketDetailModal from '../../components/TicketDetailModal';
import TicketGrid from '../../components/TicketGrid';
import { friendsAtom } from '../../atoms/friendsAtoms';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ComponentStyles } from '../../styles/designSystem';

interface MyPageProps {
  navigation: any;
}

const HEADER_HEIGHT = 80; // 헤더 높이 정의

const MyPage: React.FC<MyPageProps> = ({ navigation }) => {
  const [tickets] = useAtom(ticketsAtom);
  const [friends] = useAtom(friendsAtom); 
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AddFriend')}
        >
          <Text style={styles.iconText}>👥+</Text>
        </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
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
              <Text style={styles.statValue}>{friends.length}명</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ticket Grid */}
        <TicketGrid
          tickets={realTickets}
          onTicketPress={handleTicketPress}
        />
      </Animated.ScrollView>

      {selectedTicket && (
        <TicketDetailModal
          visible={modalVisible}
          ticket={selectedTicket}
          onClose={handleCloseModal}
          isMine={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.systemBackground },
  
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
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    zIndex: 10,
  },
  appTitle: {
    ...Typography.title2,
    fontWeight: '700',
    color: Colors.label,
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
    ...Typography.callout,
    fontWeight: 'bold',
    color: Colors.label,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: `${Colors.secondarySystemBackground}CC`,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  iconText: {
    ...Typography.callout,
  },

  //프로필
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.systemBackground,
    ...Shadows.large,
  },
  avatarContainer: {

  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.systemGray5,
    shadowColor: Colors.label,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 40,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.systemBackground,
    borderRadius: BorderRadius.xl,
    height: 32,
    paddingHorizontal: Spacing.md,
    top: -16,
    ...Shadows.medium,
  },
  badgeEmoji: {
    ...Typography.footnote,
    marginRight: Spacing.xs,
  },
  badgeText: {
    color: Colors.primary,
    ...Typography.caption1,
    fontWeight: 'bold',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.subheadline,
    color: Colors.secondaryLabel,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.callout,
    fontWeight: 'bold',
    color: Colors.label,
  },
  username: {
    ...Typography.title1,
    fontWeight: 'bold',
    color: Colors.label,
  },

});

export default MyPage;