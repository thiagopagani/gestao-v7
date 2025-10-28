import express from 'express';
import {
    createEmpresa,
    getAllEmpresas,
    getEmpresaById,
    updateEmpresa,
    deleteEmpresa,
} from '../controllers/empresaController.js';

const router = express.Router();

router.route('/')
    .post(createEmpresa)
    .get(getAllEmpresas);

router.route('/:id')
    .get(getEmpresaById)
    .put(updateEmpresa)
    .delete(deleteEmpresa);

export default router;