import express from 'express'
import { findRefreshTokenById, deleteRefreshToken, revokeRefreshTokens } from "./auth.controller";


const router = express.Router();

router.get('/:id', findRefreshTokenById);
router.post('/revoke', revokeRefreshTokens);
router.delete('/:id', deleteRefreshToken);

export { router as authRouter }