import Button from '@/components/Button'
import Container from '@/components/Container'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
  const nav = useNavigate()

  return (
    <Container title="Menú Principal">
      <div className="m-auto max-w-64 space-y-3">
        <Button className="w-full" onClick={() => nav('_viewcom')}>
          Componentes
        </Button>
        <Button className="w-full" onClick={() => nav('admin')}>
          Panel admin
        </Button>
      </div>
    </Container>
  )
}

export default Menu
