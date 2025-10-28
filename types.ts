export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  empresaId: number;
  empresa?: Empresa; // Optional nested object for joins
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
  empresa?: Empresa; // Optional nested object for joins
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
  funcionario?: Funcionario; // Optional nested object for joins
  cliente?: Cliente; // Optional nested object for joins
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
