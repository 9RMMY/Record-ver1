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

interface SentRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface SentRequestsPageProps {
  navigation: any;
}

const SentRequestsPage: React.FC<SentRequestsPageProps> = ({ navigation }) => {
  const [requestsCount, setRequestsCount] = useState(1);

  // 더미 보낸 친구 요청 데이터
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([
    {
      id: '1',
      name: '9RMMY',
      username: '@9rmmy',
      avatar: '👩🏻‍💼',
    },
  ]);

  const handleCancelRequest = (requestId: string) => {
    setSentRequests(prev => prev.filter(req => req.id !== requestId));
    setRequestsCount(prev => prev - 1);
    console.log('Friend request cancelled:', requestId);
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 보낸 요청 섹션 */}
        <Text style={styles.sectionTitle}>보낸 요청 ({requestsCount})</Text>

        {/* 보낸 요청 목록 */}
        {sentRequests.map((request) => (
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

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelRequest(request.id)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // FriendsListPage와 동일
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E', // FriendsListPage 톤 맞춤
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
    backgroundColor: '#3A3A3C', // Dark mode 스타일 맞춤
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
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  requestHandle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // FriendsListPage 빨강톤으로 통일
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default SentRequestsPage;
