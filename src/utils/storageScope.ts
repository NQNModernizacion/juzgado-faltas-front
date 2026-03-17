// function getOrigin() {
//   return window.location.origin;
// }

// function getBasePath() {
//   const base = import.meta.env.BASE_URL || "/";
//   return base.endsWith("/") && base !== "/" ? base.slice(0, -1) : base;
// }

// /** scope por app */
// export function scopedAppKey(name: string) {
//   const origin = getOrigin();
//   const basePath = getBasePath();
//   return `mx:${origin}${basePath}:${name}`;
// }

// /** scope global por dominio */
// export function scopedGlobalKey(name: string) {
//   const origin = getOrigin();
//   return `mx:${origin}:${name}`;
// }

//--------------------------------------------------------------------------
const getBasePath = () => {
  const base = import.meta.env.BASE_URL || "/";
  return base !== "/" && base.endsWith("/") ? base.slice(0, -1) : base;
};

// Para la sesión de la App (SessionStorage)
export function scopedAppKey(name: string) {
  const basePath = getBasePath();
  // Usamos el pathname para diferenciar apps en el mismo dominio
  return `app:${basePath}:${name}`; 
}

// Para MuniExpress / Global (LocalStorage)
export function scopedGlobalKey(name: string) {
  return `mx:global:${name}`;
}