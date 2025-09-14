import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom } from 'jotai';
import { friendsAtom } from '../../atoms/friendsAtoms';

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
  const [friends, setFriends] = useAtom(friendsAtom);

  // 더미 친구 요청 데이터
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'r1',
      name: 'Alice',
      username: '@alice',
      avatar: 'https://i.pravatar.cc/50?img=1',
    },
    {
      id: 'r2',
      name: 'Bob',
      username: '@bob',
      avatar: 'https://i.pravatar.cc/50?img=2',
    },
  ]);

  const friendRequestsCount = friendRequests.length;
  const friendsCount = friends.length;

  // 친구 삭제
  const handleDeleteFriend = (friendId: string) => {
    Alert.alert('친구 삭제', '정말로 친구를 삭제하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setFriends(friends.filter(f => f.id !== friendId)),
      },
    ]);
  };

  // 친구 요청 수락
  const handleAcceptRequest = (request: FriendRequest) => {
    setFriends([
      ...friends,
      {
        id: request.id,
        name: request.name,
        username: request.username,
        avatar: request.avatar,
      },
    ]);
    setFriendRequests(friendRequests.filter(r => r.id !== request.id));
  };

  // 친구 요청 거절
  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== requestId));
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.friendsSection}>
          <View style={styles.friendsSectionHeader}>
            <Text style={styles.friendsSectionTitle}>
              친구 요청 ({friendRequestsCount})
            </Text>

            <TouchableOpacity
              style={styles.sentFriendButton}
              onPress={() => navigation.navigate('SentRequests')}
            >
              <Text style={styles.sentFriendText}>보낸 요청 +</Text>
            </TouchableOpacity>
          </View>

          {friendRequests.map(request => (
            <View key={request.id} style={styles.friendItem}>
              {/* 프로필 클릭 가능 */}
              <TouchableOpacity
                style={styles.friendInfo}
                onPress={() =>
                  navigation.navigate('FriendProfile', { friend: request })
                }
              >
                <Image
                  source={{ uri: request.avatar }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{request.name}</Text>
                  <Text style={styles.friendUsername}>{request.username}</Text>
                </View>
              </TouchableOpacity>

              {/* 수락 / 거절 버튼 */}
              <View style={styles.requestButtons}>
                <TouchableOpacity
                  style={[styles.requestButton, styles.acceptButton]}
                  onPress={() => handleAcceptRequest(request)}
                >
                  <Text style={styles.requestButtonText}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.requestButton, styles.rejectButton]}
                  onPress={() => handleRejectRequest(request.id)}
                >
                  <Text style={styles.requestButtonText}>거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* 친구 목록 섹션 */}
        <View style={styles.friendsSection}>
          <Text style={styles.friendsSectionTitle}>
            내 친구들 ({friendsCount})
          </Text>
          {friends.map(friend => (
            <View key={friend.id} style={styles.friendItem}>
              <TouchableOpacity
                style={styles.friendInfo}
                onPress={() =>
                  navigation.navigate('FriendProfile', { friend })
                }
              >
                <Image
                  source={{ uri: friend.avatar }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendUsername}>{friend.username}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuButtonLeft}
                onPress={() => handleDeleteFriend(friend.id)}
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { fontSize: 20, color: '#2C3E50' },
  addFriendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendIcon: { fontSize: 16, color: '#2C3E50' },
  content: { flex: 1, backgroundColor: '#F8F9FA' },

  friendsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  friendsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  friendsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },

  sentFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#B11515',
  },
  sentFriendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  friendInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#E9ECEF',
  },
  friendDetails: { flex: 1 },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 2,
  },
  friendUsername: { fontSize: 14, color: '#6C757D' },

  menuButtonLeft: { marginRight: 10 },
  menuIcon: { fontSize: 20, color: '#ADB5BD', fontWeight: 'bold' },

  requestButtons: { flexDirection: 'row' },
  requestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  acceptButton: { backgroundColor: '#28A745' },
  rejectButton: { backgroundColor: '#DC3545' },
  requestButtonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default FriendsListPage;
