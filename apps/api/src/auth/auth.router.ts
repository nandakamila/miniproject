import express from 'express'
import { findRefreshTokenById, deleteRefreshToken, revokeRefreshTokens } from "./auth.controller";


const router = express.Router();

router.get('/:id', findRefreshTokenById);
router.delete('/:id', deleteRefreshToken);
router.post('/revoke', revokeRefreshTokens);

export { router as authRouter }