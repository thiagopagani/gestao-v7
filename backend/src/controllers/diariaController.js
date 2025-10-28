// FIX: This file had invalid content. Created the controller functions for managing Diaria entities.
import { Diaria, Funcionario, Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Criar uma nova diária
// @route   POST /api/diarias
// @access  Public
export const createDiaria = async (req, res) => {
    try {
        const { data, valor, status, observacao, funcionarioId, clienteId } = req.body;
        if (!data || !valor || !funcionarioId || !clienteId) {
            return res.status(400).json({ message: 'Data, Valor, Funcionário e Cliente são obrigatórios.' });
        }
        
        const novaDiaria = await Diaria.create({
            data,
            valor,
            status: status || 'Pendente',
            observacao,
            funcionarioId,
            clienteId
        });
        res.status(201).json(novaDiaria);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar diária.', error: error.message });
    }
};

// @desc    Obter todas as diárias com filtros
// @route   GET /api/diarias
// @access  Public
export const getAllDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, funcionarioId, status, dataInicio, dataFim } = req.query;
        const whereClause = {};
        const clienteWhereClause = {};

        if (clienteId) whereClause.clienteId = clienteId;
        if (funcionarioId) whereClause.funcionarioId = funcionarioId;
        if (status) whereClause.status = status;
        if (dataInicio && dataFim) {
            whereClause.data = { [Op.between]: [dataInicio, dataFim] };
        } else if (dataInicio) {
            whereClause.data = { [Op.gte]: dataInicio };
        } else if (dataFim) {
            whereClause.data = { [Op.lte]: dataFim };
        }

        if (empresaId) clienteWhereClause.empresaId = empresaId;

        const diarias = await Diaria.findAll({
            where: whereClause,
            include: [
                {
                    model: Funcionario,
                    as: 'funcionario',
                    attributes: ['nome']
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['nome'],
                    where: Object.keys(clienteWhereClause).length > 0 ? clienteWhereClause : undefined,
                    include: {
                        model: Empresa,
                        as: 'empresa',
                        attributes: ['nome']
                    }
                }
            ],
            order: [['data', 'DESC']]
        });
        res.status(200).json(diarias);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diárias.', error: error.message });
    }
};

// @desc    Obter uma diária por ID
// @route   GET /api/diarias/:id
// @access  Public
export const getDiariaById = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id, {
            include: ['funcionario', 'cliente']
        });
        if (diaria) {
            res.status(200).json(diaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diária.', error: error.message });
    }
};

// @desc    Atualizar uma diária
// @route   PUT /api/diarias/:id
// @access  Public
export const updateDiaria = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id);
        if (diaria) {
            const { data, valor, status, observacao, funcionarioId, clienteId } = req.body;
            
            diaria.data = data ?? diaria.data;
            diaria.valor = valor ?? diaria.valor;
            diaria.status = status ?? diaria.status;
            diaria.observacao = observacao ?? diaria.observacao;
            diaria.funcionarioId = funcionarioId ?? diaria.funcionarioId;
            diaria.clienteId = clienteId ?? diaria.clienteId;
            
            const updatedDiaria = await diaria.save();
            res.status(200).json(updatedDiaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar diária.', error: error.message });
    }
};

// @desc    Cancelar uma diária (soft delete)
// @route   DELETE /api/diarias/:id
// @access  Public
export const deleteDiaria = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id);
        if (diaria) {
            diaria.status = 'Cancelado';
            await diaria.save();
            res.status(200).json({ message: 'Diária cancelada com sucesso.' });
        } else {
            res.status(404).json({ message: 'Diária não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar diária.', error: error.message });
    }
};