import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { EMOTIONS, EMOTION_DEFAULTS, resolveParams } from '../models/emotionParams.js';

const router = Router();

// GET /api/environments/defaults/:emotion  – public, no auth needed
router.get('/defaults/:emotion', (req, res) => {
  const { emotion } = req.params;
  if (!EMOTIONS.includes(emotion))
    return res.status(400).json({ error: 'Unknown emotion' });
  return res.json({ emotion, parameters: EMOTION_DEFAULTS[emotion] });
});

// GET /api/environments/defaults  – list all emotion defaults
router.get('/defaults', (_req, res) => {
  return res.json({ defaults: EMOTION_DEFAULTS });
});

// POST /api/environments  – save a scene (auth required)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name = 'Untitled Scene', emotion, parameters, isPublic = false } = req.body;

    if (!emotion || !EMOTIONS.includes(emotion))
      return res.status(400).json({ error: 'Invalid or missing emotion' });
    if (!parameters || typeof parameters !== 'object')
      return res.status(400).json({ error: 'parameters must be an object' });

    const resolved = resolveParams(emotion, parameters);

    const { rows } = await query(
      `INSERT INTO environments (user_id, name, emotion, parameters_json, is_public)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, emotion, parameters_json, is_public, created_at`,
      [req.user.id, name, emotion, JSON.stringify(resolved), isPublic]
    );

    return res.status(201).json({ environment: rows[0] });
  } catch (err) { next(err); }
});

// GET /api/environments  – list the authed user's scenes
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, name, emotion, parameters_json, is_public, created_at, updated_at
       FROM environments WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [req.user.id]
    );
    return res.json({ environments: rows });
  } catch (err) { next(err); }
});

// GET /api/environments/:id  – load a scene (public or owner)
router.get('/:id', optionalAuthenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT e.id, e.name, e.emotion, e.parameters_json,
              e.is_public, e.created_at, e.user_id,
              u.email AS owner_email
       FROM environments e JOIN users u ON u.id = e.user_id
       WHERE e.id = $1`,
      [req.params.id]
    );

    const env = rows[0];
    if (!env) return res.status(404).json({ error: 'Scene not found' });

    if (!env.is_public && env.user_id !== req.user?.id)
      return res.status(403).json({ error: 'This scene is private' });

    return res.json({ environment: env });
  } catch (err) { next(err); }
});

// PATCH /api/environments/:id  – update (owner only)
router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, parameters, isPublic, emotion } = req.body;

    const { rows: existing } = await query(
      'SELECT user_id, emotion FROM environments WHERE id = $1',
      [req.params.id]
    );
    if (!existing[0]) return res.status(404).json({ error: 'Scene not found' });
    if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const resolvedEmotion = emotion ?? existing[0].emotion;
    const resolvedParams = parameters ? resolveParams(resolvedEmotion, parameters) : undefined;

    const { rows } = await query(
      `UPDATE environments
       SET name            = COALESCE($1, name),
           emotion         = COALESCE($2, emotion),
           parameters_json = COALESCE($3, parameters_json),
           is_public       = COALESCE($4, is_public)
       WHERE id = $5
       RETURNING id, name, emotion, parameters_json, is_public, updated_at`,
      [
        name ?? null,
        emotion ?? null,
        resolvedParams ? JSON.stringify(resolvedParams) : null,
        isPublic ?? null,
        req.params.id,
      ]
    );

    return res.json({ environment: rows[0] });
  } catch (err) { next(err); }
});

// DELETE /api/environments/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { rowCount } = await query(
      'DELETE FROM environments WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Scene not found or not yours' });
    return res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

export default router;
