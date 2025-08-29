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
