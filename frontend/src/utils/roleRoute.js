export function getDashboardRoute(role) {
  return role === "BUYER" ? "/buyer" : "/farmer";
}
