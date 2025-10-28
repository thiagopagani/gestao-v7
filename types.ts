// FIX: This file had invalid content. Created type definitions for all data models used in the application.

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
  cep: string | null;
  endereco: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo';
  empresaId: number;
  empresa?: Empresa;
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
  empresa?: Empresa;
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
  funcionario?: Funcionario;
  cliente?: Cliente;
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