import { ButtonBase, Container } from '@nqnmodernizacion/muni-ui'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
  const nav = useNavigate()

  return (
    <Container title="Menú Principal">
      <div className="m-auto max-w-64 space-y-3">
        <ButtonBase className="w-full" onClick={() => nav('/acta/alta')}>
          Alta de actas
        </ButtonBase>
        <ButtonBase className="w-full" onClick={() => nav('/acta/listado')}>
          Listado de actas
        </ButtonBase>
        <ButtonBase className="w-full" onClick={() => nav('_viewcom')}>
          Componentes
        </ButtonBase>
        <ButtonBase className="w-full" onClick={() => nav('admin')}>
          Panel admin
        </ButtonBase>
      </div>
    </Container>
  )
}

export default Menu
