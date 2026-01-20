import LoginForm from '@/components/Forms/LoginForm'

const Login = () => {
  // return (
  //   <div className="flex max-w-lg bg-white rounded-lg shadow-lg p-6 items-center justify-center mx-auto">
  //     <div className="w-full">
  //       <div className="flex justify-center pb-4">
  //         <img
  //           alt="Logo Neuquén Capital"
  //           className="w-60"
  //           //src="https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg"
  //           src='https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg'
  //         />
  //       </div>

  //       <LoginForm />
  //     </div>
  //   </div>
  // )
  return (
    <div className="flex max-w-lg mx-auto">
      <div
        className="
          w-full
          bg-white
          rounded-xl
          shadow-lg
          p-6
          border-2
          border-primary-400
        "
      >
        <div className="flex justify-center pb-4">
          <img
            alt="Logo Neuquén Capital"
            className="w-60"
            src="https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg"
          />
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default Login
