import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-caveno-black text-caveno-cream flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-caveno-gold/10 rounded-full blur-[180px] pointer-events-none" />
      <AuthModal
        isOpen={isOpen}
        onClose={() => navigate('/')}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default Login;
