import { Card, FormSection } from "@nqnmodernizacion/muni-ui";

const headerBg: Record<string, string> = {
  primary: "bg-primary-600 text-white",
  secondary: "bg-secondary-500 text-primary-700",
  danger: "bg-danger-600 text-white",
  warning: "bg-warning-500 text-black",
  success: "bg-success-600 text-white",
  gray: "bg-bg text-text border-b border-border",
};

const CardView = () => {
  const items = ["primary", "secondary", "danger", "warning", "success", "gray"] as const;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-2xl font-bold">Card</span>

      <FormSection title="bgColor">
        {items.map((c) => (
          <Card key={c}>
            {/* Header */}
            <div className={`px-4 py-2 font-semibold ${headerBg[c]}`}>Titulo</div>

            {/* Content */}
            <div className="p-4">{`bgColor="${c}"`}</div>
          </Card>
        ))}
      </FormSection>
    </div>
  );
};

export default CardView;
