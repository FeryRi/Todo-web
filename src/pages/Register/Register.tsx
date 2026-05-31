import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { registerUser } from '../../services/users/userService';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { displayName: '', email: '', password: '', passwordConfirm: '' };
    let valid = true;

    if (!displayName.trim() || displayName.trim().length < 2) {
      newErrors.displayName = 'El nombre debe tener al menos 2 caracteres';
      valid = false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de correo inválido';
      valid = false;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      newErrors.password = 'Mínimo 8 caracteres: mayúscula, minúscula y número';
      valid = false;
    }
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await registerUser({ displayName, email, password, passwordConfirm });
      setSuccessMsg('Cuenta creada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Error al registrarse';
      setErrors(prev => ({ ...prev, email: msg }));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${hasError ? '#e74c3c' : '#e0e0e0'}`,
    fontSize: 16,
    boxSizing: 'border-box',
    outline: 'none',
    color: '#2c3e50',
    backgroundColor: '#fff',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Crear cuenta</h1>
          <p style={{ color: '#7f8c8d', marginTop: 8 }}>Regístrate para comenzar</p>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#d4edda', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#155724', fontSize: 14, textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Nombre */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Nombre
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setErrors({ ...errors, displayName: '' }); }}
              placeholder="Tu nombre"
              style={inputStyle(!!errors.displayName)}
            />
            {errors.displayName && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.displayName}</p>}
          </div>

          {/* Correo */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
              placeholder="ejemplo@correo.com"
              style={inputStyle(!!errors.email)}
            />
            {errors.email && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                placeholder="••••••••"
                style={{ ...inputStyle(!!errors.password), padding: '14px 48px 14px 16px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <IoEyeOffOutline size={22} color="#666" /> : <IoEyeOutline size={22} color="#666" />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2c3e50', marginBottom: 8 }}>
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={(e) => { setPasswordConfirm(e.target.value); setErrors({ ...errors, passwordConfirm: '' }); }}
              placeholder="••••••••"
              style={inputStyle(!!errors.passwordConfirm)}
            />
            {errors.passwordConfirm && <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.passwordConfirm}</p>}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: loading ? '#95a5a6' : '#3498db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: 14, margin: 0 }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#3498db', fontWeight: 700 }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
