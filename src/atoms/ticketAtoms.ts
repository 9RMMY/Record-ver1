/**
 * 티켓 상태 관리 Atoms
 * 현업 수준의 안정적이고 확장 가능한 티켓 데이터 관리
 * Map 기반 구조로 성능 최적화 및 타입 안전성 보장
 */
import { atom } from 'jotai';
import { Ticket, CreateTicketData, UpdateTicketData, TicketFilterOptions } from '../types/ticket';
import { TicketStatus, CONSTANTS } from '../types/enums';
import { Result, ErrorFactory, ResultFactory } from '../types/errors';
import { IdGenerator } from '../utils/idGenerator';
import { TicketValidator } from '../utils/validation';

/**
 * 티켓 데이터를 Map으로 관리 (성능 최적화)
 * key: ticketId, value: Ticket
 */
export const ticketsMapAtom = atom<Map<string, Ticket>>(new Map());

/**
 * 현재 사용자 ID atom (실제 앱에서는 인증 시스템에서 가져옴)
 */
export const currentUserIdAtom = atom<string>('user_current');

// ============= 파생 Atoms (읽기 전용) =============

/**
 * 티켓 배열로 변환 (기존 컴포넌트 호환성)
 */
export const ticketsAtom = atom<Ticket[]>((get) => {
  const ticketsMap = get(ticketsMapAtom);
  return Array.from(ticketsMap.values()).sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
});

/**
 * 티켓 총 개수
 */
export const ticketsCountAtom = atom<number>((get) => {
  return get(ticketsMapAtom).size;
});

/**
 * 공개 티켓만 필터링
 */
export const publicTicketsAtom = atom<Ticket[]>((get) => {
  const tickets = get(ticketsAtom);
  return tickets.filter(ticket => ticket.status === TicketStatus.PUBLIC);
});

/**
 * 비공개 티켓만 필터링
 */
export const privateTicketsAtom = atom<Ticket[]>((get) => {
  const tickets = get(ticketsAtom);
  return tickets.filter(ticket => ticket.status === TicketStatus.PRIVATE);
});

/**
 * 필터링된 티켓 목록
 */
export const filteredTicketsAtom = atom<Ticket[]>((get) => {
  // 기본적으로 모든 티켓 반환 (필터 옵션은 별도 atom으로 관리)
  return get(ticketsAtom);
});

/**
 * 특정 티켓 조회
 */
export const getTicketByIdAtom = atom<(id: string) => Ticket | undefined>((get) => {
  const ticketsMap = get(ticketsMapAtom);
  return (id: string) => ticketsMap.get(id);
});

// ============= 쓰기 Atoms (액션) =============

/**
 * 새 티켓 추가 (유효성 검증 포함)
 */
export const addTicketAtom = atom(
  null,
  (get, set, ticketData: CreateTicketData): Result<Ticket> => {
    try {
      // 유효성 검증
      const titleError = TicketValidator.validateTitle(ticketData.title);
      if (titleError) return ResultFactory.failure(titleError);

      const dateError = TicketValidator.validatePerformedAt(ticketData.performedAt);
      if (dateError) return ResultFactory.failure(dateError);

      const statusError = TicketValidator.validateStatus(ticketData.status);
      if (statusError) return ResultFactory.failure(statusError);

      if (ticketData.review?.reviewText) {
        const reviewError = TicketValidator.validateReviewText(ticketData.review.reviewText);
        if (reviewError) return ResultFactory.failure(reviewError);
      }

      // 현재 티켓 수 제한 확인
      const currentCount = get(ticketsCountAtom);
      if (currentCount >= CONSTANTS.LIMITS.MAX_TICKETS_PER_USER) {
        return ResultFactory.failure(
          ErrorFactory.validation(`최대 ${CONSTANTS.LIMITS.MAX_TICKETS_PER_USER}개의 티켓만 생성할 수 있습니다`)
        );
      }

      const currentUserId = get(currentUserIdAtom);
      const now = new Date();
      
      // 새 티켓 생성
      const newTicket: Ticket = {
        id: IdGenerator.ticket(),
        userId: currentUserId,
        createdAt: now,
        updatedAt: now,
        ...ticketData,
        review: ticketData.review ? {
          ...ticketData.review,
          createdAt: now,
        } : undefined,
        images: ticketData.images ? [...ticketData.images] : undefined,
      };

      // Map에 추가
      const currentMap = get(ticketsMapAtom);
      const newMap = new Map(currentMap);
      newMap.set(newTicket.id, newTicket);
      set(ticketsMapAtom, newMap);

      return ResultFactory.success(newTicket);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 기존 티켓 수정 (유효성 검증 포함)
 */
export const updateTicketAtom = atom(
  null,
  (get, set, ticketId: string, updateData: UpdateTicketData): Result<Ticket> => {
    try {
      const currentMap = get(ticketsMapAtom);
      const existingTicket = currentMap.get(ticketId);
      
      if (!existingTicket) {
        return ResultFactory.failure(ErrorFactory.notFound('티켓', ticketId));
      }

      // 권한 확인 (본인 티켓만 수정 가능)
      const currentUserId = get(currentUserIdAtom);
      if (existingTicket.userId !== currentUserId) {
        return ResultFactory.failure(ErrorFactory.permissionDenied('티켓 수정'));
      }

      // 유효성 검증
      if (updateData.title !== undefined) {
        const titleError = TicketValidator.validateTitle(updateData.title);
        if (titleError) return ResultFactory.failure(titleError);
      }

      if (updateData.performedAt !== undefined) {
        const dateError = TicketValidator.validatePerformedAt(updateData.performedAt);
        if (dateError) return ResultFactory.failure(dateError);
      }

      if (updateData.status !== undefined) {
        const statusError = TicketValidator.validateStatus(updateData.status);
        if (statusError) return ResultFactory.failure(statusError);
      }

      if (updateData.review?.reviewText) {
        const reviewError = TicketValidator.validateReviewText(updateData.review.reviewText);
        if (reviewError) return ResultFactory.failure(reviewError);
      }

      // 업데이트된 티켓 생성
      const updatedTicket: Ticket = {
        ...existingTicket,
        ...updateData,
        updatedAt: new Date(),
        review: updateData.review ? {
          ...existingTicket.review,
          ...updateData.review,
          updatedAt: new Date(),
        } : existingTicket.review,
      };

      // Map 업데이트
      const newMap = new Map(currentMap);
      newMap.set(ticketId, updatedTicket);
      set(ticketsMapAtom, newMap);

      return ResultFactory.success(updatedTicket);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 티켓 삭제 (권한 확인 포함)
 */
export const deleteTicketAtom = atom(
  null,
  (get, set, ticketId: string): Result<boolean> => {
    try {
      const currentMap = get(ticketsMapAtom);
      const existingTicket = currentMap.get(ticketId);
      
      if (!existingTicket) {
        return ResultFactory.failure(ErrorFactory.notFound('티켓', ticketId));
      }

      // 권한 확인 (본인 티켓만 삭제 가능)
      const currentUserId = get(currentUserIdAtom);
      if (existingTicket.userId !== currentUserId) {
        return ResultFactory.failure(ErrorFactory.permissionDenied('티켓 삭제'));
      }

      // Map에서 제거
      const newMap = new Map(currentMap);
      newMap.delete(ticketId);
      set(ticketsMapAtom, newMap);

      return ResultFactory.success(true);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
      );
    }
  }
);

/**
 * 여러 티켓 일괄 삭제
 */
export const bulkDeleteTicketsAtom = atom(
  null,
  (get, set, ticketIds: string[]): Result<number> => {
    try {
      const currentMap = get(ticketsMapAtom);
      const currentUserId = get(currentUserIdAtom);
      const newMap = new Map(currentMap);
      let deletedCount = 0;

      for (const ticketId of ticketIds) {
        const ticket = currentMap.get(ticketId);
        if (ticket && ticket.userId === currentUserId) {
          newMap.delete(ticketId);
          deletedCount++;
        }
      }

      set(ticketsMapAtom, newMap);
      return ResultFactory.success(deletedCount);
    } catch (error) {
      return ResultFactory.failure(
        ErrorFactory.unknown(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
      );
    }
  }
);

// ============= 유틸리티 Atoms =============

/**
 * 티켓 필터링 (검색, 카테고리, 날짜 범위 등)
 */
export const createFilteredTicketsAtom = (filterOptions: TicketFilterOptions) => atom<Ticket[]>((get) => {
  let tickets = get(ticketsAtom);

  // 상태 필터
  if (filterOptions.status) {
    tickets = tickets.filter(ticket => ticket.status === filterOptions.status);
  }

  // 카테고리 필터
  if (filterOptions.category) {
    tickets = tickets.filter(ticket => ticket.category === filterOptions.category);
  }

  // 날짜 범위 필터
  if (filterOptions.dateRange) {
    const { start, end } = filterOptions.dateRange;
    tickets = tickets.filter(ticket => {
      const performedAt = ticket.performedAt;
      return performedAt >= start && performedAt <= end;
    });
  }

  // 텍스트 검색
  if (filterOptions.searchText) {
    const searchLower = filterOptions.searchText.toLowerCase();
    tickets = tickets.filter(ticket => 
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.artist?.toLowerCase().includes(searchLower) ||
      ticket.place?.toLowerCase().includes(searchLower)
    );
  }

  return tickets;
});

/**
 * 티켓 통계 정보
 */
export const ticketStatsAtom = atom((get) => {
  const tickets = get(ticketsAtom);
  const publicCount = tickets.filter(t => t.status === TicketStatus.PUBLIC).length;
  const privateCount = tickets.filter(t => t.status === TicketStatus.PRIVATE).length;
  
  return {
    total: tickets.length,
    public: publicCount,
    private: privateCount,
    withReviews: tickets.filter(t => t.review?.reviewText).length,
    withImages: tickets.filter(t => t.images && t.images.length > 0).length,
  };
});
