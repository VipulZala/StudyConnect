// src/components/AuthLayout.tsx
import React from 'react';

export default function AuthLayout({ children, title, subtitle }: {
  children: React.ReactNode; title?: string; subtitle?: string;
}) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: '1024px' }}>
        <div className="row bg-white shadow rounded-4 overflow-hidden">
          <div className="col-12 col-md-6 p-5">
            <h1 className="fw-bold text-dark mb-2">{title}</h1>
            {subtitle && <p className="text-muted">{subtitle}</p>}
            <div className="mt-4">
              {children}
            </div>
          </div>
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary text-white p-5">
            <div className="text-center" style={{ maxWidth: '320px' }}>
              <h2 className="h3 fw-semibold mb-2">Welcome to StudyConnect</h2>
              <p className="mb-4 opacity-75">Collaborate on projects, chat in real-time, and share study rooms.</p>
              <div className="bg-white bg-opacity-10 rounded p-3">
                <p className="small fw-bold mb-1">Tip</p>
                <p className="small mb-0">Use Google or GitHub for faster sign-up — it saves your profile info automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
