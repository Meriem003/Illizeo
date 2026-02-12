import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <AnimatedBackground />      
      <div className="relative z-10 w-full animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;