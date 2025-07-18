import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail } from 'lucide-react';
import { Button } from '../common/Button';

export const LoginPage: React.FC = () => {
  const { setUser } = useApp();

  const handleDummyLogin = () => {
    setUser({
      email: 'harman@joveo.com',
      name: 'Harman',
      picture: undefined
    });
  };

  return (
    <div className="min-h-screen joveo-gradient-bg flex flex-col justify-center items-center px-24">
      <div className="joveo-card p-64 w-full max-w-md">
        <div className="flex flex-col items-center mb-48">
          <div className="w-64 h-64 rounded-2xl bg-primary-700 flex items-center justify-center mb-24 shadow-lg">
            <Mail className="h-32 w-32 text-white" />
          </div>
          <div className="text-center">
            <h1 className="heading-h4 text-slate-900 mb-8">
              Email Manager
            </h1>
            <p className="body1-regular text-slate-500">Joveo Partner Communications</p>
          </div>
        </div>
        
        <div className="text-center mb-40">
          <h2 className="subtitle1-semibold text-slate-900 mb-8">Welcome Back</h2>
          <p className="body1-regular text-slate-600">Please sign in with your Joveo account</p>
        </div>

        <Button
          onClick={handleDummyLogin}
          className="w-full justify-center"
          variant="primary-solid"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};