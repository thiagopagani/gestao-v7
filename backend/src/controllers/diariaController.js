import { Diaria, Funcionario, Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';

// Criar uma nova diária
export const createDiaria = async (req, res) => {
    try {
        const diaria = await Diaria.create(req.body);
        res.status(201).json(diaria);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar diária', error: error.message });
    }
};

// Obter todas as diárias (com filtros)
export const getAllDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, funcionarioId, status, dataInicio, dataFim } = req.query;
        const where = {};
        const includeWhere = {};

        if (clienteId) where.clienteId = clienteId;
        if (funcionarioId) where.funcionarioId = funcionarioId;
        if (status) where.status = status;
        if (dataInicio && dataFim) {
            where.data = { [Op.between]: [dataInicio, dataFim] };
        } else if (dataInicio) {
            where.data = { [Op.gte]: dataInicio };
        } else if (dataFim) {
            where.data = { [Op.lte]: dataFim };
        }
        
        if (empresaId) includeWhere.empresaId = empresaId;

        const diarias = await Diaria.findAll({
            where,
            include: [
                { model: Funcionario, as: 'funcionario', attributes: ['nome'] },
                { 
                    model: Cliente, 
                    as: 'cliente', 
                    attributes: ['nome'],
                    include: [{ model: Empresa, as: 'empresa', attributes: ['nome'] }],
                    where: Object.keys(includeWhere).length ? includeWhere : undefined,
                }
            ],
            order: [['data', 'DESC']],
        });
        res.status(200).json(diarias);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diárias', error: error.message });
    }
};

// Obter uma diária por ID
export const getDiariaById = async (req, res) => {
    try {
        const { id } = req.params;
        const diaria = await Diaria.findByPk(id);
        if (diaria) {
            res.status(200).json(diaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diária', error: error.message });
    }
};

// Atualizar uma diária
export const updateDiaria = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Diaria.update(req.body, { where: { id } });
        if (updated) {
            const updatedDiaria = await Diaria.findByPk(id);
            res.status(200).json(updatedDiaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar diária', error: error.message });
    }
};

// Excluir (cancelar) uma diária - Soft Delete
export const deleteDiaria = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Diaria.update({ status: 'Cancelado' }, { where: { id } });
        if (updated) {
            res.status(200).json({ message: 'Diária cancelada com sucesso' });
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar diária', error: error.message });
    }
};
