/**
 * 티켓 관련 기본값 상수
 * 하드코딩된 초기값을 중앙화하여 관리
 * 
 * @author TicketBookApp Team
 * @version 1.0.0
 * @since 2025-09-15
 */

import { Ticket, CreateTicketData, TicketFilterOptions } from '../types/ticket';
import { TicketStatus } from '../types/enums';
import { IdGenerator } from '../utils/idGenerator';

/**
 * 티켓 기본값
 */
export const DEFAULT_TICKET_VALUES = {
  STATUS: TicketStatus.PRIVATE,
  USER_ID: 'user_current', // 실제 앱에서는 인증 시스템에서 가져옴
  IMAGES: [] as string[],
} as const;

/**
 * 티켓 제한값
 */
export const TICKET_LIMITS = {
  MAX_TITLE_LENGTH: 100,
  MAX_REVIEW_LENGTH: 1000,
  MAX_IMAGES: 10,
  MAX_TICKETS_PER_USER: 500,
} as const;

/**
 * 필터링 기본값
 */
export const DEFAULT_FILTER_OPTIONS: TicketFilterOptions = {
  status: undefined,
  category: undefined,
  dateRange: undefined,
  searchText: undefined,
};

/**
 * 빈 티켓 데이터 생성 함수
 */
export const createEmptyTicket = (): Partial<Ticket> => ({
  id: '',
  title: '',
  performedAt: new Date(),
  status: DEFAULT_TICKET_VALUES.STATUS,
  place: '',
  artist: '',
  bookingSite: '',
  userId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  review: undefined,
  images: undefined,
  isPlaceholder: false,
});

/**
 * 새 티켓 생성 팩토리 함수
 */
export const createNewTicket = (
  ticketData: CreateTicketData, 
  userId: string
): Ticket => {
  const now = new Date();
  
  return {
    id: IdGenerator.ticket(),
    userId,
    createdAt: now,
    updatedAt: now,
    ...ticketData,
    review: ticketData.review ? {
      ...ticketData.review,
      createdAt: now,
      updatedAt: now,
    } : undefined,
    images: ticketData.images ? [...ticketData.images] : undefined,
  };
};

/**
 * 티켓 업데이트 팩토리 함수
 */
export const createUpdatedTicket = (
  existingTicket: Ticket,
  updateData: Partial<Ticket>
): Ticket => {
  const now = new Date();
  
  return {
    ...existingTicket,
    ...updateData,
    updatedAt: now,
    review: updateData.review ? {
      ...existingTicket.review,
      ...updateData.review,
      updatedAt: now,
    } : existingTicket.review,
  };
};

/**
 * 티켓 필터링 조건 검증
 */
export const TICKET_FILTER_FIELDS = [
  'status',
  'category', 
  'dateRange',
  'searchText'
] as const;

/**
 * 티켓 통계 계산을 위한 필드 정의
 */
export const TICKET_STATS_FIELDS = {
  TOTAL: 'total',
  PUBLIC: 'public',
  PRIVATE: 'private',
  WITH_REVIEWS: 'withReviews',
  WITH_IMAGES: 'withImages',
} as const;
