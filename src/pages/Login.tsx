// src/pages/Login.tsx
import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import SocialButton from '../components/SocialButton';
import { apiFetch } from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { loginWithToken, loginWithGoogle, loginWithGithub } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const resp = await apiFetch('/auth/login', { method: 'POST', body: form });
      if (resp?.access) {
        localStorage.setItem('sc_token', resp.access);
        await loginWithToken(resp.access);
        await loginWithToken(resp.access);
        nav(from, { replace: true });
      } else throw new Error('No token returned');
    } catch (err: any) {
      setErr(err?.data?.message || err?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Login" subtitle="Sign in to your account">
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small text-muted">Email</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-control" />
        </div>
        <div>
          <label className="form-label small text-muted">Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-control" />
        </div>

        {err && <div className="small text-danger">{err}</div>}

        <div className="d-flex gap-2">
          <button onClick={onSubmit as any} className="btn btn-primary w-100">{loading ? 'Signing in…' : 'Login'}</button>
        </div>

        <div className="text-center small text-muted">or continue with</div>

        <div className="row g-2">
          <div className="col-12 col-sm-6">
            <SocialButton provider="google" onClick={loginWithGoogle}>Google</SocialButton>
          </div>
          <div className="col-12 col-sm-6">
            <SocialButton provider="github" onClick={loginWithGithub}>GitHub</SocialButton>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
