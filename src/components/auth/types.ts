export interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  error?: string;
  role: 'student' | 'teacher';
}