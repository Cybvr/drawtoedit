import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UndoIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

export const RedoIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
);

export const ResetIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const GenerateIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.25l-.648-1.688a2.25 2.25 0 01-1.423-1.423L12.75 18.5l1.688-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.688a2.25 2.25 0 011.423 1.423L19.75 18.5l-1.688.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

export const BrushIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.75a2.25 2.25 0 01-2.25-2.25V10.5a2.25 2.25 0 012.25-2.25h2.748m.75 7.5a.75.75 0 01-.75-.75V8.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v6.25a.75.75 0 01-.75.75h-4.5zm5.25-9.75h.008v.008h-.008V5.5zm-.75 2.25h.008v.008h-.008V7.75zm-.75 2.25h.008v.008h-.008v-.008zm-.75 2.25h.008v.008h-.008v-.008zm-3-4.5h.008v.008h-.008V7.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75a2.25 2.25 0 012.25-2.25h.008a2.25 2.25 0 012.25 2.25v.008a2.25 2.25 0 01-2.25 2.25h-.008a2.25 2.25 0 01-2.25-2.25V3.75z" />
    </svg>
);

export const EraserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.983 2.523L21.477 11.017a1.5 1.5 0 010 2.121l-2.121 2.121a1.5 1.5 0 01-2.121 0l-8.494-8.494a1.5 1.5 0 010-2.121l2.121-2.121a1.5 1.5 0 012.121 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.567 4.933L2.477 14.023a1.5 1.5 0 000 2.121l2.121 2.121a1.5 1.5 0 002.121 0l9.09-9.09M3.75 16.5l5.25 5.25" />
    </svg>
);