import { Empresa, Cliente } from '../models/index.js';
import { Op } from 'sequelize';

// Criar uma nova empresa
export const createEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.create(req.body);
        res.status(201).json(empresa);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CNPJ já cadastrado.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Obter todas as empresas com filtros
export const getAllEmpresas = async (req, res) => {
    try {
        const { status, busca } = req.query;
        const where = {};
        if (status) where.status = status;
        if (busca) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${busca}%` } },
                { cnpj: { [Op.like]: `%${busca}%` } },
                { cidade: { [Op.like]: `%${busca}%` } }
            ];
        }

        const empresas = await Empresa.findAll({ where, order: [['nome', 'ASC']] });
        res.status(200).json(empresas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter uma empresa por ID
export const getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (empresa) {
            res.status(200).json(empresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar uma empresa
export const updateEmpresa = async (req, res) => {
    try {
        const [updated] = await Empresa.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedEmpresa = await Empresa.findByPk(req.params.id);
            res.status(200).json(updatedEmpresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
         if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CNPJ já cadastrado em outra empresa.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Inativar uma empresa (Soft Delete)
export const deleteEmpresa = async (req, res) => {
    try {
        const [updated] = await Empresa.update({ status: 'Inativo' }, { where: { id: req.params.id } });
        if (updated) {
            res.status(200).json({ message: 'Empresa inativada com sucesso.' });
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reativar uma empresa
export const restoreEmpresa = async (req, res) => {
    try {
        const [updated] = await Empresa.update({ status: 'Ativo' }, { where: { id: req.params.id } });
        if (updated) {
            res.status(200).json({ message: 'Empresa reativada com sucesso.' });
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Excluir permanentemente uma empresa
export const forceDeleteEmpresa = async (req, res) => {
    const { id } = req.params;
    try {
        // Medida de segurança: verificar se a empresa tem clientes vinculados
        const clienteCount = await Cliente.count({ where: { empresaId: id } });

        if (clienteCount > 0) {
            return res.status(400).json({ message: 'Não é possível excluir a empresa pois ela possui clientes vinculados.' });
        }

        const deleted = await Empresa.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Empresa excluída permanentemente.' });
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
