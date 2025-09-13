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

  searchContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { color: '#2C3E50', fontSize: 16 },

  content: { flex: 1 },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 24 },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '500', color: '#2C3E50', marginBottom: 2 },
  userHandle: { fontSize: 14, color: '#6C757D' },

  addButton: {
    backgroundColor: '#B11515',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  sentButton: { backgroundColor: '#6C757D' },
  sentButtonText: { color: '#FFFFFF' },

  shareButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});

export default AddFriendPage;
