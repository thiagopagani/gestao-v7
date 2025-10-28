import { Diaria, Cliente } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Gerar relatório de resumo de diárias
export const getRelatorioDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, status, dataInicio, dataFim } = req.query;
        const where = {};
        const includeWhere = {};
        
        if (clienteId) where.clienteId = clienteId;
        if (status) where.status = status;
        if (dataInicio && dataFim) {
            where.data = { [Op.between]: [dataInicio, dataFim] };
        }
        
        if (empresaId) includeWhere.empresaId = empresaId;

        const result = await Diaria.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('valor')), 'totalValor'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalDiarias'],
            ],
            where,
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: [],
                where: Object.keys(includeWhere).length ? includeWhere : undefined,
            }],
            raw: true,
        });

        // Se não houver resultado, SUM e COUNT podem retornar null
        const summary = {
            totalValor: parseFloat(result.totalValor) || 0,
            totalDiarias: parseInt(result.totalDiarias, 10) || 0,
        };
        
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
    }
};
