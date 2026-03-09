import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User, ArrowRight } from 'lucide-react';
import './AuthPage.css';

const LoginPage = ({ gateway, title }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                gateway: gateway || 'DEPT'
            };

            const response = await fetch('http://localhost:8081/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errJson = JSON.parse(errorText);
                    throw new Error(errJson.message || 'Login failed.');
                } catch {
                    throw new Error(errorText || 'Login failed. Please check your credentials.');
                }
            }

            const textData = await response.text();
            let data;
            try {
                data = JSON.parse(textData);
            } catch {
                throw new Error("Invalid response from server");
            }

            console.log("Login Success Data:", data);

            // Save token and user details
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            const userRole = data.roles && data.roles.length > 0 ? data.roles[0] : '';
            const dept = data.department ? data.department.toLowerCase() : 'general';
            const subRole = data.subRole ? data.subRole.toLowerCase() : '';

            console.log("User Role:", userRole, "Dept:", dept, "SubRole:", subRole);

            // ── Routing Logic ─────────────────────────────────────────────────
            if (userRole === 'ROLE_COLLECTOR') {
                navigate('/dashboard/admin/central');
                return;
            }

            if (userRole === 'ROLE_AUTO_SUPERVISOR') {
                navigate(`/dashboard/${dept}/automation-supervisor`);
                return;
            }

            // Department sub-role routing (covers ROLE_DEPT_HEAD and ROLE_STAFF)
            if (dept && subRole) {
                navigate(`/dashboard/${dept}/${subRole.replace(/_/g, '-')}`);
                return;
            }

            // Generic fallbacks
            switch (userRole) {
                case 'ROLE_DEPT_HEAD':
                    navigate(`/dashboard/${dept}/head`);
                    break;
                case 'ROLE_STAFF':
                    navigate('/staff-portal');
                    break;
                default:
                    console.warn("Unknown role, defaulting:", userRole);
                    navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className={`auth-blob-${gateway === 'ADMIN' ? 'red' : 'blue'}`} />
            <div className="auth-blob-purple" />

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">{title || 'Welcome Back'}</h1>
                    <p className="auth-desc">
                        {gateway === 'ADMIN'
                            ? 'Restricted Access: District Command Room'
                            : 'Enter your credentials to access the department portal'}
                    </p>
                </div>

                <div className="auth-content">
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="login-username" className="label">Username</label>
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    id="login-username"
                                    name="username"
                                    placeholder="e.g., ceo_education"
                                    className="input-field"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="login-password" className="label">Password</label>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-box">
                                <Lock size={16} />
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Sign In <ArrowRight size={16} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        {gateway !== 'ADMIN' && (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => navigate('/register')} className="link-primary">
                                    Register Now
                                </button>
                            </>
                        )}
                        {gateway === 'ADMIN' && (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                Restricted to Authorized Personnel Only
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
