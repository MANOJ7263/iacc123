import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Users,
    Settings, LogOut, Bell, Search,
    Stethoscope, Clock, Calendar, CheckCircle2,
    MessageSquare, Video, FileText, ChevronRight,
    TrendingUp, Plus, Clipboard, UserPlus,
    Mic, Sliders, Smartphone, MoreVertical
} from 'lucide-react';
import { useHealthStore } from '../../data/healthStore';
import { MemberTasksPanel } from '../../components/health/HealthTaskPanels';
import './HealthDashboard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { patients, activity } = useHealthStore();
    const [tab, setTab] = useState('hub');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Work on actual patient data
    const myPatients = patients.slice(0, 12); // Mock: This doctor handles first 12 patients

    const filteredPatients = myPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const appointments = [
        { time: '09:00 AM', patient: 'Arun Kumar', type: 'Follow-up', status: 'Completed' },
        { time: '10:30 AM', patient: 'Deepa Raj', type: 'Consultation', status: 'In-Progress' },
        { time: '12:00 PM', patient: 'Hari Mani', type: 'Emergency', status: 'Waiting' },
        { time: '02:00 PM', patient: 'Priya Dev', type: 'Routine-Check', status: 'Scheduled' },
        { time: '03:30 PM', patient: 'Deva Velan', type: 'Consultation', status: 'Scheduled' },
    ];

    const renderContent = () => {
        switch (tab) {
            case 'hub':
                return (
                    <div className="hub-grid">
                        <div className="hub-main-card">
                            <div className="hub-hero">
                                <div className="hub-hero-text">
                                    <h2>Good Morning, {user?.username?.split('_')[0] || 'Doctor'}</h2>
                                    <p>You have 8 patients scheduled for today, including 2 critical follow-ups.</p>
                                    <button className="hub-action-main">
                                        <Plus size={18} /> Start New Consultation
                                    </button>
                                </div>
                                <div className="hub-hero-icon">
                                    <Stethoscope size={64} color="rgba(255,255,255,0.2)" />
                                </div>
                            </div>

                            <div className="hub-sections">
                                <div className="hub-section">
                                    <h3 className="section-title">Critical Attention</h3>
                                    <div className="patient-cards">
                                        {myPatients.filter(p => p.status === 'Critical').slice(0, 2).map(p => (
                                            <div key={p.id} className="p-mini-card">
                                                <div className="p-mini-head">
                                                    <span className="p-id">{p.id}</span>
                                                    <span className="p-tag-crit">Critical</span>
                                                </div>
                                                <h4 className="p-name">{p.name}</h4>
                                                <p className="p-info">O2: {p.vitals.oxygen} · {p.symptoms}</p>
                                                <button className="p-action-link">View Charts <ChevronRight size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hub-side-cards">
                            <div className="tool-card">
                                <h3 className="section-title">Medical Lab Tools</h3>
                                <div className="tool-grid">
                                    <div className="tool-item"><Mic size={20} /><span>Dictate</span></div>
                                    <div className="tool-item"><Smartphone size={20} /><span>Tele-med</span></div>
                                    <div className="tool-item"><FileText size={20} /><span>E-Rx</span></div>
                                    <div className="tool-item"><Sliders size={20} /><span>Vitals</span></div>
                                </div>
                            </div>

                            <div className="schedule-mini">
                                <h3 className="section-title">Upcoming Tasks</h3>
                                <div className="schedule-list">
                                    {appointments.slice(0, 3).map((item, i) => (
                                        <div key={i} className="sched-item">
                                            <div className="sched-time">{item.time}</div>
                                            <div className="sched-body">
                                                <span className="sched-pat">{item.patient}</span>
                                                <span className="sched-type">{item.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'myTasks':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Assigned Tasks & Directives</h3></div>
                        <div style={{ padding: '1.5rem' }}>
                            <MemberTasksPanel user={user} role="DOCTOR" memberName={user?.username} accentColor="#3b82f6" />
                        </div>
                    </div>
                );
            case 'schedule':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <h3>Daily Appointment Roster</h3>
                            <button className="hosp-action-btn"><Calendar size={14} /> View Calendar</button>
                        </div>
                        <div style={{ padding: '0 1.5rem' }}>
                            {appointments.map((apt, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ width: '4rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{apt.time}</div>
                                        <div style={{ width: '2px', height: '30px', background: '#f1f5f9' }} />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{apt.patient}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{apt.type}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            background: apt.status === 'Completed' ? '#ecfdf5' : apt.status === 'In-Progress' ? '#eff6ff' : '#f8fafc',
                                            color: apt.status === 'Completed' ? '#10b981' : apt.status === 'In-Progress' ? '#3b82f6' : '#94a3b8'
                                        }}>{apt.status.toUpperCase()}</span>
                                        <button className="hosp-action-btn">Start</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'patients':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <h3>Caseload Management</h3>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="Search patients..." className="hosp-action-btn" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {filteredPatients.map(p => (
                                <div key={p.id} style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #f1f5f9', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 800 }}>{p.id}</span>
                                            <h4 style={{ margin: '0.25rem 0', fontSize: '1rem' }}>{p.name}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.age}y, {p.gender} · {p.bloodGroup}</span>
                                        </div>
                                        <div style={{ width: '2.5rem', height: '2.5rem', background: '#f8fafc', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Users size={18} color="#94a3b8" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>O2 Sat</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: parseInt(p.vitals.oxygen) < 94 ? '#ef4444' : '#10b981' }}>{p.vitals.oxygen}</span>
                                        </div>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>BP</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.vitals.bp}</span>
                                        </div>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Temp</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.vitals.temp}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Symptoms: {p.symptoms}</div>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                        <button className="hosp-action-btn" style={{ flex: 1 }}>Clinical Note</button>
                                        <button className="hosp-action-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', flex: 1 }}>Update Vitals</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'consults':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Virtual Consultations (Tele-Medicine)</h3></div>
                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', margin: '1.5rem', borderRadius: '1rem', border: '2px dashed #e2e8f0' }}>
                            <div style={{ width: '4rem', height: '4rem', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                                <Video size={24} color="#3b82f6" />
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem' }}>No active video calls</h4>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto' }}>You are currently marked as **AWAY** for tele-consults. Switch status to receive calls.</p>
                            <button className="hosp-action-btn" style={{ marginTop: '1.5rem', background: '#10b981', color: '#fff', border: 'none' }}>Go Online</button>
                        </div>
                        <div style={{ padding: '0 1.5rem 1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Recent Consults</h4>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Users size={16} /></div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Patient Call #{1034 + i}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Yesterday · 12 mins · Voice Call</div>
                                        </div>
                                    </div>
                                    <button className="hosp-action-btn"><ChevronRight size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="medical-log" style={{ padding: '4rem', textAlign: 'center' }}>
                        <Settings size={48} color="#94a3b8" />
                        <h3 style={{ marginTop: '1.5rem' }}>Doctor Profile Settings</h3>
                        <p style={{ color: '#64748b' }}>Manage your digital signature, consultation availability, and notification preferences.</p>
                        <button className="hosp-action-btn" style={{ marginTop: '1rem' }}>Edit Medical Profile</button>
                    </div>
                );
        }
    };

    return (
        <div className="health-dashboard">
            <aside className="health-sidebar">
                <div className="health-brand">
                    <div className="health-logo"><Stethoscope size={24} color="#fff" /></div>
                    <div className="health-brand-name">Med-Console</div>
                </div>
                <div className="health-role-tag"><Activity size={12} /><span>CERTIFIED PRACTITIONER</span></div>
                <nav className="health-nav">
                    <button className={`health-nav-item ${tab === 'hub' ? 'active' : ''}`} onClick={() => setTab('hub')}><Activity size={18} />Daily Hub</button>
                    <button className={`health-nav-item ${tab === 'myTasks' ? 'active' : ''}`} onClick={() => setTab('myTasks')}><ClipboardList size={18} />My Tasks</button>
                    <button className={`health-nav-item ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}><Calendar size={18} />Schedule</button>
                    <button className={`health-nav-item ${tab === 'patients' ? 'active' : ''}`} onClick={() => setTab('patients')}><Users size={18} />My Patients</button>
                    <button className={`health-nav-item ${tab === 'consults' ? 'active' : ''}`} onClick={() => setTab('consults')}><Video size={18} />Virtual Consults</button>
                    <button className={`health-nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}><Settings size={18} />Settings</button>
                </nav>
                <div className="health-sidebar-footer">
                    <div className="health-user-card">
                        <div className="health-avatar">Dr</div>
                        <div className="health-user-info">
                            <span className="health-username">{user?.username || 'Doctor'}</span>
                            <span className="health-userrole">Medicine Dept.</span>
                        </div>
                    </div>
                    <button className="health-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}><LogOut size={16} /> Logout</button>
                </div>
            </aside>

            <main className="health-main">
                <header className="health-topbar">
                    <div className="health-welcome">
                        <p>Workspace / {tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                        <h1>Med-Connect Portal</h1>
                    </div>
                    <div className="health-top-actions">
                        <div style={{ position: 'relative' }}>
                            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder="Global Search..." className="hosp-action-btn" style={{ paddingLeft: '2.5rem', width: '250px' }} />
                        </div>
                        <button className="health-notification-btn"><Bell size={18} /></button>
                    </div>
                </header>

                <div className="health-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
