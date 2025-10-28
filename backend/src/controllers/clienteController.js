import { Cliente, Empresa } from '../models/index.js';

// @desc    Criar um novo cliente
// @route   POST /api/clientes
// @access  Public
export const createCliente = async (req, res) => {
    try {
        const { nome, empresaId, contato, telefone, endereco, status } = req.body;
        if (!nome || !empresaId) {
            return res.status(400).json({ message: 'Nome e Empresa são obrigatórios.' });
        }
        
        const novoCliente = await Cliente.create({
            nome,
            empresaId,
            contato,
            telefone,
            endereco,
            status: status || 'Ativo'
        });
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
    }
};

// @desc    Obter todos os clientes com filtros
// @route   GET /api/clientes
// @access  Public
export const getAllClientes = async (req, res) => {
    try {
        const { empresaId, status } = req.query;
        const whereClause = {};

        if (empresaId) {
            whereClause.empresaId = empresaId;
        }
        if (status) {
            whereClause.status = status;
        }

        const clientes = await Cliente.findAll({
            where: whereClause,
            include: {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome'] // Inclui apenas o nome da empresa
            },
            order: [['nome', 'ASC']]
        });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes.', error: error.message });
    }
};

// @desc    Obter um cliente por ID
// @route   GET /api/clientes/:id
// @access  Public
export const getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            include: { model: Empresa, as: 'empresa' }
        });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cliente.', error: error.message });
    }
};

// @desc    Atualizar um cliente
// @route   PUT /api/clientes/:id
// @access  Public
export const updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            const { nome, empresaId, contato, telefone, endereco, status } = req.body;
            
            cliente.nome = nome ?? cliente.nome;
            cliente.empresaId = empresaId ?? cliente.empresaId;
            cliente.contato = contato ?? cliente.contato;
            cliente.telefone = telefone ?? cliente.telefone;
            cliente.endereco = endereco ?? cliente.endereco;
            cliente.status = status ?? cliente.status;
            
            const updatedCliente = await cliente.save();
            res.status(200).json(updatedCliente);
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
    }
};

// @desc    Excluir um cliente (soft delete)
// @route   DELETE /api/clientes/:id
// @access  Public
export const deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            cliente.status = 'Inativo';
            await cliente.save();
            res.status(200).json({ message: 'Cliente desativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar cliente.', error: error.message });
    }
};