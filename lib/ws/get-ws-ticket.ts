"use server";

import { socketRoutes } from "@/server/src/socket-routes";
import { fetchHMAC } from "../hmac";
import { withAuth } from "@/db/actions/with-auth";

const ticketURL = `${process.env.WS_AUTH_URL}${socketRoutes.auth}`;
const secret = process.env.HMAC_SECRET!;

export const getWebsocketTicket = async () =>
  withAuth<string>(async (user) => {
    try {
      const response = await fetchHMAC(
        `${ticketURL}?userId=${user.id}`,
        { method: "GET" },
        secret,
      );
      if (!response.ok) return;
      const { ticket } = await response.json();
      if (typeof ticket !== "string") return;
      return ticket;
    } catch (error) {
      console.error(error);
      return;
    }
  });
