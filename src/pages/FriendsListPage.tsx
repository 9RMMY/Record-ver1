import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface FriendsListPageProps {
  navigation: any;
}

const FriendsListPage: React.FC<FriendsListPageProps> = ({ navigation }) => {
  const [pendingRequestsCount] = useState(3);
  const [friendsCount] = useState(3);

  // 더미 친구 데이터
  const friends: Friend[] = [
    {
      id: '1',
      name: '9RMMY',
      username: '@9rmmy',
      avatar: '👩🏻‍💼',
    },
    {
      id: '2',
      name: '9RMMY',
      username: '@9rmmy',
      avatar: '👩🏻‍💼',
    },
    {
      id: '3',
      name: '9RMMY',
      username: '@9rmmy',
      avatar: '👩🏻‍💼',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={() => navigation.navigate('AddFriend')}
        >
          <Text style={styles.addFriendIcon}>👥+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 친구 요청 섹션 */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => navigation.navigate('ReceivedRequests')}
        >
          <Text style={styles.sectionTitle}>친구 요청 ({pendingRequestsCount})</Text>
          <Text style={styles.sectionArrow}>보낸 요청 ›</Text>
        </TouchableOpacity>

        {/* 친구들 섹션 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>친구들 ({friendsCount})</Text>
          
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <View style={styles.friendInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{friend.avatar}</Text>
                </View>
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendHandle}>{friend.username}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  addFriendButton: {
    padding: 10,
  },
  addFriendIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionContainer: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  sectionArrow: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  friendHandle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default FriendsListPage;
