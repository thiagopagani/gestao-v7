import express from 'express';
import {
    createDiaria,
    getAllDiarias,
    getDiariaById,
    updateDiaria,
    deleteDiaria,
} from '../controllers/diariaController.js';

const router = express.Router();

router.route('/')
    .post(createDiaria)
    .get(getAllDiarias);

router.route('/:id')
    .get(getDiariaById)
    .put(updateDiaria)
    .delete(deleteDiaria);

export default router;