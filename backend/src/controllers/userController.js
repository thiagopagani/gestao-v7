import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Criar um novo usuário
export const createUser = async (req, res) => {
    try {
        const { nome, email, password, papel, status } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            nome,
            email,
            password: hashedPassword,
            papel,
            status
        });
        // Não retornar a senha
        const userResponse = user.toJSON();
        delete userResponse.password;
        res.status(201).json(userResponse);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Obter todos os usuários
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter um usuário por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um usuário
export const updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const [updated] = await User.update(updateData, { where: { id: req.params.id } });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email já cadastrado em outro usuário.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Desativar um usuário (Soft Delete)
export const deleteUser = async (req, res) => {
    try {
        const [updated] = await User.update({ status: 'Inativo' }, { where: { id: req.params.id } });
        if (updated) {
            res.status(200).json({ message: 'Usuário desativado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
