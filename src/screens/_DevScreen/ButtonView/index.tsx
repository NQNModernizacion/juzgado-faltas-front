import { ButtonBase, FormSection } from "muni-ui";

const ButtonView = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold text-text">Botones</span>

      <FormSection title="Colores (solid)" fullWidth>
        <div className="flex flex-wrap gap-3">
          <ButtonBase color="primary">Primary</ButtonBase>
          <ButtonBase color="secondary">Secondary</ButtonBase>
          <ButtonBase color="danger">Danger</ButtonBase>
          <ButtonBase color="warning">Warning</ButtonBase>
          <ButtonBase color="success">Success</ButtonBase>
          <ButtonBase color="info">Info</ButtonBase>
          <ButtonBase color="neutral">Neutral</ButtonBase>
          <ButtonBase color="gray">Gray (legacy → neutral)</ButtonBase>
        </div>
      </FormSection>

      <FormSection title="Variants" fullWidth>
        <div className="flex flex-wrap gap-3">
          <ButtonBase variant="solid" color="primary">
            solid
          </ButtonBase>

          <ButtonBase variant="outline" color="primary">
            outline
          </ButtonBase>

          <ButtonBase variant="ghost" color="primary">
            ghost
          </ButtonBase>
        </div>
      </FormSection>

      <FormSection title="Sizes" fullWidth>
        <div className="flex flex-wrap gap-3">
          <ButtonBase size="sm">sm</ButtonBase>
          <ButtonBase size="md">md</ButtonBase>
          <ButtonBase size="lg">lg</ButtonBase>
        </div>
      </FormSection>

      <FormSection title="Full width + Loading" fullWidth>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ButtonBase fullWidth color="primary">
            fullWidth
          </ButtonBase>

          <ButtonBase fullWidth color="primary" isLoading>
            loading
          </ButtonBase>
        </div>
      </FormSection>

      <FormSection title="Con slots (start / end)" fullWidth>
        <div className="flex flex-wrap gap-3">
          <ButtonBase
            color="secondary"
            startContent={<span aria-hidden="true">🔎</span>}
          >
            Buscar
          </ButtonBase>

          <ButtonBase
            color="primary"
            endContent={<span aria-hidden="true">➜</span>}
          >
            Continuar
          </ButtonBase>
        </div>
      </FormSection>
    </div>
  );
};

export default ButtonView;
