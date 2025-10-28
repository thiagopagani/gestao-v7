import { Diaria, Cliente } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

// @desc    Gerar relatório de diárias com sumário
// @route   GET /api/relatorios
// @access  Private
export const getRelatorioDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, status, dataInicio, dataFim } = req.query;
        const whereClause = {};
        const clienteWhereClause = {};

        if (clienteId) whereClause.clienteId = clienteId;
        if (status) whereClause.status = status;
        if (dataInicio && dataFim) {
            whereClause.data = { [Op.between]: [dataInicio, dataFim] };
        } else if (dataInicio) {
            whereClause.data = { [Op.gte]: dataInicio };
        } else if (dataFim) {
            whereClause.data = { [Op.lte]: dataFim };
        }
        
        if (empresaId) clienteWhereClause.empresaId = empresaId;
        
        const includeOptions = [
            {
                model: Cliente,
                as: 'cliente',
                attributes: [], // Não precisamos dos atributos do cliente no resultado
                where: clienteWhereClause,
                required: !!empresaId, // Torna um INNER JOIN se o filtro de empresa for usado
            }
        ];

        const summary = await Diaria.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('valor')), 'totalValor'],
                [Sequelize.fn('COUNT', Sequelize.col('Diaria.id')), 'totalDiarias'],
            ],
            where: whereClause,
            include: includeOptions,
            raw: true,
        });

        // Se a busca não encontrar registros, SUM retorna null. Padroniza para 0.
        const result = {
            totalValor: parseFloat(summary.totalValor) || 0,
            totalDiarias: parseInt(summary.totalDiarias, 10) || 0,
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório.', error: error.message });
    }
};
