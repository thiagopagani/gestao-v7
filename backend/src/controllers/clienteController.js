import { Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Criar novo cliente
// @route   POST /api/clientes
// @access  Private
export const createCliente = async (req, res) => {
    const { nome, cnpj, endereco, telefone, status, empresaId, cidade, estado } = req.body;

    if (!nome || !empresaId) {
        return res.status(400).json({ message: 'Nome e Empresa são obrigatórios' });
    }

    try {
        if (cnpj) {
            const clienteExists = await Cliente.findOne({ where: { cnpj } });
            if (clienteExists) {
                return res.status(400).json({ message: 'Cliente com este CNPJ já existe' });
            }
        }

        const cliente = await Cliente.create({
            nome,
            cnpj,
            endereco,
            telefone,
            status,
            empresaId,
            cidade,
            estado
        });

        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
    }
};

// @desc    Buscar todos os clientes
// @route   GET /api/clientes
// @access  Private
export const getAllClientes = async (req, res) => {
    try {
        const { empresaId, status, busca } = req.query;
        const whereClause = {};

        if (empresaId) {
            whereClause.empresaId = empresaId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (busca) {
            whereClause[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cnpj: { [Op.like]: `%${busca}%` } },
                 { cidade: { [Op.like]: `%${busca}%` } },
            ];
        }

        const clientes = await Cliente.findAll({
            where: whereClause,
            include: {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
            },
            order: [['nome', 'ASC']]
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
    }
};

// @desc    Buscar cliente por ID
// @route   GET /api/clientes/:id
// @access  Private
export const getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            include: { model: Empresa, as: 'empresa' }
        });

        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
    }
};

// @desc    Atualizar cliente
// @route   PUT /api/clientes/:id
// @access  Private
export const updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (cliente) {
            const { nome, cnpj, endereco, telefone, status, empresaId, cidade, estado } = req.body;
            
            if (cnpj && cnpj !== cliente.cnpj) {
                const clienteExists = await Cliente.findOne({ where: { cnpj } });
                if (clienteExists) {
                    return res.status(400).json({ message: 'Cliente com este CNPJ já existe' });
                }
            }

            cliente.nome = nome || cliente.nome;
            cliente.cnpj = cnpj;
            cliente.endereco = endereco;
            cliente.telefone = telefone;
            cliente.status = status || cliente.status;
            cliente.empresaId = empresaId || cliente.empresaId;
            cliente.cidade = cidade;
            cliente.estado = estado;

            const updatedCliente = await cliente.save();
            res.json(updatedCliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
    }
};

// @desc    Deletar (desativar) cliente
// @route   DELETE /api/clientes/:id
// @access  Private
export const deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (cliente) {
            cliente.status = 'Inativo';
            await cliente.save();
            res.json({ message: 'Cliente desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar cliente', error: error.message });
    }
};
