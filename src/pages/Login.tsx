import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#221F26] via-[#2C2A3A] to-[#1E1B24] py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
};

export default Login;