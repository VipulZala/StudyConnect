import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Decode JWT payload without verifying (payload is public base64)
function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export default function OAuthSuccess() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          console.error('No token in URL');
          navigate('/login?error=oauth_failed');
          return;
        }

        // Decode user info from the JWT payload directly (no API call needed!)
        const payload = decodeJWT(token);
        if (!payload?.id) {
          console.error('Invalid token payload');
          navigate('/login?error=oauth_failed');
          return;
        }

        // Store token
        localStorage.setItem('sc_token', token);

        // Store user info decoded from the token (avoids cross-domain fetch)
        const user = {
          _id: payload.id,
          id: payload.id,
          name: payload.name || '',
          email: payload.email || '',
          avatar: payload.avatar || ''
        };
        localStorage.setItem('sc_user', JSON.stringify(user));

        // Now call loginWithToken — it will try /users/me but we already have user cached
        try {
          await loginWithToken(token);
        } catch {
          // Even if /users/me fails, we have the user from the token — navigate anyway
          console.warn('loginWithToken failed, using token payload instead');
        }

        navigate('/');
      } catch (err: any) {
        console.error('OAuth success handler failed', err);
        navigate('/login?error=oauth_failed');
      }
    };

    completeLogin();
  }, [loginWithToken, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>Completing login...</h3>
        <p className="text-muted">Almost there!</p>
      </div>
    </div>
  );
}
