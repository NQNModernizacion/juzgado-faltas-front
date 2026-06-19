import { useState } from 'react'
import { Control, useFieldArray, Controller } from 'react-hook-form'

type TabType = 'Padrones' | 'Infractores' | 'Infracciones'

type Row = {
  tipo_id: string
  categoria_padron_id?: string
  categoria_infractor_id?: string
  identificacion?: string
  nombre: string
  documento?: string
  observaciones?: string
}

interface FormValues {
  Padrones: Row[]
  Infractores: Row[]
  Infracciones: Row[]
}

interface Props {
  control: Control<FormValues>
}

const tabs: TabType[] = ['Padrones', 'Infractores', 'Infracciones']

let tipoOptions: any = [
  // { label: "Zoonosis", value: "zoonosis", tab: "Padrones" },
  // { label: "Inmueble", value: "inmueble", tab: "Padrones" },
  // { label: "DNI", value: "dni", tab: "Infractores" },
  // { label: "CUIT", value: "cuit", tab: "Infractores" },
]

export default function ActaTabsForm({
  control,
  infractores,
  padrones,
  infracciones,
}: any) {
  // console.log('padrones', padrones);

  const [activeTab, setActiveTab] = useState<TabType>('Padrones')
  const [filteredTipoOptions, setFilteredTipoOptions] = useState([
    { label: 'Zoonosis', value: 'zoonosis', tab: 'Padrones' },
    { label: 'Inmueble', value: 'inmueble', tab: 'Padrones' },
  ])

  const padronesArray = useFieldArray({
    control,
    name: 'Padrones',
  })

  const infractoresArray = useFieldArray({
    control,
    name: 'Infractores',
  })

  const infraccionesArray = useFieldArray({
    control,
    name: 'Infracciones',
  })

  const getCurrentArray = () => {
    switch (activeTab) {
      case 'Padrones':
        tipoOptions = padrones?.tipo_padron
        return padronesArray
      case 'Infractores':
        tipoOptions = infractores?.tipo
        return infractoresArray
      case 'Infracciones':
        tipoOptions = infracciones
        return infraccionesArray
    }
  }

  const addRow = () => {
    const emptyRow = {
      tipo_id: '',
      identificacion: '',
      nombre: '',
      documento: '',
      categoria_padron_id: '',
      categoria_infractor_id: '',
      observaciones: '',
    }
    getCurrentArray().append(emptyRow)
  }

  const removeRow = (index: number) => {
    getCurrentArray().remove(index)
  }

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
              // setFilteredTipoOptions(tipoOptions.filter(opt => opt.tab === tab));
            }}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab
                ? 'border-red-400 text-red-500'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab === 'Infractores' ? 'Imputados' : tab}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-600">
              <th className="p-2">
                {activeTab === 'Infracciones' ? 'Identificación' : 'Tipo'}
              </th>

              {activeTab === 'Infractores' && (
                <th className="p-2">N° Documento</th>
              )}

              {activeTab === 'Padrones' && <th className="p-2">Identificación</th>}
              {activeTab === 'Padrones' && <th className="p-2">Nombre</th>}
              {activeTab === 'Infractores' && <th className="p-2">Nombre</th>}
              {activeTab === 'Infractores' && <th className="p-2">Observaciones</th>}
              {activeTab === 'Infractores' && <th className="p-2">Categoria</th>}
              {activeTab === 'Padrones' && <th className="p-2">Categoria</th>}
              <th className="p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {getCurrentArray().fields.map((field, index) => {
              const baseName = `${activeTab}.${index}` as const

              return (
                <tr key={field.id} className="border-b">
                  {/* Tipo (SELECT) */}

                  <td className="p-2">
                    <Controller
                      control={control}
                      name={`${baseName}.tipo_id`}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full border rounded-lg px-3 py-1"
                        >
                          <option key={''} value={''}>
                            Seleccione
                          </option>
                          {tipoOptions?.map((opt: any) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </td>

                  {/* Documento SOLO en Infractores */}
                  {activeTab === 'Infractores' && (
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
                  {activeTab !== 'Infracciones' && (
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
                  )}

                  {activeTab !== 'Infracciones' && (
                    <>
                      {activeTab === 'Padrones' && (
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
                      )}

                      {activeTab === 'Infractores' && (
                        <td className="p-2">
                          <Controller
                            control={control}
                            name={`${baseName}.observaciones`}
                            render={({ field }) => (
                              <textarea
                                {...field}
                                className="w-full border rounded-lg px-3 py-1"
                                rows={2}
                              />
                            )}
                          />
                        </td>
                      )}

                      {activeTab === 'Infractores' && (
                        <td className="p-2">
                          <Controller
                            control={control}
                            name={`${baseName}.categoria_infractor_id`}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full border rounded-lg px-3 py-1"
                              >
                                <option value="">Seleccione</option>
                                {(infractores?.categorias ?? padrones?.categorias)?.map((opt: any) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.nombre}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </td>
                      )}

                      {activeTab === 'Padrones' && (
                        <td className="p-2">
                          <Controller
                            control={control}
                            name={`${baseName}.categoria_padron_id`}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full border rounded-lg px-3 py-1"
                              >
                                <option value="">Seleccione</option>
                                {padrones?.categorias?.map((opt: any) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.nombre}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </td>
                      )}
                    </>
                  )}

                  {/* Acciones */}
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Botón para agregar fila */}
      <div className="mt-4">
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Agregar Fila
        </button>
      </div>
    </div>
  )
}
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
