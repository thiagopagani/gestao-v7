import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

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
            status,
        });
        // Não retornar a senha
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

// Obter todos os usuários
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Nunca retornar a senha
            order: [['nome', 'ASC']],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};

// Obter um usuário por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
};

// Atualizar um usuário
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...updateData } = req.body;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const [updated] = await User.update(updateData, { where: { id } });

        if (updated) {
            const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password'] } });
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

// Excluir (desativar) um usuário - Soft Delete
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update({ status: 'Inativo' }, { where: { id } });
        if (updated) {
            res.status(200).json({ message: 'Usuário desativado com sucesso' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar usuário', error: error.message });
    }
};
