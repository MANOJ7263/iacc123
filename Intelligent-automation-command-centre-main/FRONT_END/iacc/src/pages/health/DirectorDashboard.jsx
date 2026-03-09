import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Heart, Users, Building2,
    Settings, LogOut, Bell, Search,
    Plus, ClipboardCheck, ClipboardList, AlertCircle, Clock,
    Layout, Briefcase, Shovel, ShieldCheck,
    Thermometer, Package, ChevronRight, CheckCircle2,
    ShieldAlert, Bed
} from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, AreaChart, Area } from 'recharts';
import { HOSPITALS, DOCTORS } from '../../data/healthData';
import { useHealthStore } from '../../data/healthStore';
import { TaskAssignPanel, TaskStatusPanel, MemberTasksPanel } from '../../components/health/HealthTaskPanels';
import './HealthDashboard.css';

const DirectorDashboard = () => {
    const navigate = useNavigate();
    const { activity, tasks } = useHealthStore();
    const [tab, setTab] = useState('overview');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const myHospital = HOSPITALS.find(h => h.directorId === user?.username) || HOSPITALS[0];
    const myDoctors = DOCTORS.filter(d => d.hospital === myHospital.name);
    const myDirectives = tasks.filter(t => t.targetType === 'Hospital' && t.targetId === myHospital.name);

    const facilityStats = [
        { label: 'Today OP Count', value: '342', icon: Activity, color: '#f59e0b' },
        { label: 'Sanitation Score', value: '98%', icon: ShieldCheck, color: '#10b981' },
        { label: 'Kitchen Status', value: 'Active', icon: Heart, color: '#ef4444' },
        { label: 'Staff on Deck', value: '24', icon: Users, color: '#8b5cf6' },
    ];

    const renderContent = () => {
        switch (tab) {
            case 'overview': {
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
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Assigned Directive</span>
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
                                        View All Directives
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="health-stats-grid">
                            {facilityStats.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <div key={i} className="health-stat-card">
                                        <div className="health-stat-info">
                                            <h3>{s.label}</h3>
                                            <span className="health-stat-value">{s.value}</span>
                                        </div>
                                        <div className="health-stat-icon-wrap" style={{ background: `${s.color}15`, color: s.color }}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="medical-log">
                                <div className="log-header"><h3>Director's Action Items</h3></div>
                                <div style={{ padding: '1.5rem' }}>
                                    {[
                                        { task: 'Approve Equipment Budget for ICU', status: 'Pending', time: 'Urgent' },
                                        { task: 'Review Monthly Performance Metrics', status: 'In-Progress', time: 'Today' },
                                        { task: 'Staff Recruitment Sign-off (Nurses)', status: 'Pending', time: 'Tomorrow' },
                                        { task: 'State Medical Audit Preparation', status: 'In-Progress', time: 'Next Week' },
                                    ].map((t, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.task}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Scheduled: {t.time}</div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                background: t.status === 'Completed' ? '#ecfdf5' : t.status === 'Pending' ? '#fff1f2' : '#eff6ff',
                                                color: t.status === 'Completed' ? '#10b981' : t.status === 'Pending' ? '#ef4444' : '#3b82f6',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px'
                                            }}>{t.status.toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="medical-log">
                                <div className="log-header"><h3>Critical Alerts</h3></div>
                                <div className="log-body">
                                    <div className="log-item" style={{ background: '#fef2f2', padding: '1rem', borderRadius: '0.75rem' }}>
                                        <AlertCircle size={18} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>ICU Bed Capacity Near Full</div>
                                        <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>Current: 95% Occupied</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            }
            case 'myTasks':
                return (
                    <div className="medical-log">
                        <div className="log-header"><h3>My Tasks</h3></div>
                        <div style={{ padding: '1.5rem' }}>
                            <MemberTasksPanel user={user} role="HOSPITAL_WARDEN" memberName={myHospital.name} accentColor="#f59e0b" />
                        </div>
                    </div>
                );
            case 'taskAssign':
                return (
                    <div style={{ marginTop: '1rem' }}>
                        <TaskAssignPanel user={user} role="HOSPITAL_WARDEN" department="HEALTH" accentColor="#10b981" />
                    </div>
                );
            case 'taskStatus':
                return (
                    <div style={{ marginTop: '1rem' }}>
                        <TaskStatusPanel user={user} role="HOSPITAL_WARDEN" department="HEALTH" accentColor="#10b981" />
                    </div>
                );
            case 'doctors':
                return (
                    <div className="medical-log">
                        <div className="log-header">
                            <h3>Doctors Roster</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div className="health-search-bar" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                    <Search size={14} color="#94a3b8" style={{ marginRight: '0.5rem' }} />
                                    <input type="text" placeholder="Search doctors..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem' }} />
                                </div>
                                <button className="health-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Plus size={14} style={{ marginRight: '0.3rem' }} /> Add Doctor</button>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 0' }}>Doctor Name</th>
                                        <th>Department</th>
                                        <th>Qualification</th>
                                        <th>Experience</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myDoctors.length > 0 ? myDoctors.map((doc, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem 0', fontWeight: 600 }}>{doc.name}</td>
                                            <td>{doc.dept}</td>
                                            <td>{doc.qualification}</td>
                                            <td>{doc.experience} Years</td>
                                            <td>{doc.phone}</td>
                                            <td>
                                                <span style={{
                                                    color: doc.status === 'Available' || doc.status === 'On-Duty' ? '#10b981' : doc.status === 'Surgery' ? '#f59e0b' : '#ef4444',
                                                    fontWeight: 700
                                                }}>● {doc.status}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No doctors assigned to this facility yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'staff':
                return (
                    <div className="medical-log">
                        <div className="log-header">
                            <h3>Support Staff & Administration</h3>
                            <button className="health-btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Plus size={14} style={{ marginRight: '0.3rem' }} /> Add Staff</button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 0' }}>Staff Name</th>
                                        <th>Role / Designation</th>
                                        <th>Department / Ward</th>
                                        <th>Shift</th>
                                        <th>Attendance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Mrs. K. Lakshmi', role: 'Head Nurse', zone: 'ICU', shift: 'Morning', status: 'Present' },
                                        { name: 'Mr. T. Ramesh', role: 'Pharmacist', zone: 'Pharmacy Unit I', shift: 'General', status: 'Present' },
                                        { name: 'Ms. V. Divya', role: 'Lab Technician', zone: 'Pathology', shift: 'General', status: 'On-Leave' },
                                        { name: 'R. Mani', role: 'Chief Cook', zone: 'Kitchen', shift: 'Morning', status: 'Present' },
                                        { name: 'S. Velu', role: 'Security Head', zone: 'Main Gate', shift: 'Night', status: 'Present' },
                                        { name: 'K. Amala', role: 'Housekeeping', zone: 'Ward 401', shift: 'Morning', status: 'On-Leave' },
                                    ].map((s, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem 0', fontWeight: 600 }}>{s.name}</td>
                                            <td>{s.role}</td>
                                            <td>{s.zone}</td>
                                            <td>{s.shift}</td>
                                            <td><span style={{ color: s.status === 'Present' ? '#10b981' : '#ef4444', fontWeight: 700 }}>● {s.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'financials': {
                const revenueData = [
                    { month: 'Jan', revenue: 1200000, expenses: 800000 },
                    { month: 'Feb', revenue: 1350000, expenses: 850000 },
                    { month: 'Mar', revenue: 1250000, expenses: 900000 },
                    { month: 'Apr', revenue: 1500000, expenses: 950000 },
                    { month: 'May', revenue: 1400000, expenses: 920000 },
                    { month: 'Jun', revenue: 1650000, expenses: 1000000 },
                ];
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="medical-log">
                            <div className="log-header">
                                <h3>Hospital Financial Overview</h3>
                            </div>
                            <div style={{ padding: '1.5rem', height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            dx={-10}
                                            tickFormatter={(value) => `₹${value / 100000}L`}
                                        />
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                                        <Bar dataKey="expenses" name="Operating Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#10b981', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><Activity size={18} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>YTD Revenue</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>₹8.35 Cr</div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#ef4444', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><Activity size={18} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>YTD Expenses</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>₹5.42 Cr</div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><Building2 size={18} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Net Margin</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>35.1%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                            <div className="medical-log">
                                <div className="log-header"><h3>Department Budget Allocation (FY 25-26)</h3></div>
                                <div style={{ padding: '1.5rem' }}>
                                    {[
                                        { dept: 'Medical Equipment & Maintenance', allocated: '₹45,00,000', used: '₹32,50,000', pct: 72 },
                                        { dept: 'Pharmacy & Drug Procurement', allocated: '₹80,00,000', used: '₹65,00,000', pct: 81 },
                                        { dept: 'Infrastructure & Sanitation', allocated: '₹25,00,000', used: '₹12,00,000', pct: 48 },
                                        { dept: 'Staff Welfare & Training', allocated: '₹15,00,000', used: '₹14,50,000', pct: 96 },
                                    ].map((b, i) => (
                                        <div key={i} style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                                <span style={{ fontWeight: 600 }}>{b.dept}</span>
                                                <span style={{ color: '#64748b' }}><span style={{ color: b.pct > 90 ? '#ef4444' : '#10b981', fontWeight: 800 }}>{b.used}</span> / {b.allocated}</span>
                                            </div>
                                            <div className="hosp-bar-bg" style={{ height: '8px' }}>
                                                <div className="hosp-bar-fill" style={{ width: `${b.pct}%`, background: b.pct > 90 ? '#ef4444' : '#3b82f6' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="medical-log">
                                <div className="log-header"><h3>Pending Procurement Requests</h3></div>
                                <div style={{ padding: '0 1.5rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <tbody>
                                            {[
                                                { item: 'MRI Machine Servicing', req: 'Radiology', amt: '₹2,50,000', urgency: 'High' },
                                                { item: 'N95 Masks (5000 units)', req: 'Inventory', amt: '₹45,000', urgency: 'Critical' },
                                                { item: 'New Ward Beds (20 units)', req: 'General Ward', amt: '₹1,20,000', urgency: 'Medium' },
                                            ].map((p, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '1rem 0' }}>
                                                        <div style={{ fontWeight: 700 }}>{p.item}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Req: {p.req}</div>
                                                    </td>
                                                    <td style={{ fontWeight: 800, color: '#3b82f6' }}>{p.amt}</td>
                                                    <td><span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: p.urgency === 'Critical' ? '#fef2f2' : '#f8fafc', color: p.urgency === 'Critical' ? '#ef4444' : '#64748b', fontWeight: 700 }}>{p.urgency.toUpperCase()}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'compliance':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="medical-log">
                            <div className="log-header">
                                <h3>State Medical Audits</h3>
                                <div style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: 700 }}>GRADE A FACILITY</div>
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { check: 'Bio-Medical Waste Management Protocol', status: 'Passed', date: 'Oct 12, 2025' },
                                    { check: 'Fire Safety & Evacuation Readiness', status: 'Passed', date: 'Nov 05, 2025' },
                                    { check: 'Pharmacy Narcotics Inventory Audit', status: 'Reviewing', date: 'Pending' },
                                    { check: 'Operation Theatre Sterility Index', status: 'Passed', date: 'Jan 15, 2026' },
                                ].map((c, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: c.status === 'Passed' ? '#f8fafc' : '#fffbeb', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                                        {c.status === 'Passed' ? <CheckCircle2 size={20} color="#10b981" /> : <Clock size={20} color="#f59e0b" />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{c.check}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Inspected: {c.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="medical-log">
                            <div className="log-header"><h3>Certifications & Renewals</h3></div>
                            <div style={{ padding: '0 1.5rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ padding: '1rem 0' }}>License / Certificate</th>
                                            <th>Issuing Authority</th>
                                            <th>Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { cert: 'Clinical Establishment Act License', auth: 'State Health Dept.', exp: 'Dec 31, 2028', urgent: false },
                                            { cert: 'Blood Bank Operation License', auth: 'CDSCO', exp: 'Mar 15, 2026', urgent: true },
                                            { cert: 'PNDT Act Registration (Ultrasound)', auth: 'District Magistrate', exp: 'Aug 20, 2027', urgent: false },
                                        ].map((c, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '1.25rem 0', fontWeight: 600 }}>
                                                    {c.cert}
                                                    {c.urgent && <span style={{ display: 'inline-block', marginLeft: '0.5rem', fontSize: '0.65rem', background: '#fef2f2', color: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>RENEWAL DUE</span>}
                                                </td>
                                                <td>{c.auth}</td>
                                                <td style={{ color: c.urgent ? '#ef4444' : '#64748b', fontWeight: c.urgent ? 800 : 400 }}>{c.exp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'patients': {
                const patientData = [
                    { month: 'Jan', admitted: 1200, discharged: 1100, remaining: 100 },
                    { month: 'Feb', admitted: 980, discharged: 900, remaining: 80 },
                    { month: 'Mar', admitted: 1350, discharged: 1250, remaining: 100 },
                    { month: 'Apr', admitted: 1100, discharged: 1050, remaining: 50 },
                    { month: 'May', admitted: 1420, discharged: 1300, remaining: 120 },
                    { month: 'Jun', admitted: 1550, discharged: 1480, remaining: 70 },
                ];
                const outpatientData = [
                    { month: 'Jan', op: 4200 },
                    { month: 'Feb', op: 4500 },
                    { month: 'Mar', op: 5100 },
                    { month: 'Apr', op: 4800 },
                    { month: 'May', op: 5300 },
                    { month: 'Jun', op: 5800 },
                ];
                return (
                    <div className="medical-log">
                        <div className="log-header">
                            <h3>Monthly Patient Demographics</h3>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', height: '350px' }}>
                            <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e293b' }}>In-Patient Flow</h4>
                                <div style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={patientData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} width={40} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #f1f5f9', fontSize: '0.8rem' }} />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '0.8rem' }} />
                                            <Bar dataKey="admitted" name="Admitted" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                                            <Bar dataKey="discharged" name="Discharged" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                                            <Bar dataKey="remaining" name="Remaining" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e293b' }}>Out-Patient Volume</h4>
                                <div style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={outpatientData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorOp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} width={40} />
                                            <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #f1f5f9', fontSize: '0.8rem' }} />
                                            <Area type="monotone" dataKey="op" name="Out-Patients" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOp)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><Users size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Admitted (YTD)</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>7,600</div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#10b981', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><CheckCircle2 size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Discharged (YTD)</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>7,080</div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f59e0b', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}><Bed size={18} /></div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active In-Patients</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>520</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            default:
                return <div style={{ padding: '2rem', textAlign: 'center' }}>Under Development.</div>;
        }
    };

    return (
        <div className="health-dashboard">
            <aside className="health-sidebar">
                <div className="health-brand">
                    <div className="health-logo"><Building2 size={24} color="#fff" /></div>
                    <div className="health-brand-name">Director Portal</div>
                </div>
                <div className="health-role-tag"><ShieldCheck size={14} /><span>HOSPITAL DEAN</span></div>
                <nav className="health-nav">
                    <button className={`health-nav-item ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}><Layout size={18} />Overview</button>
                    <button className={`health-nav-item ${tab === 'myTasks' ? 'active' : ''}`} onClick={() => setTab('myTasks')}><ClipboardList size={18} />My Tasks</button>
                    <button className={`health-nav-item ${tab === 'taskAssign' ? 'active' : ''}`} onClick={() => setTab('taskAssign')}><Plus size={18} />Assign Tasks</button>
                    <button className={`health-nav-item ${tab === 'taskStatus' ? 'active' : ''}`} onClick={() => setTab('taskStatus')}><Activity size={18} />Task Status</button>
                    <button className={`health-nav-item ${tab === 'doctors' ? 'active' : ''}`} onClick={() => setTab('doctors')}><Thermometer size={18} />Doctors Roster</button>
                    <button className={`health-nav-item ${tab === 'patients' ? 'active' : ''}`} onClick={() => setTab('patients')}><Bed size={18} />Patient Census</button>
                    <button className={`health-nav-item ${tab === 'staff' ? 'active' : ''}`} onClick={() => setTab('staff')}><Users size={18} />Support Staff</button>
                    <button className={`health-nav-item ${tab === 'financials' ? 'active' : ''}`} onClick={() => setTab('financials')}><Activity size={18} />Financials</button>
                    <button className={`health-nav-item ${tab === 'compliance' ? 'active' : ''}`} onClick={() => setTab('compliance')}><ClipboardCheck size={18} />Compliance</button>
                </nav>
                <div className="health-sidebar-footer">
                    <div className="health-user-card">
                        <div className="health-avatar">{user?.username?.[0]?.toUpperCase() || 'D'}</div>
                        <div className="health-user-info">
                            <span className="health-username">{user?.username || 'Director'}</span>
                            <span className="health-userrole">{myHospital.name}</span>
                        </div>
                    </div>
                    <button className="health-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}><LogOut size={16} /> Logout</button>
                </div>
            </aside>
            <main className="health-main">
                <header className="health-topbar">
                    <div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Hospital Administration Console</div>
                        <h1>{myHospital.name}</h1>
                    </div>
                    <div className="health-top-actions"><button className="health-notification-btn"><Bell size={18} /></button></div>
                </header>
                <div className="health-content">{renderContent()}</div>
            </main>
        </div>
    );
};

export default DirectorDashboard;
