/**
 * 사용자 상태 관리 Atoms
 * 프로필, 설정, 인증 정보를 모듈화하여 관리
 * 현업 수준의 안정적이고 확장 가능한 사용자 데이터 관리
 */
import { atom } from 'jotai';
import { UserProfile, UserSettings, UserAuth, UpdateUserProfileData, UpdateUserSettingsData } from '../types/user';
import { AccountVisibility, UserRole, CONSTANTS } from '../types/enums';
import { Result, ErrorFactory, ResultFactory } from '../types/errors';
import { IdGenerator } from '../utils/idGenerator';
import { UserValidator } from '../utils/validation';

// ============= 기본 상태 Atoms =============

/**
 * 사용자 프로필 정보 atom
 */
export const userProfileAtom = atom<UserProfile>({
  id: IdGenerator.user(),
  name: '사용자',
  username: 'user1234',
  email: 'user@example.com',
  profileImage: undefined,
  bio: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * 사용자 설정 atom
 */
export const userSettingsAtom = atom<UserSettings>({
  userId: 'user_current',
  accountVisibility: AccountVisibility.PUBLIC,
  allowFriendRequests: true,
  showTicketsToFriends: true,
  emailNotifications: true,
  pushNotifications: true,
  language: 'ko',
  theme: 'system',
  updatedAt: new Date(),
});

/**
 * 사용자 인증 정보 atom (민감한 정보)
 */
export const userAuthAtom = atom<UserAuth>({
  userId: 'user_current',
  role: UserRole.USER,
  lastLoginAt: new Date(),
  isEmailVerified: false,
  createdAt: new Date(),
});

// ============= 파생 Atoms (읽기 전용) =============

/**
 * 현재 사용자 ID 조회
 */
export const currentUserIdAtom = atom<string>((get) => {
  return get(userProfileAtom).id;
});

/**
 * 사용자 표시 이름 (이름 또는 사용자명)
 */
export const userDisplayNameAtom = atom<string>((get) => {
  const profile = get(userProfileAtom);
  return profile.name || profile.username;
});

/**
 * 계정 공개 여부 확인
 */
export const isAccountPublicAtom = atom<boolean>((get) => {
  const settings = get(userSettingsAtom);
  return settings.accountVisibility === AccountVisibility.PUBLIC;
});

/**
 * 사용자 프로필 완성도
 */
export const profileCompletenessAtom = atom<number>((get) => {
  const profile = get(userProfileAtom);
  let completeness = 0;
  const totalFields = 5;
  
  if (profile.name) completeness++;
  if (profile.username) completeness++;
  if (profile.email) completeness++;
  if (profile.profileImage) completeness++;
  if (profile.bio) completeness++;
  
  return Math.round((completeness / totalFields) * 100);
});

// ============= 쓰기 Atoms (액션) =============

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfileAtom = atom(
  null,
  (get, set, updateData: UpdateUserProfileData): Result<UserProfile> => {
    try {
      const currentProfile = get(userProfileAtom);
      
      // 유효성 검증
      if (updateData.name !== undefined) {
        const nameError = UserValidator.validateName(updateData.name);
        if (nameError) return ResultFactory.failure(nameError);
      }
      
      if (updateData.username !== undefined) {
        const usernameError = UserValidator.validateUserId(updateData.username);
        if (usernameError) return ResultFactory.failure(usernameError);
      }
      
      if (updateData.email !== undefined) {
        const emailError = UserValidator.validateEmail(updateData.email);
        if (emailError) return ResultFactory.failure(emailError);
      }
      
      // 업데이트된 프로필 생성
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...updateData,
        updatedAt: new Date(),
      };
      
      set(userProfileAtom, updatedProfile);
      return ResultFactory.success(updatedProfile);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 사용자 설정 업데이트
 */
export const updateUserSettingsAtom = atom(
  null,
  (get, set, updateData: UpdateUserSettingsData): Result<UserSettings> => {
    try {
      const currentSettings = get(userSettingsAtom);
      
      // 유효성 검증
      if (updateData.accountVisibility !== undefined) {
        const visibilityError = UserValidator.validateAccountVisibility(updateData.accountVisibility);
        if (visibilityError) return ResultFactory.failure(visibilityError);
      }
      
      // 업데이트된 설정 생성
      const updatedSettings: UserSettings = {
        ...currentSettings,
        ...updateData,
        updatedAt: new Date(),
      };
      
      set(userSettingsAtom, updatedSettings);
      return ResultFactory.success(updatedSettings);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '설정 업데이트 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 이메일 인증 상태 업데이트
 */
export const updateEmailVerificationAtom = atom(
  null,
  (get, set, isVerified: boolean): Result<UserAuth> => {
    try {
      const currentAuth = get(userAuthAtom);
      const updatedAuth: UserAuth = {
        ...currentAuth,
        isEmailVerified: isVerified,
      };
      
      set(userAuthAtom, updatedAuth);
      return ResultFactory.success(updatedAuth);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '이메일 인증 상태 업데이트 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 마지막 로그인 시간 업데이트
 */
export const updateLastLoginAtom = atom(
  null,
  (get, set): Result<UserAuth> => {
    try {
      const currentAuth = get(userAuthAtom);
      const updatedAuth: UserAuth = {
        ...currentAuth,
        lastLoginAt: new Date(),
      };
      
      set(userAuthAtom, updatedAuth);
      return ResultFactory.success(updatedAuth);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '로그인 시간 업데이트 중 오류가 발생했습니다')
      );
    }
  }
);

// ============= 유틸리티 Atoms =============

/**
 * 사용자 데이터 초기화 (로그아웃 시 사용)
 */
export const resetUserDataAtom = atom(
  null,
  (get, set): void => {
    // 기본값으로 초기화
    set(userProfileAtom, {
      id: '',
      name: '',
      username: '',
      email: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    set(userSettingsAtom, {
      userId: '',
      accountVisibility: AccountVisibility.PUBLIC,
      allowFriendRequests: true,
      showTicketsToFriends: true,
      emailNotifications: true,
      pushNotifications: true,
      language: 'ko',
      theme: 'system',
      updatedAt: new Date(),
    });
    
    set(userAuthAtom, {
      userId: '',
      role: UserRole.USER,
      isEmailVerified: false,
      createdAt: new Date(),
    });
  }
);
