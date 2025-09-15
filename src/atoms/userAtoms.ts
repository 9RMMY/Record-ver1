/**
 * 사용자 프로필 상태 관리 Atoms
 * 사용자의 개인 정보와 계정 설정을 관리
 * 프로필 이미지, 이름, ID, 이메일, 계정 공개 설정 포함
 */
import { atom } from 'jotai';

// 사용자 프로필 인터페이스
export interface UserProfile {
  profileImage: string | null; // 프로필 이미지 URL (없으면 null)
  name: string; // 사용자 이름
  userId: string; // 사용자 ID
  email: string; // 이메일 주소
  isAccountPrivate: boolean; // 계정 비공개 설정 여부
}

// 사용자 프로필 atom - 기본 사용자 정보를 저장
export const userProfileAtom = atom<UserProfile>({
  profileImage: null,
  name: '사용자',
  userId: 'ID1234',
  email: 'user@example.com',
  isAccountPrivate: false, // 기본적으로 공개 계정
});
