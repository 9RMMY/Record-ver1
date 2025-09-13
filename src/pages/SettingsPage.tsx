import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface SettingsPageProps {
  navigation: any;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            // 로그아웃 로직 구현
            console.log('로그아웃 처리');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 회원 탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            // 회원 탈퇴 로직 구현
            console.log('회원 탈퇴 처리');
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      id: 1,
      title: '개인정보 수정',
      icon: '👤',
      onPress: () => navigation.navigate('PersonalInfoEdit'),
      showArrow: true,
    },
    {
      id: 2,
      title: '히스토리',
      icon: '📋',
      onPress: () => navigation.navigate('History'),
      showArrow: true,
    },
    {
      id: 3,
      title: '로그아웃',
      icon: '🚪',
      onPress: handleLogout,
      showArrow: false,
      textColor: '#FF6B6B',
    },
    {
      id: 4,
      title: '회원 탈퇴',
      icon: '⚠️',
      onPress: handleDeleteAccount,
      showArrow: false,
      textColor: '#FF3B30',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userId}>ID1234</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* Settings Options */}
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.optionTitle,
                    option.textColor && { color: option.textColor },
                  ]}
                >
                  {option.title}
                </Text>
              </View>
              {option.showArrow && (
                <Text style={styles.optionArrow}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>버전 1.0.0</Text>
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
    paddingBottom: 16,
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
  backButtonText: {
    fontSize: 20,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  userSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  userId: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6C757D',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  optionArrow: {
    fontSize: 16,
    color: '#ADB5BD',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#6C757D',
  },
});

export default SettingsPage;
