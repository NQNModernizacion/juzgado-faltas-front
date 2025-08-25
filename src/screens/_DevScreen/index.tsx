import { useState } from 'react'
import { toast } from 'react-toastify'

import { toastOptions } from '../../config/toast'

import { prioridades } from './exampleData'
import { dataTable } from './handlers'
import Container from '@/components/Container'
import Button from '@/components/Button'
import AlertView from './AlertView'
import ButtonView from './ButtonView'
import CardView from './CardView'
import FormView from './FormView'
import BadgeView from './BadgeView'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

type ModalOptions = 'ejemplo-tabla' | 'ejemplo-form' | null

const DevScreen = () => {
  const [selectedOption, setSelectedOption] = useState<ModalOptions>(null)

  const modalConfig = {
    'ejemplo-tabla': {
      title: 'Tabla ejemplo',
      content: (
        <Table
          height={600}
          search
          getRowHeight={() => 'auto'}
          data={dataTable(prioridades)}
        />
      ),
    },
    'ejemplo-form': {
      title: 'Ejemplo de Formulario',
      content: <FormView onCancel={() => setSelectedOption(null)} />,
    },
  }

  const showToast = () => {
    toast.success('success', toastOptions)
    toast.warning('warning', toastOptions)
    toast.error('error', toastOptions)
  }

  return (
    <>
      <Container
        linkBack="/"
        title="Componentes"
        subtitle="Vista para mostrar componentes y ejemplos"
        className="space-y-6"
      >
        <div className="flex flex-wrap gap-3">
          <Button onClick={showToast}>Mostrar Toasts</Button>
          <Button onClick={() => setSelectedOption('ejemplo-tabla')}>
            Ejemplo Tabla
          </Button>
          <Button onClick={() => setSelectedOption('ejemplo-form')}>
            Ejemplo de formulario
          </Button>
        </div>

        <hr />
        <CardView />
        <hr />
        <ButtonView />
        <hr />
        <AlertView />
        <hr />
        <BadgeView />
      </Container>

      <Modal
        show={!!selectedOption}
        title={selectedOption ? modalConfig[selectedOption].title : ''}
        onHide={() => setSelectedOption(null)}
      >
        {selectedOption ? modalConfig[selectedOption].content : null}
      </Modal>
    </>
  )
}

export default DevScreen
