import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Users, Building2,
    Settings, LogOut, Bell, Search,
    Stethoscope, Bed, Plus, ClipboardList, Trash2,
    ClipboardCheck, AlertCircle, Clock,
    ChevronRight, ArrowUpRight, TrendingUp, BarChart3,
    ShieldAlert, PieChart, Shield, Target
} from 'lucide-react';
import { HEALTH_ZONES, HOSPITALS, DOCTORS } from '../../data/healthData';
import { useHealthStore } from '../../data/healthStore';
import './HealthDashboard.css';

const DHOStatCard = ({ label, value, trend, icon: Icon, color }) => (
    <div className="health-stat-card">
        <div className="health-stat-info">
            <h3>{label}</h3>
            <span className="health-stat-value">{value}</span>
            <div className="health-stat-trend up">
                <ArrowUpRight size={14} /> {trend}
            </div>
        </div>
        <div className="health-stat-icon-wrap" style={{ background: `${color}15`, color: color }}>
            <Icon size={24} />
        </div>
    </div>
);

const DHODashboard = () => {
    const navigate = useNavigate();
    const { activity, patients, dhos, tasks, assignTask, deleteTask } = useHealthStore();
    const [tab, setTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Medium', targetType: 'Hospital', targetIds: [] });

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    // Identify Zone based on DHO user mapping
    const myDhoData = dhos.find(d => d.username === user?.username) || dhos[0];
    const myZone = HEALTH_ZONES.find(z => z.name === myDhoData?.zone) || HEALTH_ZONES[0];

    // Filter hospitals in this zone (Mock logic: first 2 hospitals belong to Zone A)
    const myHospitals = HOSPITALS.filter((h, idx) => idx < 2);

    const myDirectives = tasks.filter(t => t.targetType === 'DHO' && t.targetId === myDhoData.username);

    const handleAcknowledgeAndStart = (directive) => {
        setNewTask({
            ...newTask,
            title: `[Fwd] ${directive.title}`,
            desc: directive.desc,
            priority: directive.priority,
            targetIds: []
        });
        setTab('assignments');
    };

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
        switch (tab) {
            case 'overview':
                const latestDirective = myDirectives[0];
                return (
                    <>
                        {latestDirective && (
                            <div style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                padding: '1.25rem',
                                borderRadius: '1.25rem',
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: latestDirective.priority === 'Critical' ? '#ef4444' : '#3b82f6'
                                }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <ShieldAlert size={16} color={latestDirective.priority === 'Critical' ? '#ef4444' : '#3b82f6'} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest CMO Directive</span>
                                        </div>
                                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{latestDirective.title}</h3>
                                        <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{latestDirective.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setTab('directives')}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="health-stats-grid">
                            <DHOStatCard label="Zone Hospitals" value={myZone.hospitals} trend="All Operational" icon={Building2} color="#3b82f6" />
                            <DHOStatCard label="Total Zone Beds" value={myZone.beds} trend="82% Occupancy" icon={Bed} color="#ef4444" />
                            <DHOStatCard label="Zone Doctors" value={myZone.doctors} trend="+4 active" icon={Stethoscope} color="#10b981" />
                            <DHOStatCard label="Active Alerts" value="2" trend="Pending review" icon={AlertCircle} color="#f59e0b" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="medical-log">
                                <div className="log-header"><h3>Zone Facility Performance</h3></div>
                                <div style={{ padding: '1.5rem' }}>
                                    {myHospitals.map(h => (
                                        <div key={h.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{h.name}</h4>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{h.performance}% Efficiency</span>
                                            </div>
                                            <div className="hosp-bar-bg" style={{ height: '6px' }}>
                                                <div className="hosp-bar-fill" style={{ width: `${h.performance}%`, background: '#3b82f6' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="medical-log">
                                <div className="log-header"><h3>Zone Notifications</h3></div>
                                <div className="log-body">
                                    {activity.slice(0, 5).map((log, i) => (
                                        <div key={i} className="log-item">
                                            <div className="log-info">
                                                <span className="log-msg" style={{ fontSize: '0.8rem' }}>{log.msg}</span>
                                                <span className="log-time">{log.t}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'facilities':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Zone Healthcare Facilities</h3></div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {myHospitals.map(h => (
                                <div key={h.id} style={{ padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                                    <h4 style={{ margin: '0 0 0.25rem' }}>{h.name}</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.type}</span>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800 }}>{h.beds}</span>
                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Beds</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800 }}>{h.doctors}</span>
                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Doctors</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800 }}>{h.performance}%</span>
                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Score</span>
                                        </div>
                                    </div>
                                    <button className="hosp-action-btn" style={{ width: '100%', marginTop: '1rem' }}>Audit Facility</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'directives':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>Directives from CMO Office</h3></div>
                        <div style={{ padding: '1.5rem' }}>
                            {myDirectives.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No active directives for your zone.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myDirectives.map(d => (
                                        <div key={d.id} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9', borderLeft: `4px solid ${d.priority === 'Critical' ? '#ef4444' : '#3b82f6'}`, background: '#fff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0 }}>{d.title}</h4>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: d.priority === 'Critical' ? '#ef4444' : '#64748b' }}>{d.priority.toUpperCase()}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>{d.desc}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Issued on {d.createdAt}</span>
                                                <button onClick={() => handleAcknowledgeAndStart(d)} className="hosp-action-btn" style={{ background: '#10b981', color: '#fff', border: 'none' }}>Acknowledge & Start</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'assignments':
                // Filter only tasks assigned BY this DHO (we assume they assign to 'Hospital' targetType)
                // For a robust implementation, tasks should have an 'authorId', but we will show tasks targeted at this DHO's hospitals for now.
                const zoneTasks = tasks.filter(t => t.targetType === 'Hospital' && myHospitals.some(h => h.name === t.targetId));

                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                        <div className="medical-log">
                            <div className="log-header"><h3>Assign Directive to Hospital</h3></div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }} value={newTask.targetType} disabled>
                                        <option value="Hospital">Specific Hospital</option>
                                    </select>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem', background: '#f8fafc' }}>
                                        {myHospitals.map(h => (
                                            <label key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                <input type="checkbox" checked={(newTask.targetIds || []).includes(h.name)} onChange={() => handleTargetSelection(h.name)} />
                                                {h.name}
                                            </label>
                                        ))}
                                        {myHospitals.length === 0 && <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>No Hospitals available.</div>}
                                    </div>
                                </div>
                                <input type="text" placeholder="Directive Title" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }} value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                                <textarea placeholder="Describe the task or case details..." style={{ width: '100%', height: '120px', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }} value={newTask.desc} onChange={e => setNewTask({ ...newTask, desc: e.target.value })} />
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                        <button key={p} onClick={() => setNewTask({ ...newTask, priority: p })} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: newTask.priority === p ? '#f1f5f9' : '#fff', fontWeight: 700, fontSize: '0.7rem' }}>{p}</button>
                                    ))}
                                </div>
                                <button className="hosp-action-btn" style={{ width: '100%', background: 'var(--health-red)', color: '#fff', border: 'none', height: '3rem' }} onClick={() => {
                                    if (newTask.title && newTask.targetIds && newTask.targetIds.length > 0) {
                                        newTask.targetIds.forEach(id => {
                                            assignTask({ ...newTask, targetId: id });
                                        });
                                        setNewTask({ title: '', desc: '', priority: 'Medium', targetType: 'Hospital', targetIds: [] });
                                    }
                                }}>Issue Directive(s)</button>
                            </div>
                        </div>

                        <div className="medical-log">
                            <div className="log-header"><h3>Zone Hospital Directives</h3></div>
                            <div style={{ padding: '0 1.5rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ padding: '1rem 0' }}>Title</th>
                                            <th>Target (Hospital)</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {zoneTasks.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No active directives issued to zone hospitals.</td></tr>
                                        ) : zoneTasks.map(t => (
                                            <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '1rem 0' }}>
                                                    <div style={{ fontWeight: 700 }}>{t.title}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t.createdAt}</div>
                                                </td>
                                                <td><span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t.targetId}</span></td>
                                                <td><span style={{ fontSize: '0.65rem', fontWeight: 800, color: t.priority === 'Critical' ? '#ef4444' : '#64748b' }}>{t.priority}</span></td>
                                                <td><span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6' }}>{t.status}</span></td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteTask(t.id)}
                                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        title="Delete Directive"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                        <div className="medical-log">
                            <div className="log-header">
                                <h3>Zone Disease Analytics</h3>
                                <div style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: 700 }}>LAST 30 DAYS</div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                {[
                                    { disease: 'Dengue Fever', cases: 142, trend: '+12%', critical: true },
                                    { disease: 'Typhoid', cases: 85, trend: '-5%', critical: false },
                                    { disease: 'Viral Pneumonia', cases: 210, trend: '+8%', critical: true },
                                    { disease: 'Malaria', cases: 45, trend: '-15%', critical: false },
                                ].map((d, i) => (
                                    <div key={i} style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {d.critical && <AlertCircle size={14} color="#ef4444" />}
                                                {d.disease}
                                            </span>
                                            <span style={{ color: '#64748b' }}><span style={{ color: '#0f172a', fontWeight: 800 }}>{d.cases} Cases</span> ({d.trend})</span>
                                        </div>
                                        <div className="hosp-bar-bg" style={{ height: '8px' }}>
                                            <div className="hosp-bar-fill" style={{ width: `${Math.min(100, (d.cases / 250) * 100)}%`, background: d.critical ? '#ef4444' : '#3b82f6' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="medical-log">
                            <div className="log-header"><h3>Resource Allocation</h3></div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem' }}><Bed size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ICU BED OCCUPANCY</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>88% <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Critical</span></div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: '#ecfdf5', color: '#10b981', borderRadius: '0.5rem' }}><Activity size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OXYGEN SUPPLY LEVEL</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Adequate <span style={{ fontSize: '0.7rem', color: '#10b981' }}>9 days left</span></div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '0.5rem' }}><Stethoscope size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>STAFF AVAILABILITY</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>92% <span style={{ fontSize: '0.7rem', color: '#3b82f6' }}>Optimal</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="medical-log" style={{ marginBottom: '1.5rem' }}>
                            <div className="log-header"><h3>Profile Configuration</h3></div>
                            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input type="text" value={user?.name || 'Dr. DHO'} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input type="email" value={user?.username || 'admin@health.tn.gov'} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Assigned Zone</label>
                                    <input type="text" value={myZone.name} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Contact Number</label>
                                    <input type="text" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} />
                                </div>
                            </div>
                        </div>
                        <div className="medical-log">
                            <div className="log-header"><h3>Notification Preferences</h3></div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { title: 'Emergency Outbreak Alerts', desc: 'Receive immediate SMS and email for disease outbreaks in your zone.', active: true },
                                    { title: 'Weekly Performance Digest', desc: 'A summary of hospital performance and compliance scores.', active: false },
                                    { title: 'Critical Shortage Warnings', desc: 'Alerts when hospitals run low on O2, blood, or ICU beds.', active: true }
                                ].map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: i === 2 ? 'none' : '1px solid #f1f5f9' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.desc}</div>
                                        </div>
                                        <div style={{ width: '40px', height: '20px', background: p.active ? '#10b981' : '#cbd5e1', borderRadius: '99px', position: 'relative', cursor: 'pointer' }}>
                                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: p.active ? '22px' : '2px', transition: 'left 0.2s' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
        }
    };

    return (
        <div className="health-dashboard">
            <aside className="health-sidebar">
                <div className="health-brand">
                    <div className="health-logo"><Heart size={24} color="#fff" /></div>
                    <div className="health-brand-name">DHO Portal</div>
                </div>
                <div className="health-role-tag"><Activity size={14} /><span>DISTRICT HEALTH OFFICER</span></div>
                <nav className="health-nav">
                    <button className={`health-nav-item ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}><Activity size={18} />Zone Stats</button>
                    <button className={`health-nav-item ${tab === 'directives' ? 'active' : ''}`} onClick={() => setTab('directives')}><ClipboardCheck size={18} />CMO Directives</button>
                    <button className={`health-nav-item ${tab === 'assignments' ? 'active' : ''}`} onClick={() => setTab('assignments')}><ClipboardList size={18} />Assignment Hub</button>
                    <button className={`health-nav-item ${tab === 'facilities' ? 'active' : ''}`} onClick={() => setTab('facilities')}><Building2 size={18} />Zone Facilities</button>
                    <button className={`health-nav-item ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}><TrendingUp size={18} />Analytics</button>
                    <button className={`health-nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}><Settings size={18} />Settings</button>
                </nav>
                <div className="health-sidebar-footer">
                    <div className="health-user-card">
                        <div className="health-avatar">DHO</div>
                        <div className="health-user-info">
                            <span className="health-username">{user?.username || 'DHO_User'}</span>
                            <span className="health-userrole">{myZone.name}</span>
                        </div>
                    </div>
                    <button className="health-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}><LogOut size={16} /> Logout</button>
                </div>
            </aside>
            <main className="health-main">
                <header className="health-topbar">
                    <div className="health-welcome">
                        <p>Sub-District Health Administration</p>
                        <h1>{myZone.name} Dashboard</h1>
                    </div>
                    <div className="health-top-actions"><button className="health-notification-btn"><Bell size={18} /></button></div>
                </header>
                <div className="health-content">{renderContent()}</div>
            </main>
        </div>
    );
};

export default DHODashboard;
