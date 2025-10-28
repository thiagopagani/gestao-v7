import { Diaria, Cliente } from '../models/index.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Gerar relatório de resumo de diárias
export const getRelatorioDiarias = async (req, res) => {
  try {
    const { empresaId, clienteId, status, dataInicio, dataFim } = req.query;
    const where = {};
    const clienteWhere = {};

    if (empresaId) clienteWhere.empresaId = empresaId;
    if (clienteId) where.clienteId = clienteId;
    if (status) where.status = status;
    if (dataInicio && dataFim) {
      where.data = { [Op.between]: [dataInicio, dataFim] };
    } else if (dataInicio) {
      where.data = { [Op.gte]: dataInicio };
    } else if (dataFim) {
      where.data = { [Op.lte]: dataFim };
    }
    
    const includeCliente = Object.keys(clienteWhere).length > 0 
      ? [{ model: Cliente, as: 'cliente', where: clienteWhere, attributes: [] }]
      : [];
      
    const summary = await Diaria.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('valor')), 'totalValor'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalDiarias'],
      ],
      where,
      include: includeCliente,
    });
    
    const result = {
        totalValor: parseFloat(summary.getDataValue('totalValor')) || 0,
        totalDiarias: parseInt(summary.getDataValue('totalDiarias'), 10) || 0
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
};
