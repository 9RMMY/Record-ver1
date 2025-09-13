import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface PersonalInfoEditPageProps {
  navigation: any;
}

const PersonalInfoEditPage: React.FC<PersonalInfoEditPageProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // 현재 사용자 정보 (실제로는 상태 관리나 API에서 가져와야 함)
  const [userId, setUserId] = useState('ID1234');
  const [email, setEmail] = useState('user@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // 비밀번호 변경 시 유효성 검사
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword && !currentPassword) {
      Alert.alert('오류', '현재 비밀번호를 입력해주세요.');
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    Alert.alert(
      '저장 완료',
      '개인정보가 성공적으로 수정되었습니다.',
      [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const editFields = [
    {
      id: 1,
      title: '아이디',
      value: userId,
      onChangeText: setUserId,
      placeholder: '아이디를 입력하세요',
      keyboardType: 'default' as const,
      secureTextEntry: false,
    },
    {
      id: 2,
      title: '이메일',
      value: email,
      onChangeText: setEmail,
      placeholder: '이메일을 입력하세요',
      keyboardType: 'email-address' as const,
      secureTextEntry: false,
    },
  ];

  const passwordFields = [
    {
      id: 1,
      title: '현재 비밀번호',
      value: currentPassword,
      onChangeText: setCurrentPassword,
      placeholder: '현재 비밀번호를 입력하세요',
      secureTextEntry: true,
    },
    {
      id: 2,
      title: '새 비밀번호',
      value: newPassword,
      onChangeText: setNewPassword,
      placeholder: '새 비밀번호를 입력하세요',
      secureTextEntry: true,
    },
    {
      id: 3,
      title: '새 비밀번호 확인',
      value: confirmPassword,
      onChangeText: setConfirmPassword,
      placeholder: '새 비밀번호를 다시 입력하세요',
      secureTextEntry: true,
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
        <Text style={styles.headerTitle}>개인정보 수정</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.fieldContainer}>
            {editFields.map((field) => (
              <View key={field.id} style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>{field.title}</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  secureTextEntry={field.secureTextEntry}
                  placeholderTextColor="#ADB5BD"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <Text style={styles.sectionSubtitle}>
            비밀번호를 변경하지 않으려면 비워두세요
          </Text>
          <View style={styles.fieldContainer}>
            {passwordFields.map((field) => (
              <View key={field.id} style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>{field.title}</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  placeholder={field.placeholder}
                  secureTextEntry={field.secureTextEntry}
                  placeholderTextColor="#ADB5BD"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Password Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>비밀번호 설정 가이드</Text>
          <Text style={styles.guidelineText}>• 8자 이상 입력해주세요</Text>
          <Text style={styles.guidelineText}>• 영문, 숫자, 특수문자를 포함해주세요</Text>
          <Text style={styles.guidelineText}>• 개인정보와 관련된 내용은 피해주세요</Text>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#B11515',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 16,
  },
  fieldItem: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
  },
  guidelinesContainer: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
});

export default PersonalInfoEditPage;
