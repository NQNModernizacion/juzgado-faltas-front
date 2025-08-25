interface ModalConfirmProps {
  object: {
    show: boolean
    close: () => void
    title: string
    accept: () => void
    loading: boolean
    styles?: React.CSSProperties
    body: React.ReactNode
  }
}

const ModalConfirm = ({ object }: ModalConfirmProps) => {
  if (!object.show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white  rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-900 ">{object.title}</h2>

        {/* Cuerpo */}
        <div className="mt-4 text-gray-700 ">{object.body}</div>

        {/* Footer con botones */}
        <div className="mt-6 flex justify-around">
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            onClick={object.accept}
            disabled={object.loading}
          >
            {object.loading ? 'Cargando...' : 'Aceptar'}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={object.close}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm
