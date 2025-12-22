import React, { useContext } from 'react';
import MathField from './MathField';

export default function QuestionRenderer({ text, inline = false }) {
  if (!text) return null;
  const cleanedText = text.replace(/\\\\/g, '\\');
  const parts = cleanedText.split(/(\$\$[^$]+\$\$|\$[^\n$]+\$)/g).filter(Boolean);
  const OuterTag = inline ? 'span' : 'div';
  return (
    <OuterTag className={inline ? 'inline' : 'text-gray-800 text-sm leading-relaxed'}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.substring(2, part.length - 2).trim();
          if (inline) return <MathField latex={latex} key={index} />;
          return <div className="my-4" key={index}><MathField latex={latex} /></div>;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.substring(1, part.length - 1).trim();
          return <MathField latex={latex} key={index} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </OuterTag>
  );
}
