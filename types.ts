export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Cliente {
  id: number;
  nome: string;
  contato: string | null;
  telefone: string | null;
  endereco: string | null;
  status: 'Ativo' | 'Inativo' | 'Concluído';
  empresaId: number;
  empresa?: {
    nome: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  email: string | null;
  telefone: string | null;
  tipo: 'Autônomo' | 'Treinamento';
  status: 'Ativo' | 'Inativo';
  empresaId: number;
  empresa?: {
    nome: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Diaria {
  id: number;
  data: string;
  valor: number;
  status: 'Pendente' | 'Aprovado' | 'Cancelado';
  observacao: string | null;
  funcionarioId: number;
  clienteId: number;
  funcionario?: {
    nome: string;
  };
  cliente?: {
    nome: string;
    empresa?: {
        nome: string;
    }
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  papel: 'Admin' | 'Operador';
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
}
