import { Funcionario } from '../models/index.js';
import { Op } from 'sequelize';

// Criar novo funcionário
export const createFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.create(req.body);
        res.status(201).json(funcionario);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CPF já cadastrado.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Obter todos os funcionários com filtros
export const getAllFuncionarios = async (req, res) => {
    try {
        const { status, tipo, busca } = req.query;
        const where = {};
        if (status) where.status = status;
        if (tipo) where.tipo = tipo;
        if (busca) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cpf: { [Op.like]: `%${busca}%` } },
                { cargo: { [Op.like]: `%${busca}%` } }
            ];
        }

        const funcionarios = await Funcionario.findAll({
            where,
            order: [['nome', 'ASC']]
        });
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter um funcionário por ID
export const getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            res.status(200).json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um funcionário
export const updateFuncionario = async (req, res) => {
    try {
        const [updated] = await Funcionario.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedFuncionario = await Funcionario.findByPk(req.params.id);
            res.status(200).json(updatedFuncionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CPF já cadastrado em outro funcionário.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Inativar um funcionário (Soft Delete)
export const deleteFuncionario = async (req, res) => {
    try {
        const [updated] = await Funcionario.update({ status: 'Inativo' }, { where: { id: req.params.id } });
        if (updated) {
            res.status(200).json({ message: 'Funcionário inativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Converter funcionário de Treinamento para Autônomo
export const convertFuncionario = async (req, res) => {
    try {
        const [updated] = await Funcionario.update({ tipo: 'Autonomo' }, {
            where: {
                id: req.params.id,
                tipo: 'Treinamento'
            }
        });
        if (updated) {
            res.status(200).json({ message: 'Funcionário convertido para Autônomo com sucesso.' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado ou já é Autônomo.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
