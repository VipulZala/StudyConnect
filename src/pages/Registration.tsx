// src/pages/Register.tsx
import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import SocialButton from '../components/SocialButton';
import PhoneOtpModal from '../components/PhoneOtpModal';
import { apiFetch } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const nav = useNavigate();
  const { loginWithToken } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const resp = await apiFetch('/auth/register', { method: 'POST', body: form });
      if (resp?.access) {
        localStorage.setItem('sc_token', resp.access);
        await loginWithToken(resp.access);
        nav('/dashboard');
      } else throw new Error('No token returned');
    } catch (err: any) {
      setErr(err?.data?.message || err?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const startOAuth = (provider: 'google' | 'github') => {
    // Open OAuth window directed to backend OAuth route
    // backend must implement /auth/google and /auth/github
    const base = (import.meta.env.VITE_API_URL as string).replace('/api/v1', '');
    window.location.href = `${base}/auth/${provider}`;
  };

  return (
    <AuthLayout title="Register" subtitle="Create your StudyConnect account">
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="form-label text-muted small">Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control" />
        </div>
        <div>
          <label className="form-label text-muted small">Email</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-control" />
        </div>
        <div>
          <label className="form-label text-muted small">Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-control" />
        </div>

        {err && <div className="small text-danger">{err}</div>}

        <div className="d-flex gap-2">
          <button onClick={onSubmit as any} className="btn btn-primary w-100">{loading ? 'Creating…' : 'Register'}</button>
        </div>

        <div className="text-center small text-muted">or continue with</div>

        <div className="row g-2">
          <div className="col-sm-4">
            <SocialButton provider="google" onClick={() => startOAuth('google')}>
              <svg className="me-2" width="16" height="16" viewBox="0 0 533.5 544.3"><path fill="#4285F4" d="M533.5 278.4c0-18.3-1.5-36.1-4.4-53.3H272.1v100.9h147.1c-6.3 34.1-25 63-53.5 82.5v68h86.4c50.6-46.7 81.4-115.3 81.4-198.1z" /></svg>
              Google
            </SocialButton>
          </div>
          <div className="col-sm-4">
            <SocialButton provider="github" onClick={() => startOAuth('github')}>
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55v-2c-3.2.7-3.86-1.5-3.86-1.5-.52-1.32-1.27-1.67-1.27-1.67-1.04-.7.08-.68.08-.68 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.73-1.53-2.56-.3-5.26-1.28-5.26-5.66 0-1.25.45-2.27 1.17-3.07-.12-.3-.51-1.52.11-3.17 0 0 .95-.3 3.12 1.17a10.8 10.8 0 0 1 2.85-.38c.97 0 1.95.13 2.86.38 2.16-1.47 3.11-1.17 3.11-1.17.62 1.65.24 2.87.12 3.17.73.8 1.17 1.82 1.17 3.07 0 4.39-2.71 5.35-5.29 5.63.41.36.78 1.07.78 2.15v3.19c0 .3.2.66.79.55C20.71 21.38 24 17.08 24 12 24 5.65 18.35.5 12 .5z" /></svg>
              GitHub
            </SocialButton>
          </div>
          <div className="col-sm-4">
            <SocialButton provider="phone" onClick={() => setShowPhone(true)}>
              Phone
            </SocialButton>
          </div>
        </div>
        {showPhone && <PhoneOtpModal onClose={() => setShowPhone(false)} onLoggedIn={(token) => { localStorage.setItem('sc_token', token); loginWithToken(token).then(() => nav('/dashboard')); }} />}
      </div>
    </AuthLayout>
  );
}
