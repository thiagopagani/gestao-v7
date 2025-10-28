import { Funcionario, Empresa } from '../models/index.js';

// @desc    Criar novo funcionário
// @route   POST /api/funcionarios
// @access  Private
export const createFuncionario = async (req, res) => {
    const { nome, cpf, email, telefone, tipo, status, empresaId } = req.body;

    if (!nome || !cpf || !empresaId) {
        return res.status(400).json({ message: 'Nome, CPF e Empresa são obrigatórios' });
    }

    try {
        const funcionarioExists = await Funcionario.findOne({ where: { cpf } });
        if (funcionarioExists) {
            return res.status(400).json({ message: 'Funcionário com este CPF já existe' });
        }
        if (email) {
            const emailExists = await Funcionario.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Este email já está em uso' });
            }
        }

        const funcionario = await Funcionario.create({
            nome,
            cpf,
            email,
            telefone,
            tipo,
            status,
            empresaId
        });

        res.status(201).json(funcionario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar funcionário', error: error.message });
    }
};

// @desc    Buscar todos os funcionários
// @route   GET /api/funcionarios
// @access  Private
export const getAllFuncionarios = async (req, res) => {
    try {
        const { empresaId, status, tipo } = req.query;
        const whereClause = {};

        if (empresaId) whereClause.empresaId = empresaId;
        if (status) whereClause.status = status;
        if (tipo) whereClause.tipo = tipo;

        const funcionarios = await Funcionario.findAll({
            where: whereClause,
            include: {
                model: Empresa,
                as: 'empresa',
                attributes: ['nome']
            },
            order: [['nome', 'ASC']]
        });
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários', error: error.message });
    }
};

// @desc    Buscar funcionário por ID
// @route   GET /api/funcionarios/:id
// @access  Private
export const getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            res.json(funcionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionário', error: error.message });
    }
};

// @desc    Atualizar funcionário
// @route   PUT /api/funcionarios/:id
// @access  Private
export const updateFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            const { nome, cpf, email, telefone, tipo, status, empresaId } = req.body;

            if (cpf && cpf !== funcionario.cpf) {
                const funcionarioExists = await Funcionario.findOne({ where: { cpf } });
                if (funcionarioExists) {
                    return res.status(400).json({ message: 'Funcionário com este CPF já existe' });
                }
            }
             if (email && email !== funcionario.email) {
                const emailExists = await Funcionario.findOne({ where: { email } });
                if (emailExists) {
                    return res.status(400).json({ message: 'Este email já está em uso' });
                }
            }

            funcionario.nome = nome || funcionario.nome;
            funcionario.cpf = cpf || funcionario.cpf;
            funcionario.email = email;
            funcionario.telefone = telefone;
            funcionario.tipo = tipo || funcionario.tipo;
            funcionario.status = status || funcionario.status;
            funcionario.empresaId = empresaId || funcionario.empresaId;

            const updatedFuncionario = await funcionario.save();
            res.json(updatedFuncionario);
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar funcionário', error: error.message });
    }
};

// @desc    Deletar (desativar) funcionário
// @route   DELETE /api/funcionarios/:id
// @access  Private
export const deleteFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            funcionario.status = 'Inativo';
            await funcionario.save();
            res.json({ message: 'Funcionário desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar funcionário', error: error.message });
    }
};

// @desc    Converter funcionário de Treinamento para Autônomo
// @route   PUT /api/funcionarios/:id/converter
// @access  Private
export const convertFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (funcionario) {
            if (funcionario.tipo === 'Treinamento') {
                funcionario.tipo = 'Autônomo';
                await funcionario.save();
                res.json({ message: 'Funcionário convertido para Autônomo com sucesso' });
            } else {
                res.status(400).json({ message: 'Funcionário já é Autônomo' });
            }
        } else {
            res.status(404).json({ message: 'Funcionário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao converter funcionário', error: error.message });
    }
};
