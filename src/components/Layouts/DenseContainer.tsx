import React, { ReactNode } from 'react';
import ChevronLeft from '@/components/Svgs/ChevronLeft';

interface DenseContainerProps {
  title: string;
  linkBack?: string;
  children: ReactNode;
  
  /* Props opcionales para personalizar estilos (márgenes, paddings, colores) */
  containerClassName?: string;
  titleClassName?: string;
  hrClassName?: string;
  backButtonClassName?: string;
}

export const DenseContainer: React.FC<DenseContainerProps> = ({ 
  title, 
  linkBack, 
  children,
  containerClassName = "",
  titleClassName = "",
  hrClassName = "",
  backButtonClassName = ""
}) => {
  return (
    <div className={`bg-surface rounded-xl shadow-mxSoft p-2 sm:p-4 w-full mx-auto relative overflow-hidden ${containerClassName}`}>
      
      {/* Botón Volver posicionado arriba a la izquierda */}
      {linkBack && (
        <a 
          href={linkBack} 
          className={`absolute top-3 left-4 sm:top-5 sm:left-6 flex items-center text-text hover:text-primary-600 text-sm font-semibold transition-colors ${backButtonClassName}`}
        >
          <ChevronLeft className="size-4 shrink-0 mr-1 text-primary-500" />
          Volver
        </a>
      )}

      {/* Título Centrado */}
      <div className={`text-center mb-2 mt-1 sm:mt-0 ${titleClassName}`}>
        <h2 className="text-2xl font-bold text-primary-500 m-0">{title}</h2>
      </div>

      <hr className={`border-border mb-2 ${hrClassName}`} />

      {/* Contenido */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
