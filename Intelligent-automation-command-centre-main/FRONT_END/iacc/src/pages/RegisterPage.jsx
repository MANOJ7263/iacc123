import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Loader2, UserPlus, Building2, Shield, User, Mail, Lock,
    ChevronRight, ChevronLeft, GraduationCap, Heart, Truck,
    Banknote, BarChart3, ArrowRight, Check
} from 'lucide-react';
import './AuthPage.css';

// ─── Department Configuration ─────────────────────────────────────────────────
const DEPARTMENTS = [
    {
        id: 'EDUCATION',
        label: 'Education',
        icon: GraduationCap,
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        roles: [
            { value: 'CEO', label: 'CEO – Chief Education Officer', description: 'Department Head & Admin' },
            { value: 'DEO', label: 'DEO – District Education Officer', description: 'Sub-District Manager' },
            { value: 'HEADMASTER', label: 'Headmaster / Principal', description: 'School Administration' },
            { value: 'TEACHER', label: 'Teacher / Professor', description: 'Teaching Staff Access' },
            { value: 'STUDENT', label: 'Student', description: 'Student Access' },
            { value: 'AUTOMATION_SUPERVISOR', label: 'Automation Supervisor', description: 'RPA & Bot Oversight' },
        ]
    },
    {
        id: 'HEALTH',
        label: 'Health',
        icon: Heart,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
        roles: [
            { value: 'CMO', label: 'CMO – Chief Medical Officer', description: 'Department Head & Admin' },
            { value: 'DHO', label: 'DHO – District Health Officer', description: 'Sub-District Manager' },
            { value: 'HOSPITAL_WARDEN', label: 'Hospital Director', description: 'Hospital Administration' },
            { value: 'DOCTOR', label: 'Doctor / Staff', description: 'Medical Staff Access' },
            { value: 'AUTOMATION_SUPERVISOR', label: 'Automation Supervisor', description: 'RPA & Bot Oversight' },
        ]
    },
    {
        id: 'TRANSPORT',
        label: 'Transport',
        icon: Truck,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        roles: [
            { value: 'CTO', label: 'CTO – Chief Transport Officer', description: 'Department Head & Admin' },
            { value: 'DTO', label: 'DTO – District Transport Officer', description: 'Sub-District Manager' },
            { value: 'RTO_OFFICER', label: 'RTO Officer', description: 'Road Transport Office Staff' },
            { value: 'STAFF', label: 'Transport Staff', description: 'General Staff Access' },
            { value: 'AUTOMATION_SUPERVISOR', label: 'Automation Supervisor', description: 'RPA & Bot Oversight' },
        ]
    },
    {
        id: 'FINANCE',
        label: 'Finance',
        icon: Banknote,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        roles: [
            { value: 'CFO', label: 'CFO – Chief Finance Officer', description: 'Department Head & Admin' },
            { value: 'DFO', label: 'DFO – District Finance Officer', description: 'Sub-District Manager' },
            { value: 'ACCOUNTS_OFFICER', label: 'Accounts Officer', description: 'Finance Operations' },
            { value: 'STAFF', label: 'Finance Staff', description: 'General Staff Access' },
            { value: 'AUTOMATION_SUPERVISOR', label: 'Automation Supervisor', description: 'RPA & Bot Oversight' },
        ]
    },
    {
        id: 'REVENUE',
        label: 'Revenue',
        icon: BarChart3,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        roles: [
            { value: 'CRO', label: 'CRO – Chief Revenue Officer', description: 'Department Head & Admin' },
            { value: 'DRO', label: 'DRO – District Revenue Officer', description: 'Sub-District Manager' },
            { value: 'TAHSILDAR', label: 'Tahsildar / Revenue Inspector', description: 'Revenue Operations' },
            { value: 'STAFF', label: 'Revenue Staff', description: 'General Staff Access' },
            { value: 'AUTOMATION_SUPERVISOR', label: 'Automation Supervisor', description: 'RPA & Bot Oversight' },
        ]
    },
];

const RegisterPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ── Step & dept are stored in URL params so browser Back works correctly ──
    const step = parseInt(searchParams.get('step') || '1', 10);
    const selectedDept = searchParams.get('dept') || null;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        subRole: '',
    });

    // Reset error on step change
    useEffect(() => { setError(''); }, [step]);

    const selectedDeptConfig = DEPARTMENTS.find(d => d.id === selectedDept);

    // ── Navigation helpers (push to URL so Back button works) ──────────────────
    const goToStep2 = () => setSearchParams({ step: '2' });
    const goToStep3 = (deptId) => setSearchParams({ step: '3', dept: deptId });
    const goBack = () => navigate(-1); // ← uses browser history — goes back 1 step

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (!formData.subRole) {
            setError('Please select a role.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                department: selectedDept,
                subRole: formData.subRole,
            };

            const response = await fetch('http://localhost:8081/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const text = await response.text();
            if (!response.ok) {
                try { throw new Error(JSON.parse(text).message || text); }
                catch { throw new Error(text || 'Registration failed.'); }
            }

            // Save to mock local array so they show up in CEO/dept head delegate lists instantly
            const localUsers = JSON.parse(localStorage.getItem('iacc_demo_users') || '[]');
            localUsers.push({ id: formData.username, name: formData.username, role: formData.subRole, sub: 'Registered User' });
            localStorage.setItem('iacc_demo_users', JSON.stringify(localUsers));

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Step 1: Admin or Department ──────────────────────────────────────────
    if (step === 1) {
        return (
            <div className="auth-page reg-page">
                <div className="auth-blob-blue" />
                <div className="auth-blob-purple" />
                <div className="reg-step-card">
                    <div className="reg-header">
                        <div className="reg-step-badge">Step 1 of 3</div>
                        <h1 className="reg-title">Create Your Account</h1>
                        <p className="reg-subtitle">Who are you registering as?</p>
                    </div>
                    <div className="reg-type-grid">
                        <button
                            className="reg-type-btn admin-btn"
                            onClick={() => navigate('/admin/auth')}
                        >
                            <div className="reg-type-icon">
                                <Shield size={36} color="#fff" />
                            </div>
                            <div className="reg-type-info">
                                <span className="reg-type-title">Supreme Admin</span>
                                <span className="reg-type-desc">District Collector – Restricted Access</span>
                            </div>
                            <ArrowRight size={20} className="reg-arrow" />
                        </button>

                        <button
                            className="reg-type-btn dept-btn"
                            onClick={goToStep2}
                        >
                            <div className="reg-type-icon dept-icon">
                                <Building2 size={36} color="#fff" />
                            </div>
                            <div className="reg-type-info">
                                <span className="reg-type-title">Department Registration</span>
                                <span className="reg-type-desc">Education, Health, Transport, Finance, Revenue</span>
                            </div>
                            <ArrowRight size={20} className="reg-arrow" />
                        </button>
                    </div>
                    <div className="reg-footer-link">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="link-primary">
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Step 2: Choose Department ─────────────────────────────────────────────
    if (step === 2) {
        return (
            <div className="auth-page reg-page">
                <div className="auth-blob-blue" />
                <div className="auth-blob-purple" />
                <div className="reg-step-card wide">
                    <div className="reg-header">
                        <div className="reg-step-badge">Step 2 of 3</div>
                        <h1 className="reg-title">Select Your Department</h1>
                        <p className="reg-subtitle">Choose the department you belong to</p>
                    </div>
                    <div className="dept-grid">
                        {DEPARTMENTS.map((dept) => {
                            const Icon = dept.icon;
                            return (
                                <button
                                    key={dept.id}
                                    className="dept-card-btn"
                                    style={{ '--dept-color': dept.color, '--dept-grad': dept.gradient }}
                                    onClick={() => goToStep3(dept.id)}
                                >
                                    <div className="dept-card-icon">
                                        <Icon size={32} color={dept.color} />
                                    </div>
                                    <span className="dept-card-label">{dept.label}</span>
                                    <span className="dept-card-sub">{dept.roles.length} roles</span>
                                    <ChevronRight size={16} className="dept-arrow" />
                                </button>
                            );
                        })}
                    </div>
                    {/* ← Browser-back-aware back button */}
                    <div className="reg-footer-link">
                        <button className="reg-back-btn" onClick={goBack}>
                            <ChevronLeft size={16} /> Back to previous step
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Step 3: Department-specific Registration Form ─────────────────────────
    return (
        <div className="auth-page reg-page">
            <div className="auth-blob-blue" />
            <div className="auth-blob-purple" />
            <div className="reg-step-card wide">
                {/* Dept Banner */}
                {selectedDeptConfig && (
                    <div className="dept-banner" style={{ background: selectedDeptConfig.gradient }}>
                        {React.createElement(selectedDeptConfig.icon, { size: 24, color: '#fff' })}
                        <span>{selectedDeptConfig.label} Department</span>
                    </div>
                )}

                <div className="reg-header">
                    <div className="reg-step-badge">Step 3 of 3</div>
                    <h1 className="reg-title">
                        <UserPlus size={22} color="#2563eb" style={{ marginRight: '0.4rem' }} />
                        Create Department Account
                    </h1>
                    <p className="reg-subtitle">Fill in your details to get started</p>
                </div>

                <div className="auth-content" style={{ padding: '1rem 2rem 2rem' }}>
                    {error && <div className="error-box">{error}</div>}
                    {success && (
                        <div className="success-box">
                            <Check size={16} /> {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        {/* Username & Email */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label">Username</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        name="username"
                                        placeholder="e.g. ceo_education"
                                        className="input-field"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="name@gov.in"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password & Confirm */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        name="password"
                                        type="password"
                                        className="input-field"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        className="input-field"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="form-group">
                            <label className="label">
                                Your Role in {selectedDeptConfig?.label} Department
                            </label>
                            <div className="role-grid">
                                {selectedDeptConfig?.roles.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        className={`role-card ${formData.subRole === r.value ? 'selected' : ''}`}
                                        style={formData.subRole === r.value
                                            ? { '--rc': selectedDeptConfig.color }
                                            : {}
                                        }
                                        onClick={() => setFormData({ ...formData, subRole: r.value })}
                                    >
                                        <span className="role-label">{r.label}</span>
                                        <span className="role-desc">{r.description}</span>
                                        {formData.subRole === r.value && (
                                            <Check size={14} className="role-check" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading
                                ? <Loader2 className="animate-spin" size={20} />
                                : 'Complete Registration'
                            }
                        </button>
                    </form>

                    {/* ← Browser-back-aware back button */}
                    <div className="reg-footer-link" style={{ marginTop: '1rem' }}>
                        <button className="reg-back-btn" onClick={goBack}>
                            <ChevronLeft size={16} /> Change Department
                        </button>
                        &nbsp;&nbsp;
                        <button onClick={() => navigate('/login')} className="link-primary">
                            Already registered? Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
