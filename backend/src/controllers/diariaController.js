import { Diaria, Funcionario, Cliente, Empresa } from '../models/index.js';
import { Op } from 'sequelize';
import { emailService } from '../services/emailService.js';

// @desc    Criar nova diária
// @route   POST /api/diarias
// @access  Private
export const createDiaria = async (req, res) => {
    const { data, valor, status, observacao, funcionarioId, clienteId } = req.body;

    if (!data || !valor || !funcionarioId || !clienteId) {
        return res.status(400).json({ message: 'Data, valor, funcionário e cliente são obrigatórios' });
    }

    try {
        const diaria = await Diaria.create({ data, valor, status, observacao, funcionarioId, clienteId });
        res.status(201).json(diaria);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar diária', error: error.message });
    }
};

// @desc    Buscar todas as diárias
// @route   GET /api/diarias
// @access  Private
export const getAllDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, funcionarioId, status, dataInicio, dataFim } = req.query;
        const whereClause = {};
        const includeClause = [
            { model: Funcionario, as: 'funcionario', attributes: ['nome'] },
            {
                model: Cliente,
                as: 'cliente',
                attributes: ['nome'],
                include: {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['nome']
                }
            }
        ];

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
        
        if (empresaId) {
            includeClause.find(i => i.as === 'cliente').where = { empresaId: empresaId };
        }


        const diarias = await Diaria.findAll({
            where: whereClause,
            include: includeClause,
            order: [['data', 'DESC']]
        });
        res.json(diarias);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diárias', error: error.message });
    }
};


// @desc    Buscar diária por ID
// @route   GET /api/diarias/:id
// @access  Private
export const getDiariaById = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id);
        if (diaria) {
            res.json(diaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar diária', error: error.message });
    }
};

// @desc    Atualizar diária
// @route   PUT /api/diarias/:id
// @access  Private
export const updateDiaria = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id, {
            include: [{ model: Funcionario, as: 'funcionario' }]
        });
        if (diaria) {
            const { data, valor, status, observacao, funcionarioId, clienteId } = req.body;
            const oldStatus = diaria.status;

            diaria.data = data || diaria.data;
            diaria.valor = valor || diaria.valor;
            diaria.status = status || diaria.status;
            diaria.observacao = observacao;
            diaria.funcionarioId = funcionarioId || diaria.funcionarioId;
            diaria.clienteId = clienteId || diaria.clienteId;

            const updatedDiaria = await diaria.save();
            
            // Envia e-mail se o status mudou para Aprovado ou Cancelado
            if (status && status !== oldStatus && (status === 'Aprovado' || status === 'Cancelado')) {
                if(diaria.funcionario && diaria.funcionario.email) {
                    emailService.sendDiariaStatusUpdateEmail(diaria.funcionario.email, updatedDiaria);
                }
            }

            res.json(updatedDiaria);
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar diária', error: error.message });
    }
};

// @desc    Deletar (cancelar) diária
// @route   DELETE /api/diarias/:id
// @access  Private
export const deleteDiaria = async (req, res) => {
    try {
        const diaria = await Diaria.findByPk(req.params.id);
        if (diaria) {
            diaria.status = 'Cancelado';
            await diaria.save();
            res.json({ message: 'Diária cancelada com sucesso' });
        } else {
            res.status(404).json({ message: 'Diária não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar diária', error: error.message });
    }
};
