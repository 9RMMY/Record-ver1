import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface ReceivedRequestsPageProps {
  navigation: any;
}

const ReceivedRequestsPage: React.FC<ReceivedRequestsPageProps> = ({ navigation }) => {
  const [requestsCount] = useState(3);

  // 더미 친구 요청 데이터
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
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
  ]);

  const handleAcceptRequest = (requestId: string) => {
    // 친구 요청 수락 로직
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    console.log('Friend request accepted:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // 친구 요청 거절 로직
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    console.log('Friend request rejected:', requestId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={() => navigation.navigate('AddFriend')}
        >
          <Text style={styles.addFriendIcon}>👥+</Text>
        </TouchableOpacity>
      </View>

      {/* 페이지 제목 */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>보낸 요청 ({requestsCount})</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {friendRequests.map((request) => (
          <View key={request.id} style={styles.requestItem}>
            <View style={styles.requestInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{request.avatar}</Text>
              </View>
              <View style={styles.requestDetails}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text style={styles.requestHandle}>{request.username}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRejectRequest(request.id)}
              >
                <Text style={styles.rejectButtonText}>거절</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptRequest(request.id)}
              >
                <Text style={styles.acceptButtonText}>수락</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    fontSize: 24,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  addFriendButton: {
    padding: 10,
  },
  addFriendIcon: {
    fontSize: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  requestInfo: {
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
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  requestHandle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  acceptButton: {
    backgroundColor: '#FFB3BA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D63384',
  },
});

export default ReceivedRequestsPage;
