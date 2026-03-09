import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Thermometer, ShieldAlert, Users, Building2,
    BarChart3, Settings, LogOut, Bell, Search, Filter, Plus,
    ArrowUpRight, ArrowDownRight, ClipboardList, Syringe,
    Stethoscope, Bed, MoreHorizontal, CheckCircle2, AlertTriangle, Trash2
} from 'lucide-react';
import { HEALTH_DISTRICT, HEALTH_ZONES, HOSPITALS, DOCTORS, ANALYTICS, DHOS } from '../../data/healthData';
import { useHealthStore } from '../../data/healthStore';
import { TaskAssignPanel, TaskStatusPanel } from '../../components/health/HealthTaskPanels';
import './HealthDashboard.css';

const StatCard = ({ label, value, trend, icon: Icon, color, isUp }) => (
    <div className="health-stat-card">
        <div className="health-stat-info">
            <h3>{label}</h3>
            <span className="health-stat-value">{value}</span>
            <div className={`health-stat-trend ${isUp ? 'up' : 'down'}`}>
                {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trend}
            </div>
        </div>
        <div className="health-stat-icon-wrap" style={{ background: `${color}15`, color: color }}>
            <Icon size={24} />
        </div>
    </div>
);

const HospitalCard = ({ hospital }) => (
    <div className="hosp-card">
        <div className="hosp-header">
            <div className="hosp-title">
                <h4>{hospital.name}</h4>
                <span className="hosp-type">{hospital.type}</span>
            </div>
            <span className={`hosp-badge ${hospital.status.toLowerCase()}`}>
                {hospital.status}
            </span>
        </div>
        <div className="hosp-body">
            <div className="hosp-stats">
                <div className="hosp-stat-item">
                    <span className="hosp-stat-label">Doctors</span>
                    <span className="hosp-stat-val">{hospital.doctors}</span>
                </div>
                <div className="hosp-stat-item">
                    <span className="hosp-stat-label">Beds</span>
                    <span className="hosp-stat-val">{hospital.beds}</span>
                </div>
            </div>
            <div className="hosp-progress-wrap">
                <div className="hosp-progress-header">
                    <span className="hosp-progress-label">Efficiency Rate</span>
                    <span className="hosp-progress-percent">{hospital.performance}%</span>
                </div>
                <div className="hosp-bar-bg">
                    <div
                        className="hosp-bar-fill"
                        style={{
                            width: `${hospital.performance}%`,
                            background: hospital.performance > 90 ? '#10b981' : hospital.performance > 80 ? '#f59e0b' : '#ef4444'
                        }}
                    />
                </div>
            </div>
        </div>
        <div className="hosp-footer">
            <div className="hosp-warden">
                <Stethoscope size={14} /> ID: {hospital.directorId}
            </div>
            <button className="hosp-action-btn">View Inventory</button>
        </div>
    </div>
);

const CMHODashboard = () => {
    const navigate = useNavigate();
    const { activity, patients, doctors, analytics, tasks, assignTask, deleteTask, hospitals } = useHealthStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Medium', targetType: 'DHO', targetIds: [] });

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const navItems = [
        { id: 'overview', label: 'District Core', icon: Activity },
        { id: 'hospitals', label: 'Medical Facilities', icon: Building2 },
        { id: 'vacancies', label: 'Hospital Vacancies', icon: Bed },
        { id: 'taskAssign', label: 'Assign Directives', icon: ClipboardList },
        { id: 'taskStatus', label: 'Directive Status', icon: Activity },
        { id: 'doctors', label: 'Doctor Roster', icon: Stethoscope },
        { id: 'patients', label: 'Patient Census', icon: Users },
        { id: 'analytics', label: 'Health Analytics', icon: BarChart3 },
    ];

    const filteredDoctors = (doctors || []).filter(doc =>
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.dept?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTargetSelection = (id) => {
        setNewTask(prev => {
            const currentIds = prev.targetIds || [];
            return {
                ...prev,
                targetIds: currentIds.includes(id) ? currentIds.filter(t => t !== id) : [...currentIds, id]
            }
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <div className="health-stats-grid">
                            <StatCard label="Total Hospitals" value={HEALTH_DISTRICT.totalHospitals} trend="2 pending audit" icon={Building2} color="#3b82f6" isUp={true} />
                            <StatCard label="Doctor Census" value={HEALTH_DISTRICT.totalDoctors} trend="+12 this month" icon={Stethoscope} color="#10b981" isUp={true} />
                            <StatCard label="Active Bed Capacity" value={HEALTH_DISTRICT.totalBeds} trend="84% occupancy" icon={Bed} color="#0ea5e9" isUp={false} />
                            <StatCard label="Vaccination Coverage" value={HEALTH_DISTRICT.vaccinationRate} trend="Global target met" icon={Syringe} color="#8b5cf6" isUp={true} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                            <div className="medical-log">
                                <div className="log-header">
                                    <ClipboardList size={20} color="#64748b" />
                                    <h3>Emergency Response & Activity Log</h3>
                                </div>
                                <div className="log-body">
                                    {activity.map((log, i) => (
                                        <div key={i} className="log-item">
                                            <div className="log-indicator" style={{ background: log.type === 'alert' ? '#fee2e2' : log.type === 'success' ? '#dcfce7' : '#e0f2fe' }}>
                                                {log.type === 'alert' ? <ShieldAlert size={16} color="#ef4444" /> : log.type === 'success' ? <Heart size={16} color="#10b981" /> : <Activity size={16} color="#0ea5e9" />}
                                            </div>
                                            <div className="log-info">
                                                <span className="log-msg">
                                                    {log.msg}
                                                    <span className={`log-type-tag ${log.type}`}>{log.type}</span>
                                                </span>
                                                <span className="log-time">{log.t}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="health-stat-card" style={{ flexDirection: 'column', height: 'fit-content' }}>
                                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem', width: '100%' }}>
                                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Zone-wise Criticality</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                                    {HEALTH_ZONES.map(zone => (
                                        <div key={zone.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{zone.name}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{zone.hospitals} Facilities</span>
                                            </div>
                                            <div className="hosp-bar-bg" style={{ height: '6px' }}>
                                                <div className="hosp-bar-fill" style={{ width: `${(zone.beds / 1000) * 100}%`, background: '#ef4444' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'hospitals':
                return (
                    <div className="hosp-grid">
                        {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
                    </div>
                );
            case 'vacancies':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Real-time Hospital Bed Vacancies</h3></div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {hospitals.map(h => (
                                <div key={h.id} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9', background: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0 }}>{h.name}</h4>
                                        <Bed size={18} color="#94a3b8" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>VACANT</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{h.beds - h.occupiedBeds}</span>
                                        </div>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>TOTAL</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{h.beds}</span>
                                        </div>
                                    </div>
                                    <div className="hosp-bar-bg" style={{ height: '8px' }}>
                                        <div className="hosp-bar-fill" style={{ width: `${(h.occupiedBeds / h.beds) * 100}%`, background: (h.occupiedBeds / h.beds) > 0.9 ? '#ef4444' : '#3b82f6' }} />
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>Occupancy: {Math.round((h.occupiedBeds / h.beds) * 100)}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'taskAssign':
                return (
                    <div style={{ marginTop: '1rem' }}>
                        <TaskAssignPanel user={user} role="CMO" department="HEALTH" accentColor="#10b981" />
                    </div>
                );
            case 'taskStatus':
                return (
                    <div style={{ marginTop: '1rem' }}>
                        <TaskStatusPanel user={user} role="CMO" department="HEALTH" accentColor="#10b981" />
                    </div>
                );
            case 'doctors':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Stethoscope size={20} color="#64748b" />
                                <h3>District Doctor Roster</h3>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Filter by name, dept, hospital..."
                                    className="hosp-action-btn"
                                    style={{ paddingLeft: '2.5rem', width: '250px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '0 1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 0' }}>Doctor Name</th>
                                        <th>Department</th>
                                        <th>Facility</th>
                                        <th>Experience</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDoctors.map(doc => (
                                        <tr key={doc.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '0.8rem 0', fontWeight: 700 }}>{doc.name} <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>{doc.qualification}</span></td>
                                            <td>{doc.dept}</td>
                                            <td>{doc.hospital}</td>
                                            <td>{doc.experience} Years</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    background: doc.status === 'Available' ? '#ecfdf5' : doc.status === 'On-Duty' ? '#eff6ff' : '#fef2f2',
                                                    color: doc.status === 'Available' ? '#10b981' : doc.status === 'On-Duty' ? '#3b82f6' : '#ef4444'
                                                }}>
                                                    {doc.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'patients':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Users size={20} color="#64748b" />
                                <h3>District Patient Census</h3>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search patient ID or name..."
                                    className="hosp-action-btn"
                                    style={{ paddingLeft: '2.5rem', width: '250px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '0 1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 0' }}>Patient ID</th>
                                        <th>Name</th>
                                        <th>Facility</th>
                                        <th>Vitals</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '0.8rem 0', fontWeight: 600, color: '#3b82f6' }}>{p.id}</td>
                                            <td>{p.name} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({p.age}, {p.gender})</span></td>
                                            <td>{p.hospital}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <span title="Oxygen Saturation" style={{ fontSize: '0.65rem', background: parseInt(p.vitals.oxygen) < 94 ? '#fff1f2' : '#f0fdf4', color: parseInt(p.vitals.oxygen) < 94 ? '#ef4444' : '#10b981', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 700 }}>O2: {p.vitals.oxygen}</span>
                                                    <span title="Blood Pressure" style={{ fontSize: '0.65rem', background: '#f8fafc', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>BP: {p.vitals.bp}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    background: p.status === 'Critical' ? '#fff1f2' : p.status === 'Stable' ? '#f0fdf4' : '#fefce8',
                                                    color: p.status === 'Critical' ? '#ef4444' : p.status === 'Stable' ? '#10b981' : '#a16207'
                                                }}>
                                                    {p.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="medical-log">
                            <div className="log-header"><h3>Monthly Admissions Trend</h3></div>
                            <div style={{ padding: '2rem', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '250px', justifyContent: 'center' }}>
                                {analytics.monthlyAdmissions.map((val, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                        <div style={{ width: '100%', background: 'linear-gradient(to top, #ef4444, #f87171)', borderRadius: '6px 6px 0 0', height: `${(val / 2000) * 200}px`, transition: 'height 1s' }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>M{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="medical-log">
                            <div className="log-header"><h3>Disease Prevalence</h3></div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {analytics.commonDiseases.map((d, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: 600 }}>{d.name}</span>
                                            <span style={{ color: '#64748b' }}>{d.cases} active</span>
                                        </div>
                                        <div className="hosp-bar-bg" style={{ height: '8px' }}>
                                            <div className="hosp-bar-fill" style={{ width: `${(d.cases / 5000) * 100}%`, background: '#8b5cf6' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="medical-log" style={{ gridColumn: 'span 2' }}>
                            <div className="log-header"><h3>Vaccination Progress (District)</h3></div>
                            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                {Object.entries(analytics.vaccinationProgress).map(([key, val]) => (
                                    <div key={key} style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                                            <svg width="100" height="100" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={`${(val / 100) * 283} 283`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                                            </svg>
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>{val}%</div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="medical-log" style={{ padding: '4rem', textAlign: 'center' }}>
                        <Settings size={48} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                        <h3>Configure District Preferences</h3>
                        <p style={{ color: '#64748b' }}>System settings for alert thresholds, facility access, and data synchronization.</p>
                        <button className="hosp-action-btn" style={{ marginTop: '1rem' }}>Update Global Config</button>
                    </div>
                );
        }
    };

    return (
        <div className="health-dashboard">
            <aside className="health-sidebar">
                <div className="health-brand">
                    <div className="health-logo">
                        <Heart size={24} color="#fff" />
                    </div>
                    <div className="health-brand-text">
                        <div className="health-brand-name">Health Dept.</div>
                        <div className="health-brand-sys">IACC DISTRICT</div>
                    </div>
                </div>

                <div className="health-role-tag">
                    <ShieldAlert size={14} />
                    <span>CHIEF MEDICAL OFFICER</span>
                </div>

                <nav className="health-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`health-nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => { setActiveTab(item.id); setSearchTerm(''); }}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="health-sidebar-footer">
                    <div className="health-user-card">
                        <div className="health-avatar">
                            {user?.username?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="health-user-info">
                            <span className="health-username">{user?.username || 'CMO_User'}</span>
                            <span className="health-userrole">District Administrator</span>
                        </div>
                    </div>
                    <button className="health-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="health-main">
                <header className="health-topbar">
                    <div className="health-welcome">
                        <p>Namakkal District Health Portal</p>
                        <h1>{navItems.find(n => n.id === activeTab)?.label}</h1>
                    </div>
                    <div className="health-top-actions">
                        <button className="health-notification-btn">
                            <Bell size={18} />
                            <div className="health-notif-dot" />
                        </button>
                    </div>
                </header>

                <div className="health-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default CMHODashboard;
