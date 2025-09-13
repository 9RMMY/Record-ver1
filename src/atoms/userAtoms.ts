import { atom } from 'jotai';

export interface UserProfile {
  profileImage: string | null;
  name: string;
  userId: string;
  email: string;
  isAccountPrivate: boolean;
}

export const userProfileAtom = atom<UserProfile>({
  profileImage: null,
  name: '사용자',
  userId: 'ID1234',
  email: 'user@example.com',
  isAccountPrivate: false,
});
