export function getReports(_request, response) {
  response.status(501).json({ message: 'Reportes pendientes de implementación' });
}