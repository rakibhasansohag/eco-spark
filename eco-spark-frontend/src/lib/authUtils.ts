export type AppRole = "ADMIN" | "MEMBER";

const roleProtectedRoutes: Record<AppRole, string[]> = {
  ADMIN: ["/admin/dashboard"],
  MEMBER: ["/member/dashboard"],
};

export const getRoleProtectedRoutes = (): Record<AppRole, string[]> => roleProtectedRoutes;

export const getRouteOwner = (pathname: string): AppRole | null => {
  if (pathname.startsWith("/admin/dashboard")) return "ADMIN";
  if (pathname.startsWith("/member/dashboard")) return "MEMBER";
  return null;
};

export const getDefaultDashboardRoute = (role: AppRole): string => {
  if (role === "ADMIN") return "/admin/dashboard";
  return "/member/dashboard";
};
