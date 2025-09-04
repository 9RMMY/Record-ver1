export interface Ticket {
  id: string;
  title: string;
  performedAt: Date;
  place: string;
  artist: string;
  bookingSite: string;
  status: '공개' | '비공개' ;
  updatedAt: Date;
  userId?: string;
  review?: {
    reviewText: string;
  };
  images?: string[];
  createdAt: Date;

  isPlaceholder?: boolean; // 빈 카드 전용 플래그
}

export interface TicketFormData {
  id: string;
  title: string;
  performedAt: Date;
  place: string;
  artist: string;
  bookingSite: string;
  status: '공개' | '비공개' ;
}
