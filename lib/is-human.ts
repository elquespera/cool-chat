import { UserRole } from "@/db/schemas/auth";

export const isHuman = <T extends { role: UserRole }>({ role }: T) =>
  role === "user" || role === "admin" || role === "anonymous";
