import { useState } from "react";

type TabType = "Padrones" | "Infractores" | "Infracciones";

interface Row {
  tipo_id: string;
  categoria?: string;
  identificacion: string;
  nombre: string;
  documento: string;
}

interface ActaTabsViewProps {
  padrones: Row[];
  infractores: Row[];
  infracciones: Row[];
  datosIniciales?: any;
}

const tabs: TabType[] = ["Padrones", "Infractores", "Infracciones"];

export default function ActaTabsView({ padrones, infractores, infracciones, datosIniciales }: ActaTabsViewProps) {

  const [activeTab, setActiveTab] = useState<TabType>("Padrones");

  const getCurrentData = () => {
    switch (activeTab) {
      case "Padrones":
        return padrones || [];
      case "Infractores":
        return infractores || [];
      case "Infracciones":
        return infracciones || [];
    }
  };

  const getLabel = (value: any, options: any[]) => {
    const option = options?.find(opt => opt.value === value || opt.id === value);
    return option ? (option.label || option.nombre || option.descripcion) : value;
  };

  const data = getCurrentData();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab
                ? "border-red-400 text-red-500"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="text-left border-b text-gray-600">
              <th className="p-2">{activeTab === "Infracciones" ? "Identificación" : "Tipo"}</th>

              {activeTab === "Infractores" && (
                <th className="p-2">N° Documento</th>
              )}

              {activeTab !== "Infracciones" && <th className="p-2">Identificación</th>}
              {activeTab !== "Infracciones" && <th className="p-2">Nombre</th>}
              {activeTab === "Padrones" && <th className="p-2">Categoria</th>}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? data.map((row, index) => (
              <tr key={index} className="border-b">

                <td className="p-2">
                  {activeTab === "Infracciones"
                    ? row.identificacion
                    : getLabel(row.tipo_id, activeTab === "Padrones" ? datosIniciales?.combos?.padrones?.tipo_padron : datosIniciales?.combos?.infractores?.tipo)
                  }
                </td>

                {activeTab === "Infractores" && (
                  <td className="p-2">{row.documento}</td>
                )}

                {activeTab !== "Infracciones" && (
                  <>
                    <td className="p-2">{row.identificacion}</td>
                    <td className="p-2">{row.nombre}</td>
                    {activeTab === "Padrones" && (
                      <td className="p-2">
                        {getLabel(row.categoria, datosIniciales?.combos?.padrones?.categorias)}
                      </td>
                    )}
                  </>
                )}

              </tr>
            )) : (
              <tr>
                <td colSpan={activeTab === "Infracciones" ? 1 : activeTab === "Infractores" ? 4 : 4} className="p-4 text-center text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}