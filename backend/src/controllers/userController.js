// FIX: This file had invalid content. Created the controller functions for managing User entities, including password hashing.
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

// @desc    Criar um novo usuário
// @route   POST /api/users
// @access  Admin
export const createUser = async (req, res) => {
    try {
        const { nome, email, password, papel, status } = req.body;
        if (!nome || !email || !password || !papel) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }
        
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com este email.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            nome,
            email,
            password: hashedPassword,
            papel,
            status: status || 'Ativo'
        });
        
        // Don't send password back
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
    }
};

// @desc    Obter todos os usuários
// @route   GET /api/users
// @access  Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['nome', 'ASC']]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
    }
};

// @desc    Obter um usuário por ID
// @route   GET /api/users/:id
// @access  Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
    }
};

// @desc    Atualizar um usuário
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { nome, email, password, papel, status } = req.body;
            
            user.nome = nome ?? user.nome;
            user.email = email ?? user.email;
            user.papel = papel ?? user.papel;
            user.status = status ?? user.status;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            
            await user.save();
            
            const userResponse = { ...user.toJSON() };
            delete userResponse.password;
            
            res.status(200).json(userResponse);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
    }
};

// @desc    Excluir um usuário (soft delete)
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.status = 'Inativo';
            await user.save();
            res.status(200).json({ message: 'Usuário desativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar usuário.', error: error.message });
    }
};
