import { useState } from 'react'
import { postAgregarAGrupo } from '@/services/ActaService'

interface BannerProps {
  grupoId: number
  onSuccess: () => void
  setIsLoading: (val: boolean) => void
}

export const BannerAgregarActa = ({
  grupoId,
  onSuccess,
  setIsLoading,
}: BannerProps) => {
  const [actaIdInput, setActaIdInput] = useState('')

  const handleAgregar = () => {
    if (!actaIdInput.trim()) return
    const id = actaIdInput.trim()
    postAgregarAGrupo(
      grupoId,
      [id],
      () => {
        setActaIdInput('')
        onSuccess()
      },
      setIsLoading
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="text-gray-700 font-bold text-base">Añadir Acta a este Grupo</h3>
        <p className="text-gray-500 text-sm">
          Introduce el ID (Causa) del acta que deseas incorporar al Grupo #{grupoId}.
        </p>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="number"
          placeholder="ID de Acta (Causa)"
          value={actaIdInput}
          onChange={(e) => setActaIdInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full md:w-48 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAgregar}
          disabled={!actaIdInput.trim()}
          className={`font-semibold py-1.5 px-4 rounded-lg shadow-sm transition-colors whitespace-nowrap ${
            actaIdInput.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Añadir al Grupo
        </button>
      </div>
    </div>
  )
}
