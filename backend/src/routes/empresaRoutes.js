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
    .delete(deleteEmpresa); // Rota para inativar (soft delete)

router.delete('/:id/force', forceDeleteEmpresa); // Rota para exclusão permanente
router.put('/:id/restore', restoreEmpresa); // Rota para reativar

export default router;
