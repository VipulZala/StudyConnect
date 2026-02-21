import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthSuccess() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string>('Starting...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const completeLogin = async () => {
      try {
        // Step 1: Read the token from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const fullUrl = window.location.href;

        setDebugInfo(`URL: ${fullUrl}`);

        if (!token) {
          setError(`No token found in URL. Full URL was: ${fullUrl}`);
          return;
        }

        setDebugInfo(`Token found (${token.substring(0, 20)}...). Calling loginWithToken...`);

        // Step 2: Store the token
        localStorage.setItem('sc_token', token);

        // Step 3: Fetch user profile
        const apiUrl = import.meta.env.VITE_API_URL;
        setDebugInfo(`API URL: ${apiUrl}. Fetching /users/me...`);

        const meResp = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDebugInfo(`/users/me status: ${meResp.status}`);

        if (!meResp.ok) {
          const errText = await meResp.text();
          setError(`/users/me failed with ${meResp.status}: ${errText}`);
          return;
        }

        const me = await meResp.json();
        setDebugInfo(`Got user: ${me.name || me.email}. Navigating...`);

        await loginWithToken(token);
        navigate('/');
      } catch (err: any) {
        setError(`Exception: ${err?.message || String(err)}`);
      }
    };

    completeLogin();
  }, [loginWithToken, navigate]);

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center p-4" style={{ maxWidth: 600 }}>
          <div className="text-danger mb-3" style={{ fontSize: 48 }}>❌</div>
          <h3 className="text-danger">OAuth Login Failed</h3>
          <div className="alert alert-danger mt-3 text-start" style={{ wordBreak: 'break-all' }}>
            <strong>Error:</strong> {error}
          </div>
          <div className="alert alert-secondary mt-2 text-start" style={{ wordBreak: 'break-all' }}>
            <strong>Debug:</strong> {debugInfo}
          </div>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>Completing login...</h3>
        <p className="text-muted small mt-2">{debugInfo}</p>
      </div>
    </div>
  );
}
