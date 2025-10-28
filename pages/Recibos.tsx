import React from 'react';

const Recibos: React.FC = () => {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-slate-800">Recibos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gere e gerencie os recibos de pagamento das diárias.
          </p>
        </div>
      </div>
      <div className="mt-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-slate-700">Em Desenvolvimento</h2>
        <p className="mt-2 text-slate-500">
          Esta funcionalidade para geração de recibos está em construção.
        </p>
      </div>
    </div>
  );
};

export default Recibos;
