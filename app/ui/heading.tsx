import React from 'react';

interface HeadingProps {
  title: string;
}

export default function Heading({ title }: HeadingProps) {
  return (
    <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
  );
}
