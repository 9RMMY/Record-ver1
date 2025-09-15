/**
 * 티켓 전용 헬퍼 유틸리티
 * 티켓 관련 공통 패턴과 최적화를 표준화
 * 
 * @author TicketBookApp Team
 * @version 1.0.0
 * @since 2025-09-15
 */

import { Ticket, CreateTicketData, UpdateTicketData, TicketFilterOptions } from '../types/ticket';
import { TicketStatus, CONSTANTS } from '../types/enums';
import { Result, ErrorFactory, ResultFactory } from '../types/errors';
import { TicketValidator } from './validation';
import { ValidationRule, withErrorHandling, validateFields } from './atomHelpers';
import { TICKET_LIMITS } from '../constants/ticketDefaults';

/**
 * 티켓 검증 규칙 정의
 */
export const TICKET_VALIDATION_RULES: ValidationRule<CreateTicketData>[] = [
  {
    field: 'title',
    validator: (title: string) => {
      if (!title || title.trim().length === 0) {
        return new Error('제목은 필수입니다');
      }
      if (title.length > TICKET_LIMITS.MAX_TITLE_LENGTH) {
        return new Error(`제목은 ${TICKET_LIMITS.MAX_TITLE_LENGTH}자를 초과할 수 없습니다`);
      }
      return null;
    }
  },
  {
    field: 'performedAt',
    validator: (date: Date) => {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return new Error('올바른 공연 날짜를 입력해주세요');
      }
      return null;
    }
  },
  {
    field: 'status',
    validator: (status: TicketStatus) => {
      if (!Object.values(TicketStatus).includes(status)) {
        return new Error('올바른 티켓 상태를 선택해주세요');
      }
      return null;
    }
  }
];

/**
 * 티켓 업데이트 검증 규칙
 */
export const TICKET_UPDATE_VALIDATION_RULES: ValidationRule<UpdateTicketData>[] = [
  {
    field: 'title',
    validator: (title: string) => {
      if (title !== undefined && (!title || title.trim().length === 0)) {
        return new Error('제목은 비어있을 수 없습니다');
      }
      if (title && title.length > TICKET_LIMITS.MAX_TITLE_LENGTH) {
        return new Error(`제목은 ${TICKET_LIMITS.MAX_TITLE_LENGTH}자를 초과할 수 없습니다`);
      }
      return null;
    }
  },
  {
    field: 'performedAt',
    validator: (date: Date) => {
      if (date !== undefined && (!date || !(date instanceof Date) || isNaN(date.getTime()))) {
        return new Error('올바른 공연 날짜를 입력해주세요');
      }
      return null;
    }
  },
  {
    field: 'status',
    validator: (status: TicketStatus) => {
      if (status !== undefined && !Object.values(TicketStatus).includes(status)) {
        return new Error('올바른 티켓 상태를 선택해주세요');
      }
      return null;
    }
  }
];

/**
 * 통합 티켓 검증 함수
 */
export const validateTicketData = <T extends CreateTicketData | UpdateTicketData>(
  data: T,
  isUpdate = false
): Error | null => {
  const rules = isUpdate ? TICKET_UPDATE_VALIDATION_RULES : TICKET_VALIDATION_RULES;
  return validateFields(data, rules as ValidationRule<T>[]);
};

/**
 * 티켓 제한 검증
 */
export const validateTicketLimits = (currentCount: number): Error | null => {
  if (currentCount >= TICKET_LIMITS.MAX_TICKETS_PER_USER) {
    return new Error(`최대 ${TICKET_LIMITS.MAX_TICKETS_PER_USER}개의 티켓만 생성할 수 있습니다`);
  }
  return null;
};

/**
 * 리뷰 텍스트 검증
 */
export const validateReviewText = (reviewText?: string): Error | null => {
  if (reviewText && reviewText.length > TICKET_LIMITS.MAX_REVIEW_LENGTH) {
    return new Error(`리뷰는 ${TICKET_LIMITS.MAX_REVIEW_LENGTH}자를 초과할 수 없습니다`);
  }
  return null;
};

/**
 * 통합 필터링 함수
 */
export const applyTicketFilters = (
  tickets: Ticket[],
  filterOptions: TicketFilterOptions
): Ticket[] => {
  const filters: Array<(ticket: Ticket) => boolean> = [];

  // 상태 필터
  if (filterOptions.status) {
    filters.push(ticket => ticket.status === filterOptions.status);
  }

  // 카테고리 필터
  if (filterOptions.category) {
    filters.push(ticket => ticket.category === filterOptions.category);
  }

  // 날짜 범위 필터
  if (filterOptions.dateRange) {
    const { start, end } = filterOptions.dateRange;
    filters.push(ticket => {
      const performedAt = ticket.performedAt;
      return performedAt >= start && performedAt <= end;
    });
  }

  // 텍스트 검색 필터
  if (filterOptions.searchText) {
    const searchLower = filterOptions.searchText.toLowerCase();
    filters.push(ticket => {
      const titleMatch = ticket.title.toLowerCase().includes(searchLower);
      const artistMatch = ticket.artist?.toLowerCase().includes(searchLower) ?? false;
      const placeMatch = ticket.place?.toLowerCase().includes(searchLower) ?? false;
      return titleMatch || artistMatch || placeMatch;
    });
  }

  // 모든 필터 적용
  return tickets.filter(ticket => filters.every(filter => filter(ticket)));
};

/**
 * 티켓 상태별 필터링 함수
 */
export const filterTicketsByStatus = (
  tickets: Ticket[],
  status: TicketStatus
): Ticket[] => {
  return tickets.filter(ticket => ticket.status === status);
};

/**
 * 티켓 통계 계산 함수
 */
export const calculateTicketStats = (tickets: Ticket[]) => {
  const publicCount = tickets.filter(t => t.status === TicketStatus.PUBLIC).length;
  const privateCount = tickets.filter(t => t.status === TicketStatus.PRIVATE).length;
  
  return {
    total: tickets.length,
    public: publicCount,
    private: privateCount,
    withReviews: tickets.filter(t => t.review?.reviewText).length,
    withImages: tickets.filter(ticket => ticket.images && ticket.images.length > 0).length,
  };
};

/**
 * 벌크 삭제 결과 타입
 */
export interface BulkDeleteResult {
  deletedCount: number;
  deletedIds: string[];
  failedIds: string[];
  errors: Array<{ id: string; reason: string }>;
}

/**
 * 벌크 삭제 헬퍼 함수
 */
export const processBulkDelete = (
  ticketsMap: Map<string, Ticket>,
  ticketIds: string[],
  currentUserId: string
): BulkDeleteResult => {
  const result: BulkDeleteResult = {
    deletedCount: 0,
    deletedIds: [],
    failedIds: [],
    errors: []
  };

  for (const ticketId of ticketIds) {
    const ticket = ticketsMap.get(ticketId);
    
    if (!ticket) {
      result.failedIds.push(ticketId);
      result.errors.push({ id: ticketId, reason: '티켓을 찾을 수 없습니다' });
      continue;
    }
    
    if (ticket.userId !== currentUserId) {
      result.failedIds.push(ticketId);
      result.errors.push({ id: ticketId, reason: '삭제 권한이 없습니다' });
      continue;
    }
    
    result.deletedIds.push(ticketId);
    result.deletedCount++;
  }

  return result;
};
