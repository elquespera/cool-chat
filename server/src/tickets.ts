import { randomUUID } from "crypto";

export const openTickets: Record<string, number> = {};

const cleanUpInterval = 1000 * 60;
const ticketLifetime = 1000 * 60 * 60 * 24;

setInterval(() => {
  Object.entries(openTickets).forEach(([ticket, time]) => {
    if (Date.now() - time > ticketLifetime) {
      delete openTickets[ticket];
    }
  });
}, cleanUpInterval);

export const hasTicket = (ticket: string) =>
  Object.keys(openTickets).includes(ticket);

export const addTicket = () => {
  const ticket = randomUUID();
  openTickets[ticket] = Date.now();
  return ticket;
};

export const openTicketCount = () => Object.keys(openTickets).length;
