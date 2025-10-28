import { Diaria, Cliente } from '../models/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// @desc    Gerar relatório de diárias
// @route   GET /api/relatorios
// @access  Private
export const getRelatorioDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, status, dataInicio, dataFim } = req.query;
        const whereClause = {};
        const includeClause = [];

        if (clienteId) whereClause.clienteId = clienteId;
        if (status) whereClause.status = status;
        
        if (dataInicio && dataFim) {
            whereClause.data = { [Op.between]: [dataInicio, dataFim] };
        } else if (dataInicio) {
            whereClause.data = { [Op.gte]: dataInicio };
        } else if (dataFim) {
            whereClause.data = { [Op.lte]: dataFim };
        }

        if (empresaId) {
             includeClause.push({
                model: Cliente,
                as: 'cliente',
                where: { empresaId },
                attributes: [] // Não precisa retornar os dados do cliente
            });
        }

        const summary = await Diaria.findOne({
            where: whereClause,
            include: includeClause,
            attributes: [
                [sequelize.fn('SUM', sequelize.col('valor')), 'totalValor'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalDiarias']
            ],
            raw: true
        });

        res.json({
            totalValor: parseFloat(summary.totalValor) || 0,
            totalDiarias: parseInt(summary.totalDiarias, 10) || 0
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
    }
};
