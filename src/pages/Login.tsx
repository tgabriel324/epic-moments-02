import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/Logo";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-8">
        <Logo className="w-20 h-20" />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;