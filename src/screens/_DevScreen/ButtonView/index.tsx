import Button from '@/components/Button'
import FormSection from '@/components/FormSection'

const ButtonView = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">Botones</span>
      <FormSection title="Colores" fullWidth>
        <div className="flex flex-wrap gap-3">
          <Button color="primary">Botón</Button>
          <Button color="secondary">Botón</Button>
          <Button color="danger">Botón</Button>
          <Button color="warning">Botón</Button>
          <Button color="success">Botón</Button>
          <Button color="gray">Botón</Button>
        </div>
      </FormSection>

      <FormSection title="Colores variant='bordered'" fullWidth>
        <div className="flex flex-wrap gap-3">
          <Button variant="bordered" color="primary">
            Botón
          </Button>
          <Button variant="bordered" color="secondary">
            Botón
          </Button>
          <Button variant="bordered" color="danger">
            Botón
          </Button>
          <Button variant="bordered" color="warning">
            Botón
          </Button>
          <Button variant="bordered" color="success">
            Botón
          </Button>
          <Button variant="bordered" color="gray">
            Botón
          </Button>
        </div>
      </FormSection>

      <FormSection title="Size" fullWidth>
        <div className="space-x-3">
          <Button size="xs">size="xs"</Button>
          <Button size="sm">size="sm"</Button>
          <Button size="md">size="md"</Button>
          <Button size="lg">size="lg"</Button>
          <Button size="xl">size="xl"</Button>
        </div>
      </FormSection>

      <FormSection title="TextSize" fullWidth>
        <div className="space-x-3">
          <Button textSize="xs">textSize="xs"</Button>
          <Button textSize="sm">textSize="sm"</Button>
          <Button textSize="md">textSize="md"</Button>
          <Button textSize="lg">textSize="lg"</Button>
          <Button textSize="xl">textSize="xl"</Button>
          <Button textSize="2xl">textSize="2xl"</Button>
        </div>
      </FormSection>

      <FormSection title="TextSize" fullWidth>
        <div className="space-x-3">
          <Button shadow="none">shadow="none"</Button>
          <Button shadow="sm">shadow="sm"</Button>
          <Button shadow="md">shadow="md"</Button>
          <Button shadow="lg">shadow="lg"</Button>
          <Button shadow="xl">shadow="xl"</Button>
        </div>
      </FormSection>
    </div>
  )
}
export default ButtonView
