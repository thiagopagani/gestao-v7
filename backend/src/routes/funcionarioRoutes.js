import express from 'express';
import {
    createFuncionario,
    getAllFuncionarios,
    getFuncionarioById,
    updateFuncionario,
    deleteFuncionario,
    convertFuncionario
} from '../controllers/funcionarioController.js';

const router = express.Router();

router.route('/')
    .post(createFuncionario)
    .get(getAllFuncionarios);

router.route('/:id')
    .get(getFuncionarioById)
    .put(updateFuncionario)
    .delete(deleteFuncionario);

router.put('/:id/convert', convertFuncionario);

export default router;
