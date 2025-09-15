/**
 * 친구 관련 상태 관리 Atoms
 * 친구 목록과 친구별 티켓 데이터를 관리
 * 친구 프로필, 친구 추가, 친구 티켓 조회 기능 지원
 */
import { atom } from 'jotai';
import { Ticket } from '../types/ticket';

// 친구 정보 인터페이스
export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

// 친구별 티켓 데이터를 관리하는 타입
export interface FriendTickets {
  friendId: string;
  tickets: Ticket[];
}

// 친구 목록 atom - 현재 사용자의 친구들을 저장
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

// 친구별 티켓 데이터를 관리하는 atom
// 각 친구의 공개 티켓 목록을 저장 (실제로는 서버에서 가져와야 함)
export const friendTicketsAtom = atom<FriendTickets[]>([
  {
    friendId: '1', // 서현서의 티켓들
    tickets: [
      {
        id: 'friend1-ticket1',
        title: '콘서트 - 인디 밴드 라이브',
        performedAt: new Date('2025-09-10T19:00:00'),
        status: '공개',
        place: '홍대 롤링홀',
        artist: '라쿠나',
        createdAt: new Date('2025-08-01T10:00:00'),
      },
      {
        id: 'friend1-ticket2',
        title: '뮤지컬 - 캣츠',
        performedAt: new Date('2025-09-12T14:00:00'),
        status: '공개',
        place: '블루스퀘어 인터파크홀',
        artist: '뮤지컬 배우들',
        createdAt: new Date('2025-08-05T10:00:00'),
      },
    ],
  },
  {
    friendId: '2', // 민지의 티켓들
    tickets: [
      {
        id: 'friend2-ticket1',
        title: '오페라 - 라 보엠',
        performedAt: new Date('2025-09-18T19:30:00'),
        status: '공개',
        place: '예술의전당 오페라극장',
        artist: '친구와 함께',
        createdAt: new Date('2025-08-10T10:00:00'),
      },
    ],
  },
  {
    friendId: '3', // 이스 (티켓이 없는 친구)
    tickets: [],
  },
]);
