import { atom } from 'jotai';
import { Ticket } from '../types/ticket';

// Main tickets atom - stores all tickets
export const ticketsAtom = atom<Ticket[]>([]);

// Derived atom for getting tickets count
export const ticketsCountAtom = atom((get) => get(ticketsAtom).length);

// Derived atom for getting tickets by status
export const publicTicketsAtom = atom((get) => 
  get(ticketsAtom).filter(ticket => ticket.status === '공개')
);

export const privateTicketsAtom = atom((get) => 
  get(ticketsAtom).filter(ticket => ticket.status === '비공개')
);

// Write atom for adding a new ticket
export const addTicketAtom = atom(
  null,
  (get, set, newTicket: Omit<Ticket, 'id' | 'updatedAt'>) => {
    const currentTickets = get(ticketsAtom);
    const ticket: Ticket = {
      ...newTicket,
      id: Date.now().toString(),
      updatedAt: new Date(),
      status: newTicket.status || '공개', // Default to '공개' if status is missing
    };
    set(ticketsAtom, [...currentTickets, ticket]);
  }
);

// Write atom for updating a ticket
export const updateTicketAtom = atom(
  null,
  (get, set, updatedTicket: Ticket) => {
    const currentTickets = get(ticketsAtom);
    const updatedTickets = currentTickets.map(ticket =>
      ticket.id === updatedTicket.id
        ? { ...updatedTicket, updatedAt: new Date() }
        : ticket
    );
    set(ticketsAtom, updatedTickets);
  }
);

// Write atom for deleting a ticket
export const deleteTicketAtom = atom(
  null,
  (get, set, ticketId: string) => {
    const currentTickets = get(ticketsAtom);
    const filteredTickets = currentTickets.filter(ticket => ticket.id !== ticketId);
    set(ticketsAtom, filteredTickets);
  }
);
