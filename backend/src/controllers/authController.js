import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Login do usuário
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user || user.status !== 'Ativo') {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // Não retornar a senha
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({ message: 'Login bem-sucedido!', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};