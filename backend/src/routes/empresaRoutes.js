import express from 'express';
import {
    createEmpresa,
    getAllEmpresas,
    getEmpresaById,
    updateEmpresa,
    deleteEmpresa,
    forceDeleteEmpresa,
    restoreEmpresa,
} from '../controllers/empresaController.js';

const router = express.Router();

router.route('/')
    .post(createEmpresa)
    .get(getAllEmpresas);

router.route('/:id')
    .get(getEmpresaById)
    .put(updateEmpresa)
    .delete(deleteEmpresa);

router.delete('/:id/force', forceDeleteEmpresa);
router.put('/:id/restore', restoreEmpresa);

export default router;
