import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface FriendsListPageProps {
  navigation: any;
}

const FriendsListPage: React.FC<FriendsListPageProps> = ({ navigation }) => {
  const [friendRequestsCount] = useState(0);
  const [friendsCount] = useState(7);

  // 더미 친구 데이터 (스크린샷과 유사하게)
  const friends: Friend[] = [
    {
      id: '1',
      name: '서현서',
      username: 'wooyoungwoo29',
      avatar: 'https://via.placeholder.com/50/20B2AA/FFFFFF?text=서',
    },
    {
      id: '2',
      name: '민지',
      username: 'dxxrjh',
      avatar: 'https://via.placeholder.com/50/8B4513/FFFFFF?text=민',
    },
    {
      id: '3',
      name: '이스',
      username: 'cknvsp',
      avatar: 'https://via.placeholder.com/50/708090/FFFFFF?text=이',
    },
    {
      id: '4',
      name: '밍수',
      username: 'namull',
      avatar: 'https://via.placeholder.com/50/20B2AA/FFFFFF?text=밍',
    },
    {
      id: '5',
      name: '민수',
      username: 'minsoo821',
      avatar: 'https://via.placeholder.com/50/20B2AA/FFFFFF?text=민',
    },
    {
      id: '6',
      name: '모선',
      username: 'myo25',
      avatar: 'https://via.placeholder.com/50/87CEEB/FFFFFF?text=모',
    },
    {
      id: '7',
      name: '이주',
      username: '22zoo',
      avatar: 'https://via.placeholder.com/50/D2691E/FFFFFF?text=이',
    },
  ];

  const handleFriendMenu = (friendId: string) => {
    console.log('친구 메뉴 클릭:', friendId);
    // 메뉴 옵션 표시 로직
  };

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
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>친구 요청 ({friendRequestsCount})</Text>
          <Text style={styles.sectionArrow}>보냄 ›</Text>
        </TouchableOpacity>

        {/* 친구들 섹션 */}
        <View style={styles.friendsSection}>
          <Text style={styles.friendsSectionTitle}>내 친구들 ({friendsCount})</Text>
          
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <View style={styles.friendInfo}>
                <Image 
                  source={{ uri: friend.avatar }} 
                  style={styles.friendAvatar}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendUsername}>{friend.username}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => handleFriendMenu(friend.id)}
              >
                <Text style={styles.menuIcon}>⋯</Text>
              </TouchableOpacity>
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
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'normal',
  },
  addFriendButton: {
    padding: 10,
  },
  addFriendIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  sectionArrow: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '400',
  },
  friendsSection: {
    paddingTop: 10,
    backgroundColor: '#1C1C1E',
  },
  friendsSectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
    color: '#8E8E93',
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 20,
    color: '#8E8E93',
    fontWeight: 'bold',
  },
});

export default FriendsListPage;
