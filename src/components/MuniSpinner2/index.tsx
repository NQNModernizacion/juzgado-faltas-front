import { CircularProgress } from '@mui/material'
import bola from '/bola.png'
import bolaBlanca from '/bola-blanca.png'

interface Props {
  width?: string
  height?: string
  circularProgressSize?: number
  circularProgressColor?: string
  textoSpinner?: string
  fileName?: string
}

const MuniSpinner2 = (props: Props) => {
  const {
    width = '70px',
    height = '70px',
    circularProgressSize = 100,
    circularProgressColor = '#1134C9',
    textoSpinner = '',
    fileName = 'bola.png',
  } = props

  return (
    <div className="d-flex align-items-center justify-content-center gap-4">
      {textoSpinner !== '' && <h2>{textoSpinner}</h2>}
      <div className="d-flex justify-content-center align-items-center">
        <CircularProgress size={circularProgressSize} style={{ color: circularProgressColor }} />
        <img
          src={fileName === 'bola.png' ? bola : bolaBlanca}
          alt="Municipalidad Spinner"
          style={{
            width: width,
            height: height,
            position: 'absolute',
          }}
        />
      </div>
    </div>
  )
}

export default MuniSpinner2
