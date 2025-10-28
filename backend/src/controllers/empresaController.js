import { Empresa } from '../models/index.js';

// @desc    Criar nova empresa
// @route   POST /api/empresas
// @access  Private
export const createEmpresa = async (req, res) => {
    const { nome, cnpj, endereco, telefone, status } = req.body;

    if (!nome || !cnpj) {
        return res.status(400).json({ message: 'Nome e CNPJ são obrigatórios' });
    }

    try {
        const empresaExists = await Empresa.findOne({ where: { cnpj } });
        if (empresaExists) {
            return res.status(400).json({ message: 'Empresa com este CNPJ já existe' });
        }

        const empresa = await Empresa.create({
            nome,
            cnpj,
            endereco,
            telefone,
            status,
        });

        res.status(201).json(empresa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar empresa', error: error.message });
    }
};

// @desc    Buscar todas as empresas
// @route   GET /api/empresas
// @access  Private
export const getAllEmpresas = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        const empresas = await Empresa.findAll({ where: whereClause, order: [['nome', 'ASC']] });
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empresas', error: error.message });
    }
};

// @desc    Buscar empresa por ID
// @route   GET /api/empresas/:id
// @access  Private
export const getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (empresa) {
            res.json(empresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empresa', error: error.message });
    }
};

// @desc    Atualizar empresa
// @route   PUT /api/empresas/:id
// @access  Private
export const updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (empresa) {
            const { nome, cnpj, endereco, telefone, status } = req.body;
            
            // Verifica se o CNPJ está sendo alterado para um que já existe
            if (cnpj && cnpj !== empresa.cnpj) {
                const empresaExists = await Empresa.findOne({ where: { cnpj } });
                if (empresaExists) {
                    return res.status(400).json({ message: 'Empresa com este CNPJ já existe' });
                }
            }

            empresa.nome = nome || empresa.nome;
            empresa.cnpj = cnpj || empresa.cnpj;
            empresa.endereco = endereco;
            empresa.telefone = telefone;
            empresa.status = status || empresa.status;

            const updatedEmpresa = await empresa.save();
            res.json(updatedEmpresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar empresa', error: error.message });
    }
};

// @desc    Deletar (desativar) empresa
// @route   DELETE /api/empresas/:id
// @access  Private
export const deleteEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);

        if (empresa) {
            empresa.status = 'Inativo';
            await empresa.save();
            res.json({ message: 'Empresa desativada com sucesso' });
        } else {
            res.status(404).json({ message: 'Empresa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar empresa', error: error.message });
    }
};
