import Alert from '@/components/Alert'
import FormSection from '@/components/FormSection'
import Info from '@/components/Svgs/Info'

const AlertView = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">Alert</span>

      <FormSection title="Border" fullWidth>
        <Alert borderStyle="solid">borderStyle='solid'</Alert>
        <Alert borderStyle="dashed">borderStyle='dashed'</Alert>
      </FormSection>

      <FormSection title="Color" fullWidth>
        <Alert color="primary">color="primary"</Alert>
        <Alert color="secondary">color="secondary"</Alert>
        <Alert color="success">color="success"</Alert>
        <Alert color="warning">color="warning"</Alert>
        <Alert color="danger">color="danger"</Alert>
        <Alert color="gray">color="gray"</Alert>
      </FormSection>

      <FormSection title="Iconos" fullWidth>
        <Alert startContent={<Info />}>startContent=Icono</Alert>
        <Alert endContent={<Info />}>endContent=Icono</Alert>
      </FormSection>
    </div>
  )
}
export default AlertView
