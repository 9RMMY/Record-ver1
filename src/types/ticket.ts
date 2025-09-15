// Base interface with shared properties
export interface BaseTicket {
  id: string;
  title: string;
  performedAt: Date;
  status: '공개' | '비공개';
  place?: string;
  artist?: string;
  bookingSite?: string;
  updatedAt?: Date;
  userId?: string;
  createdAt?: Date;
}

// Full ticket interface extending base with additional properties
export interface Ticket extends BaseTicket {
  review?: {
    reviewText: string;
  };
  images?: string[];
  isPlaceholder?: boolean; // 빈 카드 전용 플래그
}

// Form data interface using utility types to pick only required form fields
export interface TicketFormData extends Pick<BaseTicket, 'id' | 'title' | 'performedAt' | 'status' | 'place' | 'artist' | 'bookingSite'> {}
