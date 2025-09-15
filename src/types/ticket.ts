import { TicketStatus, TicketCategory } from './enums';

/**
 * 티켓 리뷰 인터페이스
 */
export interface TicketReview {
  reviewText: string;
  rating?: number; // 1-5 별점 (선택사항)
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * 기본 티켓 인터페이스 - 공통 속성 정의
 */
export interface BaseTicket {
  readonly id: string;
  title: string;
  performedAt: Date;
  status: TicketStatus;
  place?: string;
  artist?: string;
  bookingSite?: string;
  category?: TicketCategory;
  readonly userId: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

/**
 * 완전한 티켓 인터페이스 - 추가 속성 포함
 */
export interface Ticket extends BaseTicket {
  review?: TicketReview;
  images?: readonly string[];
  isPlaceholder?: boolean; // 빈 카드 전용 플래그
}

/**
 * 티켓 생성용 데이터 인터페이스
 */
export interface CreateTicketData extends Omit<BaseTicket, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  review?: Omit<TicketReview, 'createdAt' | 'updatedAt'>;
  images?: string[];
}

/**
 * 티켓 업데이트용 데이터 인터페이스
 */
export interface UpdateTicketData extends Partial<Omit<Ticket, 'id' | 'userId' | 'createdAt'>> {}

/**
 * 티켓 폼 데이터 인터페이스
 */
export interface TicketFormData extends Pick<BaseTicket, 'title' | 'performedAt' | 'status' | 'place' | 'artist' | 'bookingSite' | 'category'> {
  reviewText?: string;
  rating?: number;
  images?: string[];
}

/**
 * 티켓 필터 옵션
 */
export interface TicketFilterOptions {
  status?: TicketStatus;
  category?: TicketCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchText?: string;
}
