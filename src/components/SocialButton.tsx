import React, { ReactNode } from 'react';

type ProviderType = 'google' | 'github' | 'phone';

interface SocialButtonProps {
  provider: ProviderType;
  onClick: () => void;
  children: ReactNode;
}

// Simple map to apply basic colors based on provider type
const providerColors: Record<ProviderType, { bg: string, text: string }> = {
  google: { bg: '#4285F4', text: 'white' },
  github: { bg: '#333', text: 'white' },
  phone: { bg: '#28a745', text: 'white' },
};

export default function SocialButton({ provider, onClick, children }: SocialButtonProps) {
  const { bg, text } = providerColors[provider];

  return (
    <button
      type="button"
      className="btn w-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: bg,
        color: text,
        border: '1px solid #ccc',
        padding: '8px 12px',
      }}
      onClick={onClick}
    >
      {/* Renders the SVG and text passed as children */}
      {children}
    </button>
  );
}