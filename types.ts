export interface Empresa {
  id: number;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  createdAt?: string;
  updatedAt?: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  empresaId: number;
  empresa?: {
    nome: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  tipo: 'Treinamento' | 'Autonomo';
  status: 'Ativo' | 'Inativo';
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  papel: 'Admin' | 'Operador';
  status: 'Ativo' | 'Inativo';
  createdAt?: string;
  updatedAt?: string;
}
