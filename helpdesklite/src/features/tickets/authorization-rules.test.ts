import { describe, expect, it } from "vitest";
import { TicketStatus, UserRole } from "@/generated/prisma/enums";
import {
  canAssignTicketByRole,
  canChangeTicketStatusByRole,
  canCommentOnTicketByRole,
  canCreateTicketByRole,
  canTransitionTicketStatusByRole,
  isTicketVisibleToUser,
  type AuthorizationUser,
} from "./authorization-rules";

const requester: AuthorizationUser = {
  id: "requester-1",
  role: UserRole.REQUESTER,
};

const technician: AuthorizationUser = {
  id: "technician-1",
  role: UserRole.TECHNICIAN,
};

const otherTechnician: AuthorizationUser = {
  id: "technician-2",
  role: UserRole.TECHNICIAN,
};

const admin: AuthorizationUser = {
  id: "admin-1",
  role: UserRole.ADMIN,
};

const assignedTicket = {
  requesterId: requester.id,
  assigneeId: technician.id,
  status: TicketStatus.IN_PROGRESS,
};

describe("ticket authorization rules", () => {
  it("scopes ticket visibility by role", () => {
    expect(isTicketVisibleToUser(requester, assignedTicket)).toBe(true);
    expect(isTicketVisibleToUser(technician, assignedTicket)).toBe(true);
    expect(isTicketVisibleToUser(admin, assignedTicket)).toBe(true);
    expect(isTicketVisibleToUser(otherTechnician, assignedTicket)).toBe(false);
  });

  it("allows only requesters to create tickets", () => {
    expect(canCreateTicketByRole(requester)).toBe(true);
    expect(canCreateTicketByRole(technician)).toBe(false);
    expect(canCreateTicketByRole(admin)).toBe(false);
  });

  it("blocks comments on closed tickets except for admins", () => {
    const closedTicket = {
      ...assignedTicket,
      status: TicketStatus.CLOSED,
    };

    expect(canCommentOnTicketByRole(requester, closedTicket)).toBe(false);
    expect(canCommentOnTicketByRole(technician, closedTicket)).toBe(false);
    expect(canCommentOnTicketByRole(admin, closedTicket)).toBe(true);
  });

  it("allows status changes only for admins or assigned technicians", () => {
    expect(canChangeTicketStatusByRole(technician, assignedTicket)).toBe(true);
    expect(canChangeTicketStatusByRole(admin, assignedTicket)).toBe(true);
    expect(canChangeTicketStatusByRole(requester, assignedTicket)).toBe(false);
    expect(canChangeTicketStatusByRole(otherTechnician, assignedTicket)).toBe(
      false,
    );
  });

  it("allows only admins to assign tickets", () => {
    expect(canAssignTicketByRole(admin)).toBe(true);
    expect(canAssignTicketByRole(technician)).toBe(false);
    expect(canAssignTicketByRole(requester)).toBe(false);
  });

  it("enforces technician status transitions", () => {
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.OPEN,
        TicketStatus.IN_PROGRESS,
      ),
    ).toBe(true);
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.OPEN,
        TicketStatus.RESOLVED,
      ),
    ).toBe(false);
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.IN_PROGRESS,
        TicketStatus.WAITING_USER,
      ),
    ).toBe(true);
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.WAITING_USER,
        TicketStatus.RESOLVED,
      ),
    ).toBe(true);
  });

  it("blocks technician changes from terminal statuses", () => {
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.CLOSED,
        TicketStatus.IN_PROGRESS,
      ),
    ).toBe(false);
    expect(
      canTransitionTicketStatusByRole(
        technician,
        TicketStatus.CANCELED,
        TicketStatus.IN_PROGRESS,
      ),
    ).toBe(false);
  });

  it("allows admins to transition any status", () => {
    expect(
      canTransitionTicketStatusByRole(
        admin,
        TicketStatus.CLOSED,
        TicketStatus.OPEN,
      ),
    ).toBe(true);
    expect(
      canTransitionTicketStatusByRole(
        admin,
        TicketStatus.OPEN,
        TicketStatus.CANCELED,
      ),
    ).toBe(true);
  });
});
