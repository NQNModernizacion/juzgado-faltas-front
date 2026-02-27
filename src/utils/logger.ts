const isDev =
  (import.meta as any).env?.DEV ??
  (import.meta as any).env?.MODE === "development";

export const log = {
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args); // errores siempre
  },
};
