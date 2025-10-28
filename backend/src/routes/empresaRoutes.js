import express from 'express';
import {
    createEmpresa,
    getAllEmpresas,
    getEmpresaById,
    updateEmpresa,
    deleteEmpresa,
    restoreEmpresa,
    forceDeleteEmpresa,
} from '../controllers/empresaController.js';

const router = express.Router();

router.route('/')
    .post(createEmpresa)
    .get(getAllEmpresas);

router.route('/:id')
    .get(getEmpresaById)
    .put(updateEmpresa)
    .delete(deleteEmpresa); // Soft delete (inativa)

router.put('/:id/restore', restoreEmpresa); // Rota para reativar
router.delete('/:id/force', forceDeleteEmpresa); // Rota para exclusão permanente

export default router;
