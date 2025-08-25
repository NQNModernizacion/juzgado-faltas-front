const AllErrors = ({ errors }) => {
  return (
    <>
      {Object.keys(errors).map((key) => {
        return (
          <div key={key}>
            <p className="text-red-500">{`${errors[key].message}`}</p>
          </div>
        )
      })}
    </>
  )
}

export default AllErrors
