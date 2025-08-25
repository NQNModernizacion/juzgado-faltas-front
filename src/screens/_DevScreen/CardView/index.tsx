import Card from '@/components/Card'
import FormSection from '@/components/FormSection'

const CardView = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">Card</span>
      <FormSection title="bgColor">
        <Card bgColor="primary" title="Titulo">
          bgColor="primary"
        </Card>
        <Card bgColor="secondary" title="Titulo">
          bgColor="secondary"
        </Card>
        <Card bgColor="danger" title="Titulo">
          bgColor="danger"
        </Card>
        <Card bgColor="warning" title="Titulo">
          bgColor="warning"
        </Card>
        <Card bgColor="success" title="Titulo">
          bgColor="success"
        </Card>
        <Card bgColor="gray" title="Titulo">
          bgColor="gray"
        </Card>
      </FormSection>
    </div>
  )
}
export default CardView
