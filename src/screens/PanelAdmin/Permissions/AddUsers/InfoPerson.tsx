import Button from '@/components/Button';

const InfoPerson = ({ persona, onSelect }: any) => {
  if (!persona) return null;

  return (
    <div className="py-5 flex justify-between">
      <div className=" flex items-center gap-6">
        <div className="inline-block">
          <h2 className="text-2xl font-bold text-zinc-700">
            {persona?.razonSocial.nombreCompleto}
          </h2>
          <p className="mt-2 font-semibold text-zinc-700">
            {persona?.correoElectronico.direccion}
          </p>
        </div>
      </div>
      <div className="me-14 mt-8">
        <Button onClick={onSelect}>Seleccionar</Button>
      </div>
    </div>
  );
};

export default InfoPerson;