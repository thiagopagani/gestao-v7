import { Cliente, Empresa } from '../models/index.js';

// @desc    Criar um novo cliente
// @route   POST /api/clientes
// @access  Public
export const createCliente = async (req, res) => {
    try {
        const { nome, cnpj, endereco, telefone, status, empresaId } = req.body;
        if (!nome || !empresaId) {
            return res.status(400).json({ message: 'Nome e Empresa são obrigatórios.' });
        }

        if (cnpj) {
            const clienteExistente = await Cliente.findOne({ where: { cnpj } });
            if (clienteExistente) {
                return res.status(400).json({ message: 'Já existe um cliente com este CNPJ.' });
            }
        }
        
        const novoCliente = await Cliente.create({
            nome,
            cnpj: cnpj || null,
            endereco,
            telefone,
            status: status || 'Ativo',
            empresaId
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

        if (empresaId) whereClause.empresaId = empresaId;
        if (status) whereClause.status = status;

        const clientes = await Cliente.findAll({
            where: whereClause,
            include: {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
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
            const { nome, cnpj, endereco, telefone, status, empresaId } = req.body;
            
            cliente.nome = nome ?? cliente.nome;
            cliente.cnpj = cnpj ?? cliente.cnpj;
            cliente.endereco = endereco ?? cliente.endereco;
            cliente.telefone = telefone ?? cliente.telefone;
            cliente.status = status ?? cliente.status;
            cliente.empresaId = empresaId ?? cliente.empresaId;
            
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
