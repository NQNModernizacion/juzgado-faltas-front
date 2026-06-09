import { CircularProgress } from '@mui/material'
import { ASSETS_URL } from '../../config'

type RFC = React.FC<{
  size?: number
  circularProgressSize?: number
  textoSpinner?: string
  file?: 'bola.png' | 'bola-blanco.png' | String
  color?: string
}>

const MuniSpinner: RFC = ({
  size = 70,
  circularProgressSize = 100,
  textoSpinner = '',
  file = 'bola.png',
  color = 'rgb(var(--mx-primary-600))',
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {textoSpinner !== '' && (
        <h2 className="text-lg font-semibold text-primary-700">
          {textoSpinner}
        </h2>
      )}

      <div className="relative flex items-center justify-center">
        <CircularProgress size={circularProgressSize} sx={{ color }} />
        <img
          src={ASSETS_URL + file}
          alt="Municipalidad Spinner"
          className="absolute"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  )
}

export default MuniSpinner
