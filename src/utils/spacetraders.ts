export function getSystemSymbolFromWaypointSymbol(
  waypointSymbol: string,
): string {
  const parts = waypointSymbol.split('-');
  return parts.splice(0, 2).join('-');
}
