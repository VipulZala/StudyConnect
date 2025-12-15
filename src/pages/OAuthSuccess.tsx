import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export default function OAuthSuccess() {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        await refreshSession();
        navigate('/');
      } catch (err) {
        console.error('OAuth success handler failed', err);
        navigate('/login?error=oauth_failed');
      }
    };

    completeLogin();
  }, [refreshSession, navigate]);

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
