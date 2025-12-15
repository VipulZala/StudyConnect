import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

interface PhoneOtpModalProps {
  onClose: () => void;
  // This function is called with the final token upon successful login/sign-up
  onLoggedIn: (token: string) => void;
}

export default function PhoneOtpModal({ onClose, onLoggedIn }: PhoneOtpModalProps) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'details' | 'otp'>('details');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate Indian phone number
  const validateIndianPhone = (phone: string): { valid: boolean; formatted: string; error?: string } => {
    // Remove all spaces and dashes
    let cleaned = phone.replace(/[\s-]/g, '');

    // If starts with +91, remove it for validation
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    }

    // Check if it's exactly 10 digits
    if (!/^\d{10}$/.test(cleaned)) {
      return { valid: false, formatted: phone, error: 'Phone number must be 10 digits' };
    }

    // Check if it starts with valid Indian mobile prefixes (6-9)
    if (!/^[6-9]/.test(cleaned)) {
      return { valid: false, formatted: phone, error: 'Invalid Indian mobile number' };
    }

    // Return formatted with +91
    return { valid: true, formatted: `+91${cleaned}` };
  };

  // --- Stage 1: Send Phone Number and Username ---
  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }

    if (!phoneNumber) {
      setError('Please enter a phone number.');
      setLoading(false);
      return;
    }

    // Validate Indian phone number
    const validation = validateIndianPhone(phoneNumber);
    if (!validation.valid) {
      setError(validation.error || 'Invalid phone number');
      setLoading(false);
      return;
    }

    try {
      // API Call 1: Request OTP from backend
      await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: { phone: validation.formatted, name: username.trim() }
      });
      setPhoneNumber(validation.formatted); // Update with formatted number
      setStage('otp'); // Switch to the OTP input stage
      setSuccess('Verification code sent! Please check your phone.');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Stage 2: Verify OTP ---
  const handleVerifyOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!otp) {
      setError('Please enter the received OTP.');
      setLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits.');
      setLoading(false);
      return;
    }

    try {
      // API Call 2: Verify OTP with backend
      const resp = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: { phone: phoneNumber, code: otp, name: username.trim() }
      });

      if (resp?.access) {
        // Success: Get the token and pass it to the parent component
        onLoggedIn(resp.access);
        onClose(); // Close the modal
      } else {
        throw new Error('Verification failed, no token received.');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Auto-add +91 prefix if user starts typing digits
    if (value && !value.startsWith('+') && /^\d/.test(value)) {
      value = '+91' + value;
    }
    setPhoneNumber(value);
  };

  // Simple inline modal implementation for demonstration
  return (
    <div style={modalStyle.backdrop} onClick={onClose}>
      <div style={modalStyle.content} onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-1 fw-bold">Phone Authentication</h5>
        <p className="text-muted small mb-3">
          {stage === 'details' ? 'Enter your details to continue' : 'Enter the verification code'}
        </p>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
        {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}

        {stage === 'details' ? (
          <>
            <div className="mb-3">
              <label className="form-label small text-muted mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-control"
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted mb-1">Indian Phone Number</label>
              <input
                type="tel"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="form-control"
                disabled={loading}
              />
              <small className="text-muted">Format: +91XXXXXXXXXX</small>
            </div>
            <button
              onClick={handleSendOtp}
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <p className="small mb-2">
                <strong>Name:</strong> {username}
              </p>
              <p className="small mb-3">
                <strong>Phone:</strong> {phoneNumber}
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-control text-center fs-5 tracking-widest"
                disabled={loading}
                maxLength={6}
                autoFocus
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="btn btn-success w-100 mb-2"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => { setStage('details'); setOtp(''); setError(''); setSuccess(''); }}
              className="btn btn-outline-secondary w-100 btn-sm"
              disabled={loading}
            >
              Change Phone Number
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="btn btn-light w-100 mt-2"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Basic inline styles for a quick modal effect
const modalStyle = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
  },
  content: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  }
};