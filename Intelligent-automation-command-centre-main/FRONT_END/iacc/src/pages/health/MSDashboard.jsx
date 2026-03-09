import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Users, Building2,
    Settings, LogOut, Bell, Search,
    Stethoscope, Bed, Plus,
    ClipboardCheck, AlertCircle, Clock,
    ChevronRight, ArrowLeft, Package,
    CheckCircle2, AlertTriangle, TrendingUp
} from 'lucide-react';
import { HOSPITALS, DOCTORS, INVENTORY, generatePatients } from '../../data/healthData';
import { useHealthStore } from '../../data/healthStore';
import './HealthDashboard.css';

const StatMini = ({ label, value, icon: Icon, color }) => (
    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={20} />
        </div>
        <div>
            <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{value}</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
        </div>
    </div>
);

const MSDashboard = () => {
    const navigate = useNavigate();
    const { activity, patients, hospitals, inventory, doctors, updateInventory, tasks } = useHealthStore();
    const [tab, setTab] = useState('facility');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Identify Hospital based on MS user mapping
    const myHospital = hospitals.find(h => h.msId === user?.username) || hospitals[0];

    const hospital = HOSPITALS[0]; // Demo hospital: Namakkal GH

    const myDirectives = tasks.filter(t => t.targetType === 'Hospital' && t.targetId === myHospital.name);

    const filteredPatients = patients
        .filter(p => p.hospital === hospital.name)
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const filteredDoctors = doctors
        .filter(d => d.hospital === hospital.name)
        .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.dept.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderContent = () => {
        switch (tab) {
            case 'overview':
                return (
                    <>
                        <div className="health-stats-grid">
                            <StatMini label="Active IP Patients" value={filteredPatients.length} icon={Users} color="#3b82f6" />
                            <StatMini label="Duty Doctors" value={filteredDoctors.length} icon={Stethoscope} color="#10b981" />
                            <StatMini label="Current Occupancy" value={`${Math.round((hospital.occupiedBeds / hospital.beds) * 100)}%`} icon={Bed} color="#ef4444" />
                            <StatMini label="Inventory Status" value="Good" icon={Package} color="#8b5cf6" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="medical-log">
                                <div className="log-header"><h3>Priority Care Cases</h3></div>
                                <div style={{ padding: '0 1.5rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                                <th style={{ padding: '1rem 0' }}>Patient ID</th>
                                                <th>Name / Age</th>
                                                <th>Symptoms</th>
                                                <th>Stability</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.slice(0, 6).map(p => (
                                                <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '0.8rem 0', fontWeight: 600, color: '#3b82f6' }}>{p.id}</td>
                                                    <td>{p.name} <span style={{ color: '#94a3b8' }}>({p.age})</span></td>
                                                    <td>{p.symptoms}</td>
                                                    <td>
                                                        <span style={{
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '99px',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 800,
                                                            background: p.status === 'Critical' ? '#fff1f2' : p.status === 'Stable' ? '#f0fdf4' : '#fefce8',
                                                            color: p.status === 'Critical' ? '#ef4444' : p.status === 'Stable' ? '#10b981' : '#a16207'
                                                        }}>{p.status.toUpperCase()}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="medical-log">
                                <div className="log-header"><h3>Facility Notifications</h3></div>
                                <div className="log-body">
                                    {activity.map((log, i) => (
                                        <div key={i} className="log-item" style={{ borderLeft: `3px solid ${log.type === 'alert' ? '#ef4444' : '#10b981'}`, paddingLeft: '1rem' }}>
                                            <div className="log-info">
                                                <span className="log-msg" style={{ fontSize: '0.85rem' }}>{log.msg}</span>
                                                <span className="log-time" style={{ fontSize: '0.7rem' }}>{log.t}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'doctors':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <h3>On-Duty Staff</h3>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="Search roster..." className="hosp-action-btn" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {filteredDoctors.map(doc => (
                                <div key={doc.id} style={{ border: '1px solid #f1f5f9', borderRadius: '1rem', padding: '1rem', display: 'flex', gap: '1rem', position: 'relative' }}>
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Stethoscope size={24} /></div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem' }}>{doc.name}</h4>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{doc.dept} · {doc.qualification}</span>
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginTop: '0.5rem' }}>● {doc.status}</span>
                                    </div>
                                    <button style={{ position: 'absolute', right: '1rem', top: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><Settings size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'patients':
                return (
                    <div className="medical-log">
                        <div className="log-header" style={{ justifyContent: 'space-between' }}>
                            <h3>Facility Census</h3>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="Record search..." className="hosp-action-btn" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <div style={{ padding: '0 1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 0' }}>Patient</th>
                                        <th>Blood</th>
                                        <th>Admitted</th>
                                        <th>Vitals</th>
                                        <th>Stability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem 0' }}>
                                                <div style={{ fontWeight: 700 }}>{p.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {p.id} · {p.age}y {p.gender}</div>
                                            </td>
                                            <td><span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem' }}>{p.bloodGroup}</span></td>
                                            <td>{p.admittedOn}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <span style={{ fontSize: '0.65rem', background: '#f8fafc', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>BP {p.vitals.bp}</span>
                                                    <span style={{ fontSize: '0.65rem', background: '#f8fafc', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>O2 {p.vitals.oxygen}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '0.3rem 0.6rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    background: p.status === 'Critical' ? '#fff1f2' : '#f0fdf4',
                                                    color: p.status === 'Critical' ? '#ef4444' : '#10b981'
                                                }}>{p.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Facility Inventory & Logistics</h3></div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {inventory.map(item => (
                                <div key={item.id} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9', background: item.status === 'Alert' ? '#fff1f280' : '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.item}</h4>
                                        <Package size={18} color={item.status === 'Alert' ? '#ef4444' : '#94a3b8'} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{item.stock}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Units available</span>
                                    </div>
                                    <div className="hosp-bar-bg" style={{ height: '6px' }}>
                                        <div className="hosp-bar-fill" style={{ width: `${Math.min((item.stock / item.minLevel) * 50, 100)}%`, background: item.status === 'Alert' ? '#ef4444' : '#10b981' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                        <span style={{ color: item.status === 'Alert' ? '#ef4444' : '#64748b' }}>MIN REQ: {item.minLevel}</span>
                                        <span style={{ color: item.status === 'Alert' ? '#ef4444' : '#10b981' }}>{item.status.toUpperCase()}</span>
                                    </div>
                                    <button className="hosp-action-btn" style={{ width: '100%', marginTop: '1.25rem' }}>Request Restock</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'directives':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>CMO Directives & Priority Cases</h3></div>
                        <div style={{ padding: '1.5rem' }}>
                            {myDirectives.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No active directives from the CMO.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myDirectives.map(d => (
                                        <div key={d.id} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9', borderLeft: `5px solid ${d.priority === 'Critical' ? '#ef4444' : '#3b82f6'}`, background: '#fff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0 }}>{d.title}</h4>
                                                <span className={`log-type-tag ${d.priority === 'Critical' ? 'alert' : 'info'}`}>{d.priority}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 1.25rem' }}>{d.desc}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                                                    <Clock size={12} /> Issued: {d.createdAt}
                                                </div>
                                                <button className="hosp-action-btn" style={{ background: '#10b981', color: '#fff', border: 'none' }}>Acknowledge Directive</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="medical-log" style={{ padding: '4rem', textAlign: 'center' }}>
                        <Settings size={48} color="#94a3b8" />
                        <h3 style={{ marginTop: '1.5rem' }}>Facility Logistics & ERP</h3>
                        <p style={{ color: '#64748b' }}>Settings for administrative credentials, automated reporting schedule, and API keys for State Health Data integration.</p>
                        <button className="hosp-action-btn" style={{ marginTop: '1rem' }}>Enter Audit Mode</button>
                    </div>
                );
        }
    };

    return (
        <div className="health-dashboard">
            <aside className="health-sidebar">
                <div className="health-brand">
                    <div className="health-logo"><Heart size={24} color="#fff" /></div>
                    <div className="health-brand-name">Health Dept.</div>
                </div>
                <div className="health-role-tag"><ClipboardCheck size={14} /><span>MEDICAL SUPERINTENDENT</span></div>
                <nav className="health-nav">
                    <button className={`health-nav-item ${tab === 'overview' ? 'active' : ''}`} onClick={() => { setTab('overview'); setSearchTerm(''); }}><Activity size={18} />Overview</button>
                    <button className={`health-nav-item ${tab === 'directives' ? 'active' : ''}`} onClick={() => { setTab('directives'); setSearchTerm(''); }}><ClipboardCheck size={18} />Directives</button>
                    <button className={`health-nav-item ${tab === 'doctors' ? 'active' : ''}`} onClick={() => { setTab('doctors'); setSearchTerm(''); }}><Stethoscope size={18} />Doctors</button>
                    <button className={`health-nav-item ${tab === 'patients' ? 'active' : ''}`} onClick={() => { setTab('patients'); setSearchTerm(''); }}><Users size={18} />Patients</button>
                    <button className={`health-nav-item ${tab === 'inventory' ? 'active' : ''}`} onClick={() => { setTab('inventory'); setSearchTerm(''); }}><Package size={18} />Inventory</button>
                    <button className={`health-nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => { setTab('settings'); setSearchTerm(''); }}><Settings size={18} />Facility Settings</button>
                </nav>
                <div className="health-sidebar-footer">
                    <div className="health-user-card">
                        <div className="health-avatar">MS</div>
                        <div className="health-user-info">
                            <span className="health-username">{user?.username || 'MS_User'}</span>
                            <span className="health-userrole">Head of Facility</span>
                        </div>
                    </div>
                    <button className="health-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}><LogOut size={16} /> Logout</button>
                </div>
            </aside>

            <main className="health-main">
                <header className="health-topbar">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                            <span>Health Dept</span> <ChevronRight size={10} /> <span>Facility Command</span>
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{hospital.name}</h1>
                    </div>
                    <div className="health-top-actions">
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

export default MSDashboard;
