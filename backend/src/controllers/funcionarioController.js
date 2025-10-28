import { Funcionario, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// Criar novo funcionário
export const createFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.create(req.body);
        res.status(201).json(funcionario);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar funcionário', error: error.message });
    }
};

// Listar todos os funcionários com filtros
export const getAllFuncionarios = async (req, res) => {
    try {
        const { empresaId, status, tipo } = req.query;
        const where = {};
        if (empresaId) where.empresaId = empresaId;
        if (status) where.status = status;
        if (tipo) where.tipo = tipo;

        const funcionarios = await Funcionario.findAll({
            where,
            include: [{ model: Empresa, as: 'empresa', attributes: ['nome'] }],
            order: [['nome', 'ASC']],
        });
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários', error: error.message });
    }
};

// Obter funcionário por ID
export const getFuncionarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await Funcionario.findByPk(id);
        if (funcionario) {
            res.status(200).json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionário', error: error.message });
    }
};

// Atualizar funcionário
export const updateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Funcionario.update(req.body, { where: { id } });
        if (updated) {
            const updatedFuncionario = await Funcionario.findByPk(id);
            res.status(200).json(updatedFuncionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar funcionário', error: error.message });
    }
};

// Desativar funcionário (Soft Delete)
export const deleteFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Funcionario.update({ status: 'Inativo' }, { where: { id } });
        if (updated) {
            res.status(200).json({ message: 'Funcionário desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar funcionário', error: error.message });
    }
};

// Converter funcionário de Treinamento para Autônomo
export const convertFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Funcionario.update({ tipo: 'Autônomo' }, { where: { id, tipo: 'Treinamento' } });
        if (updated) {
            res.status(200).json({ message: 'Funcionário convertido para Autônomo com sucesso.' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado ou já é Autônomo.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao converter funcionário', error: error.message });
    }
};
