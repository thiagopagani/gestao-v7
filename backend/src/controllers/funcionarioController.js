// FIX: This file had invalid content. Created the controller functions for managing Funcionario entities.
import { Funcionario, Empresa } from '../models/index.js';

// @desc    Criar um novo funcionário
// @route   POST /api/funcionarios
// @access  Public
export const createFuncionario = async (req, res) => {
    try {
        const { nome, cpf, email, empresaId, telefone, tipo, status } = req.body;
        if (!nome || !cpf || !empresaId) {
            return res.status(400).json({ message: 'Nome, CPF e Empresa são obrigatórios.' });
        }
        
        const funcionarioExistente = await Funcionario.findOne({ where: { cpf } });
        if (funcionarioExistente) {
            return res.status(400).json({ message: 'Já existe um funcionário com este CPF.' });
        }
        if (email) {
            const emailExistente = await Funcionario.findOne({ where: { email }});
            if (emailExistente) {
                return res.status(400).json({ message: 'Já existe um funcionário com este email.' });
            }
        }

        const novoFuncionario = await Funcionario.create({
            nome,
            cpf,
            email: email || null,
            empresaId,
            telefone,
            tipo: tipo || 'Treinamento',
            status: status || 'Ativo'
        });
        res.status(201).json(novoFuncionario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar funcionário.', error: error.message });
    }
};

// @desc    Obter todos os funcionários com filtros
// @route   GET /api/funcionarios
// @access  Public
export const getAllFuncionarios = async (req, res) => {
    try {
        const { empresaId, status, tipo } = req.query;
        const whereClause = {};

        if (empresaId) whereClause.empresaId = empresaId;
        if (status) whereClause.status = status;
        if (tipo) whereClause.tipo = tipo;

        const funcionarios = await Funcionario.findAll({
            where: whereClause,
            include: {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
            },
            order: [['nome', 'ASC']]
        });
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários.', error: error.message });
    }
};

// @desc    Obter um funcionário por ID
// @route   GET /api/funcionarios/:id
// @access  Public
export const getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id, {
            include: { model: Empresa, as: 'empresa' }
        });
        if (funcionario) {
            res.status(200).json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionário.', error: error.message });
    }
};

// @desc    Atualizar um funcionário
// @route   PUT /api/funcionarios/:id
// @access  Public
export const updateFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            const { nome, cpf, email, empresaId, telefone, tipo, status } = req.body;
            
            funcionario.nome = nome ?? funcionario.nome;
            funcionario.cpf = cpf ?? funcionario.cpf;
            funcionario.email = email ?? funcionario.email;
            funcionario.empresaId = empresaId ?? funcionario.empresaId;
            funcionario.telefone = telefone ?? funcionario.telefone;
            funcionario.tipo = tipo ?? funcionario.tipo;
            funcionario.status = status ?? funcionario.status;
            
            const updatedFuncionario = await funcionario.save();
            res.status(200).json(updatedFuncionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar funcionário.', error: error.message });
    }
};

// @desc    Excluir um funcionário (soft delete)
// @route   DELETE /api/funcionarios/:id
// @access  Public
export const deleteFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            funcionario.status = 'Inativo';
            await funcionario.save();
            res.status(200).json({ message: 'Funcionário desativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar funcionário.', error: error.message });
    }
};

// @desc    Converter um funcionário de Treinamento para Autônomo
// @route   PUT /api/funcionarios/:id/converter
// @access  Public
export const convertFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            if (funcionario.tipo === 'Treinamento') {
                funcionario.tipo = 'Autônomo';
                await funcionario.save();
                res.status(200).json({ message: 'Funcionário convertido para Autônomo com sucesso.' });
            } else {
                res.status(400).json({ message: 'Funcionário não está em treinamento.' });
            }
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao converter funcionário.', error: error.message });
    }
};