import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from '../../services/auth/AuthServices';
import { useAuth } from "../../hooks/useAuth";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let valid = true;
    if (!email.trim()) { newErrors.email = 'El correo es obligatorio'; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = 'Formato invalido'; valid = false; }
    if (!password.trim()) { newErrors.password = 'La contraseña es obligatoria'; valid = false; }
    else if (password.length < 6) { newErrors.password = 'Mínimo 6 caracteres'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = await login(email, password);
      setToken(token);
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const msg = firebaseError.code == 'auth/invalid-credential'
        ? 'Correo o contraseña inválidos'
        : 'Error al iniciar sesión';
      setErrors({ email: '', password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#2c3e50' }}>Bienvenido</h1>
          <p style={{ color: '#7f8c8d', marginTop: 8 }}>Inicia sesión para continuar</p>
        </div>

        <div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
              placeholder="ejemplo@correo.com"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${errors.email ? '#e74c3c' : '#e0e0e0'}`, fontSize: 16, boxSizing: 'border-box' }}
            />
            {errors.email && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                placeholder="••••••"
                style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: 12, border: `1px solid ${errors.password ? '#e74c3c' : '#e0e0e0'}`, fontSize: 16, boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              >
                {showPassword ? <IoEyeOffOutline size={22} color="#666" /> : <IoEyeOutline size={22} color="#666" />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#95a5a6' : '#3498db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#7f8c8d', fontSize: 14 }}>
            ¿No tienes cuenta?{' '}
            <Link to='/register' style={{ color: '#3498db', fontWeight: 700 }}>Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}