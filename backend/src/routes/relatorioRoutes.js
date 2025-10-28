import express from 'express';
import { getRelatorioDiarias } from '../controllers/relatorioController.js';

const router = express.Router();

router.route('/')
    .get(getRelatorioDiarias);

export default router;
