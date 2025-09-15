/**
 * 친구 관련 상태 관리 Atoms
 * 현업 수준의 안정적이고 확장 가능한 친구 및 친구 관계 데이터 관리
 * Map 기반 구조로 성능 최적화 및 타입 안전성 보장
 */
import { atom } from 'jotai';
import { Friend, FriendRequest, Friendship, FriendTicketsMap, FriendSearchResult, CreateFriendRequestData, RespondToFriendRequestData } from '../types/friend';
import { Ticket } from '../types/ticket';
import { FriendRequestStatus, TicketStatus, CONSTANTS } from '../types/enums';
import { Result, ErrorFactory, ResultFactory } from '../types/errors';
import { userProfileAtom } from './userAtoms';
import { IdGenerator } from '../utils/idGenerator';
import { FriendValidator } from '../utils/validation';

// ============= 기본 상태 Atoms =============

/**
 * 친구 목록을 Map으로 관리 (성능 최적화)
 * key: friendId, value: Friend
 */
export const friendsMapAtom = atom<Map<string, Friend>>(new Map([
  ['friend_1', {
    id: 'friend_1',
    name: '서현서',
    username: 'wooyoungwoo29',
    profileImage: 'https://via.placeholder.com/50/20B2AA/FFFFFF?text=서',
    createdAt: new Date('2025-08-01T10:00:00'),
    updatedAt: new Date('2025-08-01T10:00:00'),
  }],
  ['friend_2', {
    id: 'friend_2',
    name: '민지',
    username: 'dxxrjh',
    profileImage: 'https://via.placeholder.com/50/8B4513/FFFFFF?text=민',
    createdAt: new Date('2025-08-02T10:00:00'),
    updatedAt: new Date('2025-08-02T10:00:00'),
  }],
  ['friend_3', {
    id: 'friend_3',
    name: '이스',
    username: 'cknvsp',
    profileImage: 'https://via.placeholder.com/50/708090/FFFFFF?text=이',
    createdAt: new Date('2025-08-03T10:00:00'),
    updatedAt: new Date('2025-08-03T10:00:00'),
  }],
]));

/**
 * 친구 요청 목록을 Map으로 관리
 * key: requestId, value: FriendRequest
 */
export const friendRequestsMapAtom = atom<Map<string, FriendRequest>>(new Map());

/**
 * 친구 관계 목록을 Map으로 관리
 * key: friendshipId, value: Friendship
 */
export const friendshipsMapAtom = atom<Map<string, Friendship>>(new Map());

/**
 * 친구별 티켓 데이터를 Map으로 관리 (캐시)
 * key: friendId, value: { tickets, lastUpdated }
 */
export const friendTicketsMapAtom = atom<FriendTicketsMap>({
  'friend_1': {
    tickets: [
      {
        id: 'friend1-ticket1',
        title: '콘서트 - 인디 밴드 라이브',
        performedAt: new Date('2025-09-10T19:00:00'),
        status: TicketStatus.PUBLIC,
        place: '홍대 롤링홀',
        artist: '라쿠나',
        userId: 'friend_1',
        createdAt: new Date('2025-08-01T10:00:00'),
        updatedAt: new Date('2025-08-01T10:00:00'),
      },
      {
        id: 'friend1-ticket2',
        title: '뮤지컬 - 캣츠',
        performedAt: new Date('2025-09-12T14:00:00'),
        status: TicketStatus.PUBLIC,
        place: '블루스퀘어 인터파크홀',
        artist: '뮤지컬 배우들',
        userId: 'friend_1',
        createdAt: new Date('2025-08-05T10:00:00'),
        updatedAt: new Date('2025-08-05T10:00:00'),
      },
    ],
    lastUpdated: new Date(),
  },
  'friend_2': {
    tickets: [
      {
        id: 'friend2-ticket1',
        title: '오페라 - 라 보엠',
        performedAt: new Date('2025-09-18T19:30:00'),
        status: TicketStatus.PUBLIC,
        place: '예술의전당 오페라극장',
        artist: '친구와 함께',
        userId: 'friend_2',
        createdAt: new Date('2025-08-10T10:00:00'),
        updatedAt: new Date('2025-08-10T10:00:00'),
      },
    ],
    lastUpdated: new Date(),
  },
  'friend_3': {
    tickets: [],
    lastUpdated: new Date(),
  },
});

// ============= 파생 Atoms (읽기 전용) =============

/**
 * 친구 목록을 배열로 변환 (기존 컴포넌트 호환성)
 */
export const friendsAtom = atom<Friend[]>((get) => {
  const friendsMap = get(friendsMapAtom);
  return Array.from(friendsMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name, 'ko')
  );
});

/**
 * 친구 총 개수
 */
export const friendsCountAtom = atom<number>((get) => {
  return get(friendsMapAtom).size;
});

/**
 * 받은 친구 요청 목록 (대기 중)
 */
export const receivedFriendRequestsAtom = atom<FriendRequest[]>((get) => {
  const requestsMap = get(friendRequestsMapAtom);
  return Array.from(requestsMap.values())
    .filter(request => request.status === FriendRequestStatus.PENDING)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

/**
 * 보낸 친구 요청 목록 (대기 중)
 */
export const sentFriendRequestsAtom = atom<FriendRequest[]>((get) => {
  const requestsMap = get(friendRequestsMapAtom);
  return Array.from(requestsMap.values())
    .filter(request => request.status === FriendRequestStatus.PENDING)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

/**
 * 특정 친구 조회
 */
export const getFriendByIdAtom = atom<(id: string) => Friend | undefined>((get) => {
  const friendsMap = get(friendsMapAtom);
  return (id: string) => friendsMap.get(id);
});

/**
 * 특정 친구의 티켓 목록 조회
 */
export const getFriendTicketsAtom = atom<(friendId: string) => Ticket[]>((get) => {
  const friendTicketsMap = get(friendTicketsMapAtom);
  return (friendId: string) => friendTicketsMap[friendId]?.tickets || [];
});

/**
 * 친구별 티켓 데이터 (기존 호환성)
 */
export const friendTicketsAtom = atom<Array<{ friendId: string; tickets: Ticket[] }>>((get) => {
  const friendTicketsMap = get(friendTicketsMapAtom);
  return Object.entries(friendTicketsMap).map(([friendId, data]) => ({
    friendId,
    tickets: data.tickets,
  }));
});

// ============= 쓰기 Atoms (액션) =============

/**
 * 친구 요청 보내기
 */
export const sendFriendRequestAtom = atom(
  null,
  (get, set, requestData: CreateFriendRequestData): Result<FriendRequest> => {
    try {
      // 유효성 검증
      const friendIdError = FriendValidator.validateFriendId(requestData.toUserId);
      if (friendIdError) return ResultFactory.failure(friendIdError);

      // 이미 친구인지 확인
      const friendsMap = get(friendsMapAtom);
      if (friendsMap.has(requestData.toUserId)) {
        return ResultFactory.failure(
          ErrorFactory.validation('이미 친구로 등록된 사용자입니다')
        );
      }

      // 이미 요청을 보냈는지 확인
      const requestsMap = get(friendRequestsMapAtom);
      const existingRequest = Array.from(requestsMap.values())
        .find(req => req.toUserId === requestData.toUserId && req.status === FriendRequestStatus.PENDING);
      
      if (existingRequest) {
        return ResultFactory.failure(
          ErrorFactory.validation('이미 친구 요청을 보낸 사용자입니다')
        );
      }

      // 새 친구 요청 생성
      const newRequest: FriendRequest = {
        id: IdGenerator.friendRequest(),
        fromUserId: get(userProfileAtom).id,
        toUserId: requestData.toUserId,
        name: requestData.name || 'Unknown User',
        username: requestData.username || '@unknown',
        status: FriendRequestStatus.PENDING,
        message: requestData.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Map에 추가
      const newRequestsMap = new Map(requestsMap);
      newRequestsMap.set(newRequest.id, newRequest);
      set(friendRequestsMapAtom, newRequestsMap);

      return ResultFactory.success(newRequest);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '친구 요청 전송 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 친구 요청 응답 (수락/거절)
 */
export const respondToFriendRequestAtom = atom(
  null,
  (get, set, responseData: RespondToFriendRequestData): Result<boolean> => {
    try {
      const requestsMap = get(friendRequestsMapAtom);
      const request = requestsMap.get(responseData.requestId);
      
      if (!request) {
        return ResultFactory.failure(ErrorFactory.notFound('친구 요청', responseData.requestId));
      }

      if (request.status !== FriendRequestStatus.PENDING) {
        return ResultFactory.failure(
          ErrorFactory.validation('이미 처리된 친구 요청입니다')
        );
      }

      // 요청 상태 업데이트
      const updatedRequest: FriendRequest = {
        ...request,
        status: responseData.accept ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.REJECTED,
        updatedAt: new Date(),
      };

      const newRequestsMap = new Map(requestsMap);
      newRequestsMap.set(request.id, updatedRequest);
      set(friendRequestsMapAtom, newRequestsMap);

      // 수락한 경우 친구 목록에 추가
      if (responseData.accept) {
        const friendsMap = get(friendsMapAtom);
        const friendshipsMap = get(friendshipsMapAtom);
        
        // 새 친구 추가 (실제로는 서버에서 사용자 정보를 가져와야 함)
        const newFriend: Friend = {
          id: request.fromUserId,
          name: '새 친구', // 실제로는 서버에서 가져온 정보
          username: 'newfriend',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const newFriendsMap = new Map(friendsMap);
        newFriendsMap.set(newFriend.id, newFriend);
        set(friendsMapAtom, newFriendsMap);

        // 친구 관계 추가
        const newFriendship: Friendship = {
          id: IdGenerator.friend(),
          userId: 'user_current',
          friendId: request.fromUserId,
          createdAt: new Date(),
          isBlocked: false,
          isMuted: false,
        };

        const newFriendshipsMap = new Map(friendshipsMap);
        newFriendshipsMap.set(newFriendship.id, newFriendship);
        set(friendshipsMapAtom, newFriendshipsMap);
      }

      return ResultFactory.success(true);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '친구 요청 응답 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 친구 삭제
 */
export const removeFriendAtom = atom(
  null,
  (get, set, friendId: string): Result<boolean> => {
    try {
      const friendsMap = get(friendsMapAtom);
      const friendshipsMap = get(friendshipsMapAtom);
      
      if (!friendsMap.has(friendId)) {
        return ResultFactory.failure(ErrorFactory.notFound('친구', friendId));
      }

      // 친구 목록에서 제거
      const newFriendsMap = new Map(friendsMap);
      newFriendsMap.delete(friendId);
      set(friendsMapAtom, newFriendsMap);

      // 친구 관계에서 제거
      const friendshipToRemove = Array.from(friendshipsMap.values())
        .find(friendship => friendship.friendId === friendId);
      
      if (friendshipToRemove) {
        const newFriendshipsMap = new Map(friendshipsMap);
        newFriendshipsMap.delete(friendshipToRemove.id);
        set(friendshipsMapAtom, newFriendshipsMap);
      }

      // 친구 티켓 캐시에서 제거
      const friendTicketsMap = get(friendTicketsMapAtom);
      const newFriendTicketsMap = { ...friendTicketsMap };
      delete newFriendTicketsMap[friendId];
      set(friendTicketsMapAtom, newFriendTicketsMap);

      return ResultFactory.success(true);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '친구 삭제 중 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 친구 티켓 데이터 업데이트 (서버에서 가져온 데이터로 캐시 갱신)
 */
export const updateFriendTicketsAtom = atom(
  null,
  (get, set, friendId: string, tickets: Ticket[]): Result<boolean> => {
    try {
      const friendTicketsMap = get(friendTicketsMapAtom);
      const newFriendTicketsMap = {
        ...friendTicketsMap,
        [friendId]: {
          tickets: [...tickets],
          lastUpdated: new Date(),
        },
      };
      
      set(friendTicketsMapAtom, newFriendTicketsMap);
      return ResultFactory.success(true);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '친구 티켓 데이터 업데이트 중 오류가 발생했습니다')
      );
    }
  }
);

// ============= 유틸리티 Atoms =============

/**
 * 친구 검색
 */
export const searchFriendsAtom = atom<(query: string) => Friend[]>((get) => {
  const friends = get(friendsAtom);
  return (query: string) => {
    if (!query.trim()) return friends;
    
    const searchLower = query.toLowerCase();
    return friends.filter(friend => 
      friend.name.toLowerCase().includes(searchLower) ||
      friend.username.toLowerCase().includes(searchLower)
    );
  };
});

/**
 * 친구 통계 정보
 */
export const friendStatsAtom = atom((get) => {
  const friendsCount = get(friendsCountAtom);
  const receivedRequests = get(receivedFriendRequestsAtom);
  const sentRequests = get(sentFriendRequestsAtom);
  const friendTicketsMap = get(friendTicketsMapAtom);
  
  const friendsWithTickets = Object.values(friendTicketsMap)
    .filter(data => data.tickets.length > 0).length;
  
  return {
    totalFriends: friendsCount,
    pendingReceivedRequests: receivedRequests.length,
    pendingSentRequests: sentRequests.length,
    friendsWithTickets,
  };
});
