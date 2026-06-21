import { z } from "zod";
import { TicketPriority, TicketStatus } from "@/generated/prisma/enums";

const ticketStatusValues = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_USER,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.CANCELED,
] as const;

const ticketPriorityValues = [
  TicketPriority.LOW,
  TicketPriority.MEDIUM,
  TicketPriority.HIGH,
  TicketPriority.CRITICAL,
] as const;

export const ticketFiltersSchema = z.object({
  status: z.enum(ticketStatusValues).optional(),
  priority: z.enum(ticketPriorityValues).optional(),
});

export type TicketFilters = z.infer<typeof ticketFiltersSchema>;

export const ticketStatusOptions = ticketStatusValues;
export const ticketPriorityOptions = ticketPriorityValues;

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseTicketFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return ticketFiltersSchema.safeParse({
    status: getFirstSearchParam(searchParams.status) || undefined,
    priority: getFirstSearchParam(searchParams.priority) || undefined,
  });
}
