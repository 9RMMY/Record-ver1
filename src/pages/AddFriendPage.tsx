import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isMyProfile?: boolean;
}

const AddFriendPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const myProfile: User = { id: '1', name: 'Re:cord 프로필 공유', username: '@9rmmy', avatar: '👩🏻‍💼', isMyProfile: true };

  const mockUsers: User[] = [
    { id: '2', name: '9RMMY', username: '@9rmmy', avatar: '👩🏻‍💼' },
    { id: '3', name: 'Alice', username: '@alice', avatar: '👩🏻‍💼' },
    { id: '4', name: 'Bob', username: '@bob', avatar: '👩🏻‍💼' },
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]); // 검색 전엔 빈 배열, 단 내 프로필은 항상 표시
    } else {
      const query = searchQuery.toLowerCase();
      setSearchResults(
        mockUsers.filter(
          user =>
            user.id.includes(query) ||
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery]);

  const handleSendFriendRequest = (userId: string) => {
    if (!sentRequests.includes(userId)) {
      setSentRequests(prev => [...prev, userId]);
      console.log('Friend request sent to:', userId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="사용자 검색"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 검색 결과 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 항상 표시되는 내 프로필 */}
        <View style={styles.userItem}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{myProfile.avatar}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{myProfile.name}</Text>
              <Text style={styles.userHandle}>{myProfile.username}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareText}>공유</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        {searchResults.map(user => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHandle}>{user.username}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                sentRequests.includes(user.id) && styles.sentButton,
              ]}
              onPress={() => handleSendFriendRequest(user.id)}
              disabled={sentRequests.includes(user.id)}
            >
              <Text
                style={[
                  styles.addButtonText,
                  sentRequests.includes(user.id) && styles.sentButtonText,
                ]}
              >
                {sentRequests.includes(user.id) ? '보냈음' : '추가'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {searchQuery && searchResults.length === 0 && (
          <View style={{ padding: 20 }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>검색 결과가 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: 'normal' },

  searchContainer: {
    backgroundColor: '#2C2C2E',
    margin: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: { color: '#FFFFFF', fontSize: 16 },

  content: { flex: 1 },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 24 },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '400', color: '#FFFFFF', marginBottom: 2 },
  userHandle: { fontSize: 14, color: '#8E8E93' },

  addButton: {
    backgroundColor: '#FFB3BA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#D63384' },

  sentButton: { backgroundColor: '#8E8E93' },
  sentButtonText: { color: '#FFFFFF' },

  shareButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});

export default AddFriendPage;
