/**
 * 티켓 상태 관리 Atoms
 * Jotai를 사용하여 앱 전체의 티켓 데이터를 관리
 * 티켓 추가, 수정, 삭제 및 필터링 기능 제공
 */
import { atom } from 'jotai';
import { Ticket } from '../types/ticket';

// 메인 티켓 atom - 모든 티켓 데이터를 저장
export const ticketsAtom = atom<Ticket[]>([]);

// 파생 atom - 티켓 총 개수를 반환
export const ticketsCountAtom = atom((get) => get(ticketsAtom).length);

// 파생 atom - 상태별 티켓 필터링
// 공개 상태 티켓만 필터링
export const publicTicketsAtom = atom((get) => 
  get(ticketsAtom).filter(ticket => ticket.status === '공개')
);

// 비공개 상태 티켓만 필터링
export const privateTicketsAtom = atom((get) => 
  get(ticketsAtom).filter(ticket => ticket.status === '비공개')
);

// 쓰기 atom - 새 티켓 추가
export const addTicketAtom = atom(
  null,
  (get, set, newTicket: Omit<Ticket, 'id' | 'updatedAt'>) => {
    const currentTickets = get(ticketsAtom);
    const ticket: Ticket = {
      ...newTicket,
      id: Date.now().toString(), // 현재 시간을 ID로 사용
      updatedAt: new Date(), // 업데이트 시간 설정
      status: newTicket.status || '공개', // 상태가 없으면 기본값 '공개'로 설정
    };
    set(ticketsAtom, [...currentTickets, ticket]);
  }
);

// 쓰기 atom - 기존 티켓 수정
export const updateTicketAtom = atom(
  null,
  (get, set, updatedTicket: Ticket) => {
    const currentTickets = get(ticketsAtom);
    const updatedTickets = currentTickets.map(ticket =>
      ticket.id === updatedTicket.id
        ? { ...updatedTicket, updatedAt: new Date() } // 해당 티켓 업데이트 및 수정 시간 갱신
        : ticket // 다른 티켓은 그대로 유지
    );
    set(ticketsAtom, updatedTickets);
  }
);

// 쓰기 atom - 티켓 삭제
export const deleteTicketAtom = atom(
  null,
  (get, set, ticketId: string) => {
    const currentTickets = get(ticketsAtom);
    // 해당 ID의 티켓을 제외한 나머지 티켓들로 필터링
    const filteredTickets = currentTickets.filter(ticket => ticket.id !== ticketId);
    set(ticketsAtom, filteredTickets);
  }
);
