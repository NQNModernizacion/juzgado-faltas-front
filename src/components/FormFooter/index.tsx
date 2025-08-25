import Button from '../Button'

type ModalFooterProps = {
  children?: React.ReactNode
  onCancel?: () => void
  submitButtonText?: string
  isSubmitting?: boolean
}

const FormFooter = ({ children, onCancel, submitButtonText, isSubmitting }: ModalFooterProps) => {
  return (
    <footer className="flex flex-row gap-3 justify-end pt-6">
      {onCancel && (
        <Button color="danger" variant="solid" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      {children}
      {submitButtonText && (
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="disabled:opacity-50 disabled:hover:opacity-50"
        >
          {submitButtonText}
        </Button>
      )}
    </footer>
  )
}

export default FormFooter
