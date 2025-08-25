import FormFooter from '@/components/FormFooter'
import { Person, Role, User } from '@/interfaces'
import { axios } from '@/utils/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import InfoPerson from './InfoPerson'
import { toast } from 'react-toastify'
import { toastOptions } from '@/config/toast'
import Input from '@/components/Inputs/Input'

interface DataContext {
  users: User[]
  roles: Role[]
  permissions: any[]
}

interface State {
  loading: boolean
  role: Role | null
  user: User | null
}

interface Props {
  show: boolean
  onUserSelect: (user: User) => void
}

const AddUsers: React.FC<Props> = ({ show, onUserSelect }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const [persona, setPersona] = useState<Person | null>(null)

  const onSubmit = async (form: any) => {
    const response = await axios().get(`get_person_info/${form.documento}`)

    const { data } = response
    if (!data.error) {
      setPersona(response.data)
    } else {
      toast.error(data.error, toastOptions)
    }
  }

  const handleSelectPerson = () => {
    if (persona) {
      if (persona.informacion.usuarioID == 0) {
        toast.error('La persona no posee usuario', toastOptions)
      } else {
        const selectedUser: User = {
          id: persona.informacion.usuarioID, // Asegúrate de que `persona.id` sea el ID del usuario
          roles: [], // Inicialmente sin roles
        }
        onUserSelect(selectedUser)
      }
    }
  }

  if (!show) return null

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-end gap-4 max-w-3xl mt-4 "
      >
        <Input
          className={{ container: 'w-full' }}
          control={control}
          name="documento"
          label="Número de DNI"
        />
        <div>
          <FormFooter isSubmitting={isSubmitting} submitButtonText="Buscar" />
        </div>
      </form>
      {persona && (
        <InfoPerson
          persona={persona.informacion}
          onSelect={handleSelectPerson}
        />
      )}
    </div>
  )
}

export default AddUsers
