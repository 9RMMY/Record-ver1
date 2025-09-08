import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isMyProfile?: boolean;
}

interface AddFriendPageProps {
  navigation: any;
}

const AddFriendPage: React.FC<AddFriendPageProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // 더미 데이터
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Re:cord 프로필 공유',
      username: '@9rmmy',
      avatar: '👩🏻‍💼',
      isMyProfile: true,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // 실제로는 API 호출
      setSearchResults(mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setSearchResults(mockUsers);
    }
  };

  const handleSendFriendRequest = (userId: string) => {
    // 친구 요청 로직
    console.log('Friend request sent to:', userId);
  };

  React.useEffect(() => {
    setSearchResults(mockUsers);
  }, []);

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
        <View style={styles.headerRight} />
      </View>

      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="사용자 검색"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.micButton}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색 결과 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchResults.map((user) => (
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
            
            {user.isMyProfile ? (
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareIcon}>📤</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleSendFriendRequest(user.id)}
              >
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            )}
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
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  micButton: {
    marginLeft: 10,
  },
  micIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  addButton: {
    backgroundColor: '#FFB3BA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D63384',
  },
  shareButton: {
    padding: 10,
  },
  shareIcon: {
    fontSize: 20,
  },
});

export default AddFriendPage;
