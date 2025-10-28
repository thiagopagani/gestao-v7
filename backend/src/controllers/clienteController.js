import { Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// Criar um novo cliente
export const createCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CNPJ já cadastrado.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Obter todos os clientes com filtros
export const getAllClientes = async (req, res) => {
    try {
        const { empresaId, status, busca } = req.query;
        const where = {};
        if (empresaId) where.empresaId = empresaId;
        if (status) where.status = status;
        if (busca) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cnpj: { [Op.like]: `%${busca}%` } },
                { cidade: { [Op.like]: `%${busca}%` } }
            ];
        }

        const clientes = await Cliente.findAll({
            where,
            include: [{ model: Empresa, as: 'empresa', attributes: ['nome'] }]
        });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter um cliente por ID
export const getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um cliente
export const updateCliente = async (req, res) => {
    try {
        const [updated] = await Cliente.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedCliente = await Cliente.findByPk(req.params.id);
            res.status(200).json(updatedCliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CNPJ já cadastrado em outro cliente.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Inativar um cliente (Soft Delete)
export const deleteCliente = async (req, res) => {
    try {
        const [updated] = await Cliente.update({ status: 'Inativo' }, { where: { id: req.params.id } });
        if (updated) {
            res.status(200).json({ message: 'Cliente inativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
