import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import { emailService } from '../services/emailService.js';

// @desc    Criar novo usuário
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req, res) => {
    const { nome, email, password, papel, status } = req.body;

    if (!nome || !email || !password || !papel) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário com este email já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            nome,
            email,
            password: hashedPassword,
            papel,
            status,
        });
        
        // Envia email de boas-vindas
        emailService.sendWelcomeEmail(email, nome);

        res.status(201).json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            papel: user.papel,
            status: user.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

// @desc    Buscar todos os usuários
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['nome', 'ASC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};

// @desc    Buscar usuário por ID
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
};

// @desc    Atualizar usuário
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { nome, email, password, papel, status } = req.body;

            if (email && email !== user.email) {
                const userExists = await User.findOne({ where: { email } });
                if (userExists) {
                    return res.status(400).json({ message: 'Usuário com este email já existe' });
                }
            }

            user.nome = nome || user.nome;
            user.email = email || user.email;
            user.papel = papel || user.papel;
            user.status = status || user.status;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();

            res.json({
                id: user.id,
                nome: user.nome,
                email: user.email,
                papel: user.papel,
                status: user.status
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

// @desc    Deletar (desativar) usuário
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.status = 'Inativo';
            await user.save();
            res.json({ message: 'Usuário desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar usuário', error: error.message });
    }
};
