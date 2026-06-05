import { useState } from 'react'
import { postAgregarAGrupo, postDesagruparActas } from '@/services/ActaService'

interface Props {
  actaId: string | undefined
  grupoId: number | null | undefined
  onAgrupacionCambio: () => void
  setIsLoadingGlobal: (val: boolean) => void
}

export const BannerAgrupacion = ({
  actaId,
  grupoId,
  onAgrupacionCambio,
  setIsLoadingGlobal,
}: Props) => {
  const [inputGrupoId, setInputGrupoId] = useState('')

  const handleAnadir = () => {
    if (!inputGrupoId) return
    postAgregarAGrupo(
      inputGrupoId,
      [actaId],
      () => {
        setInputGrupoId('')
        onAgrupacionCambio()
      },
      setIsLoadingGlobal
    )
  }

  const handleDesagrupar = () => {
    postDesagruparActas(
      [actaId],
      () => {
        onAgrupacionCambio()
      },
      setIsLoadingGlobal
    )
  }

  if (grupoId) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-blue-800 font-semibold text-lg">Acta Agrupada</h3>
          <p className="text-blue-600 text-sm">
            Esta acta pertenece al Grupo #{grupoId}. Las actas agrupadas se
            procesan en conjunto.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDesagrupar}
          className="bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold py-1.5 px-4 rounded shadow-sm transition-colors"
        >
          Desagrupar Acta
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="text-gray-700 font-semibold">Agrupar Acta</h3>
        <p className="text-gray-500 text-sm">
          Esta acta no pertenece a ningún grupo. Puedes añadirla a un grupo
          existente.
        </p>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="number"
          placeholder="ID del Grupo"
          value={inputGrupoId}
          onChange={(e) => setInputGrupoId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full md:w-40 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAnadir}
          disabled={!inputGrupoId}
          className={`font-semibold py-1.5 px-4 rounded shadow-sm transition-colors whitespace-nowrap ${
            inputGrupoId
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Añadir a Grupo
        </button>
      </div>
    </div>
  )
}
