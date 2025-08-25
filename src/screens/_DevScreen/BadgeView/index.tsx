import Badge from '@/components/Badge'
import FormSection from '@/components/FormSection'

type BadgeViewProps = {}

const BadgeView = ({}: BadgeViewProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">Badges</span>
      <FormSection title="textSize" fullWidth>
        <div className="flex flex-wrap gap-3">
          <Badge textSize="xs">textSize="xs"</Badge>
          <Badge textSize="sm">textSize="sm"</Badge>
          <Badge textSize="md">textSize="md"</Badge>
          <Badge textSize="lg">textSize="lg"</Badge>
        </div>
      </FormSection>

      <FormSection title="size" fullWidth>
        <div className="flex flex-wrap gap-3">
          <Badge size="xs">size="xs"</Badge>
          <Badge size="sm">size="sm"</Badge>
          <Badge size="md">size="md"</Badge>
          <Badge size="lg">size="lg"</Badge>
        </div>
      </FormSection>

      <FormSection title="color" fullWidth>
        <div className="flex flex-wrap gap-3">
          <Badge color="primary">color="primary"</Badge>
          <Badge color="success">color="success"</Badge>
          <Badge color="warning">color="warning"</Badge>
          <Badge color="danger">color="danger"</Badge>
          <Badge color="gray">color="gray"</Badge>
          <Badge color="blue">color="blue"</Badge>
          <Badge color="orange">color="orange"</Badge>
          <Badge color="purple">color="purple"</Badge>
        </div>
      </FormSection>
    </div>
  )
}

export default BadgeView
