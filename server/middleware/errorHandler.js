export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);
  const status = err.status ?? 500;
  const message = err.expose ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
}
