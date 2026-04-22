import { useState } from "react";
import {
  Control,
  useFieldArray,
  Controller,
} from "react-hook-form";

type TabType = "Padrones" | "Infractores" | "Infracciones";

type Row = {
  tipo: string;
  identificacion: string;
  nombre: string;
  documento: string;
};

interface FormValues {
  Padrones: Row[];
  Infractores: Row[];
  Infracciones: Row[];
}

interface Props {
  control: Control<FormValues>;
}

const tabs: TabType[] = ["Padrones", "Infractores", "Infracciones"];

const tipoOptions = [
  { label: "Zoonosis", value: "zoonosis", tab: "Padrones" },
  { label: "Inmueble", value: "inmueble", tab: "Padrones" },
  { label: "DNI", value: "dni", tab: "Infractores" },
  { label: "CUIT", value: "cuit", tab: "Infractores" },
];

export default function ActaTabsForm({ control }: Props) {
  
  const [activeTab, setActiveTab] = useState<TabType>("Padrones");
  const [filteredTipoOptions, setFilteredTipoOptions] = useState([
    { label: "Zoonosis", value: "zoonosis", tab: "Padrones" },
    { label: "Inmueble", value: "inmueble", tab: "Padrones" },
  ]);

  const padronesArray = useFieldArray({
    control,
    name: "Padrones",
  });

  const infractoresArray = useFieldArray({
    control,
    name: "Infractores",
  });

  const infraccionesArray = useFieldArray({
    control,
    name: "Infracciones",
  });

  const getFields = () => {
    switch (activeTab) {
      case "Padrones":
        return padronesArray.fields;
      case "Infractores":
        return infractoresArray.fields;
      case "Infracciones":
        return infraccionesArray.fields;
    }
  };

  const fields = getFields();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab)
              setFilteredTipoOptions(tipoOptions.filter(opt => opt.tab === tab));
            }}
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === tab
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
              <th className="p-2">Tipo</th>

              {activeTab === "Infractores" && (
                <th className="p-2">N° Documento</th>
              )}

              <th className="p-2">Identificación</th>
              <th className="p-2">Nombre</th>
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => {
              const baseName = `${activeTab}.${index}` as const;

              return (
                <tr key={field.id} className="border-b">

                  {/* Tipo (SELECT) */}

                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`${baseName}.tipo`}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full border rounded-lg px-3 py-1"
                        >
                          <option key={""} value={""}>
                            Seleccione
                          </option>
                          {filteredTipoOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </td>

                  {/* Documento SOLO en Infractores */}
                  {activeTab === "Infractores" && (
                    <td className="p-2">
                      <Controller
                        control={control}
                        name={`${baseName}.documento`}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="w-full border rounded-lg px-3 py-1"
                          />
                        )}
                      />
                    </td>
                  )}

                  {/* Identificación */}
                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`${baseName}.identificacion`}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="w-full border rounded-lg px-3 py-1"
                        />
                      )}
                    />
                  </td>

                  {/* Nombre */}
                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`${baseName}.nombre`}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="w-full border rounded-lg px-3 py-1"
                        />
                      )}
                    />
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import {
//   Control,
//   useFieldArray,
//   Controller,
//   FieldValues,
// } from "react-hook-form";
// import { SelectField } from "./Forms/SelectField";

// type TabType = "Padrones" | "Infractores" | "Infracciones";

// interface Row {
//   tipo: string;
//   identificacion: string;
//   nombre: string;
// }

// interface FormValues extends FieldValues {
//   Padrones: Row[];
//   Infractores: Row[];
//   Infracciones: Row[];
// }

// interface Props {
//   control: Control<FormValues>;
// }

// const tabs: TabType[] = ["Padrones", "Infractores", "Infracciones"];

// export default function ActaTabsForm({ control }: Props) {
//   const [activeTab, setActiveTab] = useState<TabType>("Padrones");

//   // ⚠️ Mejor usar 3 arrays separados (más estable)
//   const padronesArray = useFieldArray({
//     control,
//     name: "Padrones",
//   });

//   const infractoresArray = useFieldArray({
//     control,
//     name: "Infractores",
//   });

//   const infraccionesArray = useFieldArray({
//     control,
//     name: "Infracciones",
//   });

//   const getCurrentArray = () => {
//     switch (activeTab) {
//       case "Padrones":
//         return padronesArray;
//       case "Infractores":
//         return infractoresArray;
//       case "Infracciones":
//         return infraccionesArray;
//     }
//   };

//   const { fields } = getCurrentArray();

//   return (
//     <div className="bg-white rounded-xl shadow-md p-6 mt-6">

//       {/* Tabs */}
//       <div className="flex border-b mb-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             type="button"
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 font-medium border-b-2 ${activeTab === tab
//                 ? "border-red-400 text-red-500"
//                 : "border-transparent text-gray-500"
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tabla */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">

//           <thead>
//             <tr className="text-left border-b text-gray-600">
//               <th className="p-2">Tipo</th>
//               <th className="p-2">Identificación</th>
//               <th className="p-2">Nombre</th>
//             </tr>
//           </thead>

//           <tbody>
//             {fields.map((field, index) => (
//               <tr key={field.id} className="border-b">

//                 <td className="p-2">
//                   <SelectField
//                     name={`${activeTab}.${index}.tipo`}
//                     control={control}
//                     options={[
//                       { value: 1, label: "Zoonosis" },
//                       { value: 2, label: "Inmuebles" },
//                       { value: 3, label: "Comercios" },
//                     ]}
//                   />
//                   <Controller
//                     control={control}
//                     name={`${activeTab}.${index}.tipo`}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         className="w-full border rounded-lg px-3 py-1"
//                       />
//                     )}
//                   />
//                 </td>

//                 <td className="p-2">
//                   <Controller
//                     control={control}
//                     name={`${activeTab}.${index}.identificacion`}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         className="w-full border rounded-lg px-3 py-1"
//                       />
//                     )}
//                   />
//                 </td>

//                 <td className="p-2">
//                   <Controller
//                     control={control}
//                     name={`${activeTab}.${index}.nombre`}
//                     render={({ field }) => (
//                       <input
//                         {...field}
//                         className="w-full border rounded-lg px-3 py-1"
//                       />
//                     )}
//                   />
//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// }