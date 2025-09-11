// atoms/friendsAtoms.ts
import { atom } from 'jotai';

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export const friendsAtom = atom<Friend[]>([
  {
    id: '1',
    name: '서현서',
    username: 'wooyoungwoo29',
    avatar: 'https://via.placeholder.com/50/20B2AA/FFFFFF?text=서',
  },
  {
    id: '2',
    name: '민지',
    username: 'dxxrjh',
    avatar: 'https://via.placeholder.com/50/8B4513/FFFFFF?text=민',
  },
  {
    id: '3',
    name: '이스',
    username: 'cknvsp',
    avatar: 'https://via.placeholder.com/50/708090/FFFFFF?text=이',
  },
]);
