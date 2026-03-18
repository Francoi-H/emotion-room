import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  let token = req.cookies?.token;

  if (!token) {
    const auth = req.headers.authorization ?? '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Optional auth – attaches user if token present, but never blocks */
export function optionalAuthenticate(req, _res, next) {
  let token = req.cookies?.token;
  if (!token) {
    const auth = req.headers.authorization ?? '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.sub, email: payload.email };
    } catch { /* ignore */ }
  }
  next();
}
