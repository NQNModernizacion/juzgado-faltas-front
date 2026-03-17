import { useNavigate } from 'react-router-dom'

// import Container from '../Container'
import ChevronLeft from '../Svgs/ChevronLeft'
import Home from '../Svgs/Home'
//import error404 from '@/assets/404_not_found.png'
import error404 from "@/assets/404_not_found.png.png";

import { Container } from 'muni-ui'

export const NotFound = () => {
  const nav = useNavigate()

  return (
    <Container>
      <div className="flex flex-col items-center">
        <div className="flex gap-4 pb-4">
          {/* Botón Volver */}
          <button
            className="flex items-center gap-2 border border-primary-500 text-primary-500 px-6 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition"
            onClick={() => nav(-1)}
          >
            <ChevronLeft className="size-6" />
            Volver
          </button>

          {/* Botón Ir al Home */}
          <button
            className="flex items-center gap-2 bg-primary-400 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            onClick={() => nav('/')}
          >
            <Home className="size-6" />
            Ir al Home
          </button>
        </div>
        <img src={error404} className="ms-16 w-full max-w-2xl" alt="" />
      </div>
    </Container>
  )
}

export default NotFound
