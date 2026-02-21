import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthSuccess() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        // Read the token passed from the backend as a URL query param
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          console.error('No token found in URL');
          navigate('/login?error=oauth_failed');
          return;
        }

        // Store the token and fetch user profile
        localStorage.setItem('sc_token', token);
        await loginWithToken(token);
        navigate('/');
      } catch (err) {
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
      </div>
    </div>
  );
}
