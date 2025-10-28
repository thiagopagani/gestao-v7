import express from 'express';
import {
    createCliente,
    getAllClientes,
    getClienteById,
    updateCliente,
    deleteCliente,
} from '../controllers/clienteController.js';

const router = express.Router();

router.route('/')
    .post(createCliente)
    .get(getAllClientes);

router.route('/:id')
    .get(getClienteById)
    .put(updateCliente)
    .delete(deleteCliente);

export default router;
