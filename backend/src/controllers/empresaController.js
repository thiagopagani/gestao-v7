import { Empresa } from '../models/index.js';

// @desc    Criar uma nova empresa
// @route   POST /api/empresas
// @access  Public (futuramente Privado)
export const createEmpresa = async (req, res) => {
    try {
        const { nome, cnpj, responsavel, telefone, status } = req.body;
        if (!nome || !cnpj) {
            return res.status(400).json({ message: 'Nome e CNPJ são obrigatórios.' });
        }
        
        const empresaExistente = await Empresa.findOne({ where: { cnpj } });
        if (empresaExistente) {
            return res.status(400).json({ message: 'Já existe uma empresa com este CNPJ.' });
        }

        const novaEmpresa = await Empresa.create({
            nome,
            cnpj,
            responsavel,
            telefone,
            status: status || 'Ativo' // Garante 'Ativo' como padrão na criação
        });
        res.status(201).json(novaEmpresa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
    }
};

// @desc    Obter todas as empresas
// @route   GET /api/empresas
// @access  Public (futuramente Privado)
export const getAllEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            order: [['nome', 'ASC']]
        });
        res.status(200).json(empresas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empresas.', error: error.message });
    }
};

// @desc    Obter uma empresa por ID
// @route   GET /api/empresas/:id
// @access  Public (futuramente Privado)
export const getEmpresaById = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (empresa) {
            res.status(200).json(empresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empresa.', error: error.message });
    }
};

// @desc    Atualizar uma empresa
// @route   PUT /api/empresas/:id
// @access  Public (futuramente Privado)
export const updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (empresa) {
            const { nome, cnpj, responsavel, telefone, status } = req.body;
            
            // Atualiza apenas os campos fornecidos
            empresa.nome = nome ?? empresa.nome;
            empresa.cnpj = cnpj ?? empresa.cnpj;
            empresa.responsavel = responsavel ?? empresa.responsavel;
            empresa.telefone = telefone ?? empresa.telefone;
            empresa.status = status ?? empresa.status;
            
            const updatedEmpresa = await empresa.save();
            res.status(200).json(updatedEmpresa);
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar empresa.', error: error.message });
    }
};

// @desc    Excluir uma empresa (soft delete)
// @route   DELETE /api/empresas/:id
// @access  Public (futuramente Privado)
export const deleteEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        if (empresa) {
            // Em vez de deletar, altera o status para 'Inativo'
            empresa.status = 'Inativo';
            await empresa.save();
            res.status(200).json({ message: 'Empresa desativada com sucesso.' });
        } else {
            res.status(404).json({ message: 'Empresa não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar empresa.', error: error.message });
    }
};
