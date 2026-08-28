import { useState, useEffect } from 'react'
import { useFieldArray, Controller, useWatch, FieldErrors } from 'react-hook-form'
import SelectSearch from '@/screens/PanelAdmin/components/SelectSearch'
import { buscarInfractorDni, buscarPadronDni } from '@/services/ActaService'
import Lupa from '@/components/Svgs/Lupa'
import { toastOptions } from '@/config/toast'
import { toast } from 'react-toastify'

type TabType = 'Padrones' | 'Infractores' | 'Infracciones';


const tabs: TabType[] = ['Padrones', 'Infractores', 'Infracciones']

let tipoOptions: any = [];

export default function ActaTabsForm({ control, infractores, padrones, infracciones, errors }: any) {

  const [activeTab, setActiveTab] = useState<TabType>('Padrones');
  const [searchingPadron, setSearchingPadron] = useState<Record<number, boolean>>({});
  const [searchingInfractor, setSearchingInfractor] = useState<Record<number, boolean>>({});
  const padronesValues = useWatch({ control, name: 'Padrones' });
  const infractoresValues = useWatch({ control, name: 'Infractores' });

  useEffect(() => {
    if (errors) {
      if (errors.Padrones) {
        setActiveTab('Padrones');
      } else if (errors.Infractores) {
        setActiveTab('Infractores');
      } else if (errors.Infracciones) {
        setActiveTab('Infracciones');
      }
    }
  }, [errors]);

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
    }
    getCurrentArray().append(emptyRow)
  }

  const removeRow = (index: number) => {
    getCurrentArray().remove(index)
  }


  const handleBuscarPadron = async (index: number) => {
    const identificacion = padronesValues?.[index]?.identificacion || ''
    const tipoId = padronesValues?.[index]?.tipo_id

    const tipoOption = padrones?.tipo_padron?.find(
      (opt: any) =>
        String(opt.id) === String(tipoId) || String(opt.value) === String(tipoId)
    )
    const tipoNombre = tipoOption?.nombre || ''

    if (!identificacion) {
      toast.warning('Debe completar identificación para buscar padrones', toastOptions);
      return
    }

    if (!['Automotores', 'Motovehiculos'].includes(tipoNombre)) {
      toast.warning('La búsqueda solo está disponible para Automotores o Motovehiculos', toastOptions);
      return
    }

    try {
      setSearchingPadron((prev) => ({ ...prev, [index]: true }))
      const result = await buscarPadronDni(tipoNombre, identificacion)
      toast.success('Padrón encontrado', toastOptions);
    } catch (error) {
      toast.error('Error buscando padrón', toastOptions);
    } finally {
      setSearchingPadron((prev) => ({ ...prev, [index]: false }))
    }
  }

  const handleBuscarInfractor = async (index: number) => {
    const identificacion = infractoresValues?.[index]?.identificacion || ''
    const tipoId = infractoresValues?.[index]?.tipo_id

    if (!identificacion) {
      toast.warning('Debe completar identificación para buscar imputados', toastOptions)
      return
    }

    try {
      setSearchingInfractor((prev) => ({ ...prev, [index]: true }))
      const result = await buscarInfractorDni(identificacion)
      toast.success('Imputado encontrado', toastOptions)
      console.log('Resultado búsqueda imputado', result)
    } catch (error) {
      toast.error('Error buscando imputado', toastOptions)
      console.error('Error buscando imputado', error)
    } finally {
      setSearchingInfractor((prev) => ({ ...prev, [index]: false }))
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-1 px-2 border border-border mt-1">
      {/* Tabs */}
      <div className="flex border-b mb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs font-medium border-b-2 ${activeTab === tab ? 'border-red-400 text-red-500' : 'border-transparent text-gray-500'}`}
          >
            {tab === 'Infractores' ? 'Imputados' : tab}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left border-b text-gray-600">
              <th className="p-1">{activeTab === 'Infracciones' ? 'Identificación' : 'Tipo'}</th>

              {activeTab === 'Infractores' && <th className="p-1">N° Documento</th>}

              {activeTab === 'Padrones' && <th className="p-1">Identificación</th>}
              {activeTab !== 'Infracciones' && <th className="p-1">Nombre</th>}
              {activeTab === 'Infractores' && <th className="p-1">Categoria</th>}
              {activeTab === 'Padrones' && <th className="p-1">Categoria</th>}
              <th className="p-1">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {getCurrentArray().fields.map((field, index) => {
              const baseName = `${activeTab}.${index}` as const

              return (
                <tr key={field.id} className="border-b">
                  {/* Tipo (SELECT) */}

                  <td className="p-1">
                    <Controller
                      control={control}
                      name={`${baseName}.tipo_id`}
                      render={({ field }) => {
                        if (activeTab === 'Infracciones') {
                          const mappedOptions = tipoOptions?.map((opt: any) => ({
                            value: opt.id,
                            label: opt.nombre,
                          })) || []
                          const fieldError = errors?.[activeTab]?.[index]?.tipo_id

                          return (
                            <div>
                              <SelectSearch
                                id={`${baseName}.tipo_id`}
                                options={mappedOptions}
                                value={mappedOptions.find((opt: any) => String(opt.value) === String(field.value)) || null}
                                onChange={(selectedOption: any) => field.onChange(selectedOption?.value || '')}
                                isSearchable={true}
                                isClearable={true}
                                className={{ container: '' }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                placeholder="Buscar tipo..."
                                noOptionsMessage={() => 'No se encontraron resultados'}
                              />
                              {fieldError && (
                                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                              )}
                            </div>
                          )
                        }

                        const fieldError = errors?.[activeTab]?.[index]?.tipo_id

                        return (
                          <div>
                            <select
                              {...field}
                              className={`w-full border rounded-lg px-2 py-0 h-8 text-xs ${fieldError ? 'border-red-500' : ''}`}
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
                            {fieldError && (
                              <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                            )}
                          </div>
                        )
                      }}
                    />
                  </td>

                  {/* Documento SOLO en Infractores */}
                  {activeTab === 'Infractores' && (
                    <td className="p-1">
                      <Controller
                        control={control}
                        name={`${baseName}.documento`}
                        render={({ field }) => {
                          const fieldError = errors?.[activeTab]?.[index]?.documento
                          return (
                            <div>
                              <div className={`flex items-center overflow-hidden rounded-lg border ${fieldError ? 'border-red-500' : 'border-gray-300'}`}>
                                <input
                                  {...field}
                                  className="w-full min-w-0 border-0 px-1 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleBuscarInfractor(index)}
                                  disabled={searchingInfractor[index]}
                                  className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-2 py-0 h-8 text-blue-600 hover:bg-gray-100"
                                  aria-label="Buscar"
                                  title="Buscar"
                                >
                                  <Lupa color="text-blue-600" />
                                </button>
                              </div>
                              {fieldError && (
                                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                              )}
                            </div>
                          )
                        }}
                      />
                    </td>
                  )}

                  {/* Identificación */}
                  {activeTab === 'Padrones' && (
                    <td className="p-1">
                      <Controller
                        control={control}
                        name={`${baseName}.identificacion`}
                        render={({ field }) => {
                          const fieldError = errors?.[activeTab]?.[index]?.identificacion
                          return (
                            <div>
                              <div className={`flex items-center overflow-hidden rounded-lg border ${fieldError ? 'border-red-500' : 'border-gray-300'}`}>
                                <input
                                  {...field}
                                  className="w-full min-w-0 border-0 px-1 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleBuscarPadron(index)}
                                  className="flex items-center justify-center border-l border-gray-300 bg-gray-50 px-2 py-0 h-8 text-blue-600 hover:bg-gray-100"
                                  disabled={searchingPadron[index]}
                                  aria-label="Buscar"
                                  title="Buscar"
                                >
                                  <Lupa color="text-blue-600" />
                                </button>
                              </div>
                              {fieldError && (
                                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                              )}
                            </div>
                          )
                        }}
                      />
                    </td>
                  )}
                  {activeTab !== 'Infracciones' && (
                    <>
                      <td className="p-1">
                        <Controller control={control} name={`${baseName}.nombre`} render={({ field }) => {
                          const fieldError = errors?.[activeTab]?.[index]?.nombre
                          return (
                            <div>
                              <input {...field} className={`w-full border rounded-lg px-2 py-0 h-8 text-xs ${fieldError ? 'border-red-500' : ''}`} />
                              {fieldError && (
                                <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                              )}
                            </div>
                          )
                        }} />
                      </td>

                      {activeTab === 'Infractores' && (
                        <td className="p-1">
                          <Controller
                            control={control}
                            name={`${baseName}.categoria_infractor_id`}
                            render={({ field }) => {
                              const fieldError = errors?.[activeTab]?.[index]?.categoria_infractor_id
                              return (
                                <div>
                                  <select {...field} className={`w-full border rounded-lg px-2 py-0 h-8 text-xs ${fieldError ? 'border-red-500' : ''}`}>
                                    <option value="">Seleccione</option>
                                    {infractores?.categoria_infractor?.map((opt: any) => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.nombre}
                                      </option>
                                    ))}
                                  </select>
                                  {fieldError && (
                                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                                  )}
                                </div>
                              )
                            }}
                          />
                        </td>
                      )}

                      {activeTab === 'Padrones' && (
                        <td className="p-1">
                          <Controller
                            control={control}
                            name={`${baseName}.categoria_padron_id`}
                            render={({ field }) => {
                              const fieldError = errors?.[activeTab]?.[index]?.categoria_padron_id
                              return (
                                <div>
                                  <select {...field} className={`w-full border rounded-lg px-2 py-0 h-8 text-xs ${fieldError ? 'border-red-500' : ''}`}>
                                    <option value="">Seleccione</option>
                                    {padrones?.categorias?.map((opt: any) => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.nombre}
                                      </option>
                                    ))}
                                  </select>
                                  {fieldError && (
                                    <p className="text-red-500 text-xs mt-1">{fieldError.message}</p>
                                  )}
                                </div>
                              )
                            }}
                          />
                        </td>
                      )}
                    </>
                  )}

                  {/* Acciones */}
                  <td className="p-1">
                    <button type="button" onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-xs">
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
      <div className="mt-2">
        <button type="button" onClick={addRow} className="px-3 py-1 text-xs h-8 bg-blue-500 text-white rounded hover:bg-blue-600">
          + Agregar Fila
        </button>
      </div>
    </div>
  )
}
