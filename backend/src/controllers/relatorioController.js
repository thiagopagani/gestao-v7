import { Diaria, Cliente } from '../models/index.js';
import { Op, fn, col } from 'sequelize';

export const getRelatorioDiarias = async (req, res) => {
    try {
        const { empresaId, clienteId, status, dataInicio, dataFim } = req.query;
        const where = {};
        const include = [];

        if (clienteId) where.clienteId = clienteId;
        if (status) where.status = status;
        if (dataInicio && dataFim) {
            where.data = { [Op.between]: [dataInicio, dataFim] };
        }

        if (empresaId) {
            include.push({
                model: Cliente,
                as: 'cliente',
                where: { empresaId: empresaId },
                attributes: [] // Não precisamos dos atributos do cliente no sumário
            });
        }

        const summary = await Diaria.findOne({
            attributes: [
                [fn('SUM', col('valor')), 'totalValor'],
                [fn('COUNT', col('id')), 'totalDiarias']
            ],
            where,
            include,
            raw: true
        });
        
        const totalValor = summary.totalValor ? parseFloat(summary.totalValor) : 0;
        const totalDiarias = summary.totalDiarias ? parseInt(summary.totalDiarias, 10) : 0;

        res.status(200).json({ totalValor, totalDiarias });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
