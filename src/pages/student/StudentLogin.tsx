import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoginForm } from "../../components/auth";
import { handleApiError } from "../../utils/errorHandling";

const StudentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      setError("");
      await login(credentials, "student");
      const from =
        (location.state as any)?.from?.pathname || "/student/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      handleApiError(err, "Invalid credentials");
      setError("Invalid credentials");
    }
  };

  return <LoginForm onSubmit={handleLogin} error={error} role="student" />;
};

export default StudentLogin;
