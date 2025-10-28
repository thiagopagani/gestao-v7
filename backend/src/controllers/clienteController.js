import { Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// Criar um novo cliente
export const createCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar cliente', error: error.message });
    }
};

// Obter todos os clientes (com filtros)
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
            ];
        }

        const clientes = await Cliente.findAll({
            where,
            include: [{ model: Empresa, as: 'empresa', attributes: ['nome'] }],
            order: [['nome', 'ASC']],
        });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
    }
};

// Obter um cliente por ID
export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id, {
            include: [{ model: Empresa, as: 'empresa' }]
        });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
    }
};

// Atualizar um cliente
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update(req.body, { where: { id } });
        if (updated) {
            const updatedCliente = await Cliente.findByPk(id);
            res.status(200).json(updatedCliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar cliente', error: error.message });
    }
};

// Excluir (desativar) um cliente - Soft Delete
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update({ status: 'Inativo' }, { where: { id } });
        if (updated) {
            res.status(200).json({ message: 'Cliente desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar cliente', error: error.message });
    }
};
