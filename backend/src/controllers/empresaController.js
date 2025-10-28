import { Empresa } from '../models/index.js';

// Criar uma nova empresa
export const createEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.create(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar empresa', error: error.message });
  }
};

// Obter todas as empresas com filtro opcional por status
export const getAllEmpresas = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    const empresas = await Empresa.findAll({ where, order: [['nome', 'ASC']] });
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresas', error: error.message });
  }
};

// Obter uma empresa por ID
export const getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (empresa) {
      res.status(200).json(empresa);
    } else {
      res.status(404).json({ message: 'Empresa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresa', error: error.message });
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
      res.status(404).json({ message: 'Empresa não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar empresa', error: error.message });
  }
};

// Deletar (desativar) uma empresa (Soft Delete)
export const deleteEmpresa = async (req, res) => {
  try {
    const [updated] = await Empresa.update({ status: 'Inativo' }, { where: { id: req.params.id } });
    if (updated) {
      res.status(200).json({ message: 'Empresa desativada com sucesso' });
    } else {
      res.status(404).json({ message: 'Empresa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desativar empresa', error: error.message });
  }
};
