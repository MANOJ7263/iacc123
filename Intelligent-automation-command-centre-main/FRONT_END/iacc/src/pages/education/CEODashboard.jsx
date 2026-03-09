import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Building2, GraduationCap, TrendingUp, LogOut, Bell,
    CheckCircle2, Clock, AlertTriangle, ChevronRight, MapPin,
    Phone, Mail, Edit3, UserCheck, X, Save, BarChart2,
    Activity, Shield, BookOpen, Award, Zap, Settings,
    ChevronDown, ChevronUp, Search, Filter, ArrowLeft,
    UserSquare2, School, Layers, ClipboardList, Activity as ActivityIcon
} from 'lucide-react';
import { DISTRICT, ZONES, DEOS, HEADMASTERS, ZONE_A_SCHOOLS, TEACHERS, generateStudents } from '../../data/educationData';
import NotificationBell from '../../components/education/NotificationBell';
import { TaskAssignPanel, TaskStatusPanel } from '../../components/education/EduTaskPanels';
import { useEducationStore } from '../../data/educationStore';
import './EducationDashboard.css';

// ─── All schools (expanded from ZONE_A_SCHOOLS + generated for other zones) ────
const ALL_SCHOOLS = [
    // Zone 1 – Namakkal Town
    { id: 'S001', name: 'Govt Boys Hr Sec School, Namakkal', zoneId: 'Z1', type: 'Government', hmId: 'HM001', students: 2450, teachers: 85, performance: 94, aidStatus: 'Fully Funded' },
    { id: 'S002', name: 'Govt Girls Hr Sec School, Namakkal', zoneId: 'Z1', type: 'Government', hmId: 'HM002', students: 2800, teachers: 92, performance: 98, aidStatus: 'Fully Funded' },
    { id: 'S003', name: 'Municipal High School, Fort', zoneId: 'Z1', type: 'Aided', hmId: 'HM003', students: 1200, teachers: 45, performance: 88, aidStatus: 'Partial Aid' },
    { id: 'S004', name: 'Panchayat Union Middle School', zoneId: 'Z1', type: 'Government', hmId: 'HM004', students: 450, teachers: 18, performance: 82, aidStatus: 'Fully Funded' },
    { id: 'S005', name: 'Sri Vidya Mandir Mat. Hr. Sec. School', zoneId: 'Z1', type: 'Private', hmId: null, students: 3100, teachers: 110, performance: 99, aidStatus: 'No Aid' },
    // Zone 2 – Tiruchengode
    { id: 'S006', name: 'Govt Hr Sec School, Tiruchengode', zoneId: 'Z2', type: 'Government', hmId: 'HM005', students: 2100, teachers: 75, performance: 91, aidStatus: 'Fully Funded' },
    { id: 'S007', name: 'Govt Girls High School, Tiruchengode', zoneId: 'Z2', type: 'Government', hmId: 'HM006', students: 1850, teachers: 65, performance: 89, aidStatus: 'Fully Funded' },
    { id: 'S008', name: 'Bharathi Matric Hr Sec School', zoneId: 'Z2', type: 'Private', hmId: null, students: 2600, teachers: 95, performance: 97, aidStatus: 'No Aid' },
    { id: 'S009', name: 'RC High School, Tiruchengode', zoneId: 'Z2', type: 'Aided', hmId: null, students: 980, teachers: 38, performance: 86, aidStatus: 'Partial Aid' },
    // Zone 3 – Rasipuram
    { id: 'S010', name: 'Govt Hr Sec School, Rasipuram', zoneId: 'Z3', type: 'Government', hmId: 'HM007', students: 1960, teachers: 72, performance: 95, aidStatus: 'Fully Funded' },
    { id: 'S011', name: 'Panchayat Union High School, Rasipuram', zoneId: 'Z3', type: 'Government', hmId: null, students: 620, teachers: 22, performance: 80, aidStatus: 'Fully Funded' },
    { id: 'S012', name: 'St. Joseph Matric School, Rasipuram', zoneId: 'Z3', type: 'Private', hmId: null, students: 1500, teachers: 55, performance: 96, aidStatus: 'No Aid' },
    // Zone 4 – Paramathi Velur
    { id: 'S013', name: 'Govt Hr Sec School, Paramathi Velur', zoneId: 'Z4', type: 'Government', hmId: null, students: 1780, teachers: 63, performance: 88, aidStatus: 'Fully Funded' },
    { id: 'S014', name: 'Corporation High School, Paramathi', zoneId: 'Z4', type: 'Aided', hmId: null, students: 840, teachers: 32, performance: 83, aidStatus: 'Partial Aid' },
    // Zone 5 – Kolli Hills
    { id: 'S015', name: 'Govt Hr Sec School, Kolli Hills', zoneId: 'Z5', type: 'Government', hmId: null, students: 1120, teachers: 42, performance: 85, aidStatus: 'Fully Funded' },
    { id: 'S016', name: 'Tribal Welfare Residential School', zoneId: 'Z5', type: 'Government', hmId: null, students: 860, teachers: 35, performance: 82, aidStatus: 'Fully Funded' },
];

// ─── Pre-generate students once ───────────────────────────────────────────────
const ALL_STUDENTS = generateStudents();

// ─── Small helpers ─────────────────────────────────────────────────────────────
const badge = (text, color = '#3b82f6') => (
    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', background: `${color}18`, color }}>{text}</span>
);

const perfColor = (p) => p >= 90 ? '#10b981' : p >= 80 ? '#f59e0b' : '#ef4444';

// ─── Clickable StatCard ────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, onClick, active }) => (
    <div
        className="edu-stat-card"
        style={{
            '--c': color,
            cursor: onClick ? 'pointer' : 'default',
            border: active ? `2px solid ${color}` : '2px solid transparent',
            boxShadow: active ? `0 0 0 3px ${color}22` : undefined,
            transform: active ? 'translateY(-2px)' : undefined,
            transition: 'all 0.18s',
        }}
        onClick={onClick}
    >
        <div className="edu-stat-icon" style={{ background: `${color}18` }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <div className="edu-stat-value">{value}</div>
            <div className="edu-stat-label">{label}</div>
            {sub && <div className="edu-stat-sub">{sub}</div>}
        </div>
        {onClick && (
            <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                View <ChevronRight size={12} />
            </div>
        )}
    </div>
);

// ─── Panel Wrapper ─────────────────────────────────────────────────────────────
const DrillPanel = ({ title, sub, color, icon: Icon, onClose, children }) => (
    <div style={{ marginTop: '1.5rem', background: '#fff', border: `1.5px solid ${color}44`, borderRadius: '1rem', overflow: 'hidden', boxShadow: `0 4px 24px ${color}14` }}>
        <div style={{ padding: '1rem 1.5rem', background: `linear-gradient(135deg, ${color}12, ${color}06)`, borderBottom: `1px solid ${color}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Icon size={18} color={color} />
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{title}</div>
                    {sub && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub}</div>}
                </div>
            </div>
            <button onClick={onClose} style={{ background: `${color}18`, border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} color={color} />
            </button>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '520px', overflowY: 'auto' }}>{children}</div>
    </div>
);

// ─── DEO Drill-Down ────────────────────────────────────────────────────────────
const DeoDrillDown = ({ assignments, onClose }) => (
    <DrillPanel title="All DEOs – District Roster" sub={`${DEOS.length} District Education Officers`} color="#3b82f6" icon={Users} onClose={onClose}>
        <table className="edu-table">
            <thead>
                <tr><th>Name</th><th>Username</th><th>Contact</th><th>Assigned Zone</th><th>Schools</th><th>Status</th></tr>
            </thead>
            <tbody>
                {DEOS.map(deo => {
                    const zone = assignments[deo.id]?.zone || deo.zone;
                    const assigned = !!(assignments[deo.id]?.zone || deo.zone);
                    return (
                        <tr key={deo.id}>
                            <td>
                                <div className="edu-name-cell">
                                    <div className="edu-av blue">{deo.name[0]}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{deo.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{deo.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="mono" style={{ fontSize: '0.82rem' }}>{deo.username}</td>
                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                <div><Phone size={10} style={{ marginRight: 3 }} />{deo.phone}</div>
                                <div><Mail size={10} style={{ marginRight: 3 }} />{deo.email}</div>
                            </td>
                            <td style={{ fontWeight: 600, color: zone ? '#2563eb' : '#94a3b8', fontSize: '0.82rem' }}>{zone || '—'}</td>
                            <td style={{ fontWeight: 600 }}>{deo.schools || 0}</td>
                            <td>{badge(assigned ? '✓ Assigned' : '⏳ Pending', assigned ? '#10b981' : '#f59e0b')}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </DrillPanel>
);

// ─── Schools Drill-Down ────────────────────────────────────────────────────────
const SchoolsDrillDown = ({ onClose }) => {
    const [search, setSearch] = useState('');
    const [filterZone, setFilterZone] = useState('ALL');
    const [selected, setSelected] = useState(null); // school detail view

    const filtered = ALL_SCHOOLS.filter(s =>
        (filterZone === 'ALL' || s.zoneId === filterZone) &&
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    if (selected) {
        const hm = HEADMASTERS.find(h => h.id === selected.hmId);
        const schoolTeachers = TEACHERS.slice(0, selected.teachers > TEACHERS.length ? TEACHERS.length : Math.min(selected.teachers, 12));
        return (
            <DrillPanel title={selected.name} sub={`${selected.type} · ${ZONES.find(z => z.id === selected.zoneId)?.name}`} color="#8b5cf6" icon={School} onClose={onClose}>
                <button onClick={() => setSelected(null)} style={{ marginBottom: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    <ArrowLeft size={13} /> Back to Schools List
                </button>
                {/* School summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {[
                        { label: 'Students', value: selected.students.toLocaleString(), color: '#10b981' },
                        { label: 'Teachers', value: selected.teachers, color: '#3b82f6' },
                        { label: 'Pass Rate', value: `${selected.performance}%`, color: perfColor(selected.performance) },
                        { label: 'Aid Status', value: selected.aidStatus, color: '#8b5cf6' },
                    ].map(c => (
                        <div key={c.label} style={{ background: `${c.color}10`, borderRadius: '0.75rem', padding: '0.75rem', border: `1px solid ${c.color}22` }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: c.color }}>{c.value}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{c.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                    Headmaster
                </div>
                {hm ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{hm.name[0]}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{hm.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{hm.id} · {selected.name}</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '0.6rem 1rem', background: '#fef3c7', borderRadius: '0.5rem', color: '#92400e', fontSize: '0.82rem', marginBottom: '1.25rem' }}>⏳ Headmaster post vacant</div>
                )}

                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                    Sample Teachers ({schoolTeachers.length} shown)
                </div>
                <table className="edu-table">
                    <thead><tr><th>Name</th><th>Subject</th><th>Designation</th><th>Experience</th><th>Status</th></tr></thead>
                    <tbody>
                        {schoolTeachers.map(t => (
                            <tr key={t.id}>
                                <td style={{ fontWeight: 600 }}>{t.name}</td>
                                <td>{t.subject}</td>
                                <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.designation}</td>
                                <td>{t.experience} yrs</td>
                                <td>{badge(t.status === 'active' ? 'Active' : 'On Leave', t.status === 'active' ? '#10b981' : '#f59e0b')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DrillPanel>
        );
    }

    return (
        <DrillPanel title="School Network" sub={`${ALL_SCHOOLS.length} schools across ${ZONES.length} zones`} color="#8b5cf6" icon={Building2} onClose={onClose}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search schools..."
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <select value={filterZone} onChange={e => setFilterZone(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="ALL">All Zones</option>
                    {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
            </div>
            {/* Summary bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Schools', value: filtered.length, color: '#8b5cf6' },
                    { label: 'Total Students', value: filtered.reduce((s, x) => s + x.students, 0).toLocaleString(), color: '#10b981' },
                    { label: 'Total Teachers', value: filtered.reduce((s, x) => s + x.teachers, 0), color: '#3b82f6' },
                ].map(c => (
                    <div key={c.label} style={{ flex: 1, padding: '0.5rem 0.75rem', background: `${c.color}10`, borderRadius: '0.6rem', border: `1px solid ${c.color}22`, minWidth: '100px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.label}</div>
                    </div>
                ))}
            </div>
            <table className="edu-table">
                <thead>
                    <tr><th>School Name</th><th>Zone</th><th>Type</th><th>Headmaster</th><th>Students</th><th>Teachers</th><th>Pass %</th><th>Aid</th></tr>
                </thead>
                <tbody>
                    {filtered.map(s => {
                        const hm = HEADMASTERS.find(h => h.id === s.hmId);
                        const zone = ZONES.find(z => z.id === s.zoneId);
                        return (
                            <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}>
                                <td>
                                    <div style={{ fontWeight: 600, fontSize: '0.83rem', color: '#3b82f6' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Click to view details</div>
                                </td>
                                <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{zone?.name}</td>
                                <td>{badge(s.type, s.type === 'Government' ? '#10b981' : s.type === 'Private' ? '#8b5cf6' : '#f59e0b')}</td>
                                <td style={{ fontSize: '0.80rem', fontWeight: 600 }}>{hm?.name || <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>⏳ Vacant</span>}</td>
                                <td style={{ fontWeight: 700 }}>{s.students.toLocaleString()}</td>
                                <td style={{ fontWeight: 700 }}>{s.teachers}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ flex: 1, height: '5px', background: '#e2e8f0', borderRadius: '9px', minWidth: '40px' }}>
                                            <div style={{ width: `${s.performance}%`, height: '100%', background: perfColor(s.performance), borderRadius: '9px' }} />
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: perfColor(s.performance) }}>{s.performance}%</span>
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.aidStatus}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </DrillPanel>
    );
};

// ─── Students Drill-Down ───────────────────────────────────────────────────────
const StudentsDrillDown = ({ onClose }) => {
    const [search, setSearch] = useState('');
    const [filterGrade, setFilterGrade] = useState('ALL');
    const [filterSection, setFilterSection] = useState('ALL');
    const grades = [...new Set(ALL_STUDENTS.map(s => s.grade))].sort((a, b) => a - b);

    const filtered = ALL_STUDENTS.filter(s =>
        (filterGrade === 'ALL' || String(s.grade) === filterGrade) &&
        (filterSection === 'ALL' || s.section === filterSection) &&
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const avgAttendance = filtered.length > 0
        ? Math.round(filtered.reduce((s, x) => s + x.attendance, 0) / filtered.length) : 0;

    return (
        <DrillPanel title="Student Records" sub={`${ALL_STUDENTS.length} students · Govt Boys Hr Sec School`} color="#10b981" icon={GraduationCap} onClose={onClose}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="ALL">All Grades</option>
                    {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
                <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="ALL">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                </select>
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Showing', value: filtered.length, color: '#10b981' },
                    { label: 'Avg Attendance', value: `${avgAttendance}%`, color: '#3b82f6' },
                    { label: 'Boys', value: filtered.filter(s => s.gender === 'Male').length, color: '#6366f1' },
                    { label: 'Girls', value: filtered.filter(s => s.gender === 'Female').length, color: '#ec4899' },
                ].map(c => (
                    <div key={c.label} style={{ flex: 1, padding: '0.5rem 0.75rem', background: `${c.color}10`, borderRadius: '0.6rem', border: `1px solid ${c.color}22`, minWidth: '80px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.label}</div>
                    </div>
                ))}
            </div>

            <table className="edu-table">
                <thead>
                    <tr><th>Roll No</th><th>Name</th><th>Grade</th><th>Gender</th><th>Attendance</th><th>Tamil</th><th>English</th><th>Maths</th><th>Science</th><th>Social</th></tr>
                </thead>
                <tbody>
                    {filtered.slice(0, 80).map((s, i) => (
                        <tr key={i}>
                            <td className="mono" style={{ fontSize: '0.75rem' }}>{s.rollNo}</td>
                            <td style={{ fontWeight: 600, fontSize: '0.83rem' }}>{s.name}</td>
                            <td>{badge(`G${s.grade}${s.section}`, '#6366f1')}</td>
                            <td style={{ fontSize: '0.78rem', color: s.gender === 'Male' ? '#3b82f6' : '#ec4899' }}>{s.gender}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <div style={{ width: '40px', height: '5px', background: '#e2e8f0', borderRadius: '9px' }}>
                                        <div style={{ width: `${s.attendance}%`, height: '100%', background: s.attendance >= 80 ? '#10b981' : '#f59e0b', borderRadius: '9px' }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.attendance >= 80 ? '#10b981' : '#f59e0b' }}>{s.attendance}%</span>
                                </div>
                            </td>
                            {[s.tamil, s.english, s.maths, s.science, s.social].map((m, mi) => (
                                <td key={mi} style={{ fontWeight: 600, fontSize: '0.82rem', color: m >= 75 ? '#10b981' : m >= 50 ? '#f59e0b' : '#ef4444' }}>{m}</td>
                            ))}
                        </tr>
                    ))}
                    {filtered.length > 80 && (
                        <tr><td colSpan={10} style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem', padding: '0.75rem' }}>Showing 80 of {filtered.length}. Use filters to narrow down.</td></tr>
                    )}
                </tbody>
            </table>
        </DrillPanel>
    );
};

// ─── Teachers Drill-Down ───────────────────────────────────────────────────────
const TeachersDrillDown = ({ onClose }) => {
    const [search, setSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const subjects = [...new Set(TEACHERS.map(t => t.subject))].sort();

    const filtered = TEACHERS.filter(t =>
        (filterSubject === 'ALL' || t.subject === filterSubject) &&
        (filterStatus === 'ALL' || t.status === filterStatus) &&
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DrillPanel title="Teacher Directory" sub={`${TEACHERS.length} teachers · Govt Boys Hr Sec School`} color="#f59e0b" icon={BookOpen} onClose={onClose}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..."
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="ALL">All Subjects</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="ALL">All Status</option>
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                </select>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                    { label: 'Total', value: filtered.length, color: '#f59e0b' },
                    { label: 'PG Teachers', value: filtered.filter(t => t.designation === 'PG Teacher').length, color: '#6366f1' },
                    { label: 'BT Asst.', value: filtered.filter(t => t.designation === 'BT Asst').length, color: '#3b82f6' },
                    { label: 'On Leave', value: filtered.filter(t => t.status === 'on-leave').length, color: '#ef4444' },
                ].map(c => (
                    <div key={c.label} style={{ flex: 1, padding: '0.5rem 0.75rem', background: `${c.color}10`, borderRadius: '0.6rem', border: `1px solid ${c.color}22` }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.label}</div>
                    </div>
                ))}
            </div>

            <table className="edu-table">
                <thead>
                    <tr><th>Name</th><th>Subject</th><th>Designation</th><th>Qualification</th><th>Experience</th><th>Classes</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {filtered.map(t => (
                        <tr key={t.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '1.8rem', height: '1.8rem', background: t.status === 'active' ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: t.status === 'active' ? '#fff' : '#94a3b8', flexShrink: 0 }}>{t.name[0]}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{t.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.subject}</td>
                            <td>{badge(t.designation, t.designation === 'PG Teacher' ? '#6366f1' : '#3b82f6')}</td>
                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.qualification}</td>
                            <td style={{ fontWeight: 700 }}>{t.experience} yrs</td>
                            <td style={{ fontSize: '0.75rem', color: '#475569' }}>{Array.isArray(t.classes) ? t.classes.join(', ') : t.classes}</td>
                            <td>{badge(t.status === 'active' ? 'Active' : 'On Leave', t.status === 'active' ? '#10b981' : '#f59e0b')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DrillPanel>
    );
};

// ─── Assign DEO Modal ─────────────────────────────────────────────────────────
const AssignModal = ({ deo, onClose, onSave }) => {
    const [zone, setZone] = useState(deo.zone || '');
    const [selectedHMs, setSelectedHMs] = useState([]);
    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Assign Zone & Headmasters</h2>
                        <p className="modal-sub">DEO: <strong>{deo.name}</strong></p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="modal-label">Assign to Zone</label>
                        <select className="modal-select" value={zone} onChange={e => setZone(e.target.value)}>
                            <option value="">-- Select Zone --</option>
                            {ZONES.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                        </select>
                    </div>
                    {zone === ZONES[0].name && (
                        <div className="form-group">
                            <label className="modal-label">Assign Headmasters (Zone A)</label>
                            <div className="hm-check-list">
                                {HEADMASTERS.filter(h => h.zoneId === 'Z1').map(hm => (
                                    <label key={hm.id} className="hm-check-item">
                                        <input type="checkbox" checked={selectedHMs.includes(hm.id)}
                                            onChange={e => { if (e.target.checked) setSelectedHMs(p => [...p, hm.id]); else setSelectedHMs(p => p.filter(x => x !== hm.id)); }} />
                                        <span className="hm-check-name">{hm.name}</span>
                                        <span className="hm-check-school">{hm.school}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="modal-note"><AlertTriangle size={14} /> Once assigned, the DEO will gain access to the zone dashboard.</div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-assign" disabled={!zone} onClick={() => onSave({ zone, headmasters: selectedHMs })}>
                        <Save size={16} /> Save Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────
const SettingsTab = ({ user }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="edu-card" style={{ padding: '1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div className="edu-avatar blue-av" style={{ width: '5rem', height: '5rem', fontSize: '2rem', margin: '0 auto 1rem' }}>{user?.username?.[0]?.toUpperCase() || 'C'}</div>
                <h3 style={{ margin: 0 }}>{user?.username || 'District CEO'}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Chief Education Officer · Namakkal District</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[['Designation', 'IACC Administrator'], ['Department', 'Education'], ['Access Level', 'Full District Control']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>{k}</span>
                        <span className="fw-500" style={k === 'Access Level' ? { color: '#2563eb' } : {}}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="edu-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['Mobile Number', '+91 94421-22001'], ['Email Address', 'ceo.namakkal@tn.gov.in']].map(([l, v]) => (
                    <div key={l} className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>{l}</label>
                        <input type="text" defaultValue={v} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className="edu-tag-btn" style={{ background: '#3b82f6', color: 'white' }}>Save Changes</button>
                <button className="edu-tag-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
            </div>
        </div>
    </div>
);

// ─── CEO Dashboard ─────────────────────────────────────────────────────────────
const CEODashboard = () => {
    const navigate = useNavigate();
    const { activity, assignments, assignDEO } = useEducationStore();
    const [tab, setTab] = useState('overview');
    const [assigningDeo, setAssigningDeo] = useState(null);
    const [user, setUser] = useState(null);
    // Which stat card is drilled into: null | 'deos' | 'schools' | 'students' | 'teachers'
    const [drilldown, setDrilldown] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }, []);

    const handleAssign = (data) => {
        assignDEO(data.zone, assigningDeo.name);
        setAssigningDeo(null);
    };

    const allDeos = DEOS.map(d => ({
        ...d,
        assignedZone: assignments[d.id]?.zone || d.zone,
        isAssigned: !!(assignments[d.id]?.zone || d.zone),
    }));

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'deos', label: 'DEO Management', icon: Users },
        { id: 'schools', label: 'Schools', icon: Building2 },
        { id: 'zones', label: 'Zone Analytics', icon: MapPin },
        { id: 'taskAssign', label: 'Task Assign', icon: ClipboardList },
        { id: 'taskStatus', label: 'Task Status', icon: ActivityIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const toggleDrill = (key) => setDrilldown(prev => prev === key ? null : key);

    return (
        <div className="edu-dashboard">
            {/* ─── Sidebar ─── */}
            <aside className="edu-sidebar blue">
                <div className="edu-brand">
                    <div className="edu-logo"><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">Education Dept.</div>
                        <div className="edu-brand-sys">IACC Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag">Chief Education Officer</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setDrilldown(null); }}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar">{user?.username?.[0]?.toUpperCase() || 'C'}</div>
                        <div>
                            <div className="edu-username">{user?.username || 'testCEO'}</div>
                            <div className="edu-userrole">CEO – District Admin</div>
                        </div>
                    </div>
                    <button className="edu-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main className="edu-main">
                <header className="edu-topbar">
                    <div>
                        <div className="edu-breadcrumb">Education Dept · CEO Dashboard</div>
                        <h1 className="edu-page-title">
                            {tab === 'overview' && 'District Overview'}
                            {tab === 'deos' && 'DEO Management'}
                            {tab === 'schools' && 'School Network'}
                            {tab === 'zones' && 'Zone Analytics'}
                            {tab === 'taskAssign' && 'Task Assign'}
                            {tab === 'taskStatus' && 'Task Status'}
                            {tab === 'settings' && 'Settings'}
                        </h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill blue"><Shield size={12} />CEO Access</div>
                        <button className="edu-icon-btn"><Bell size={18} /></button>
                    </div>
                </header>

                {/* Hero */}
                <div className="edu-hero blue-hero">
                    <div className="hero-l">
                        <GraduationCap size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">Namakkal District – Education Department</div>
                            <div className="hero-sub">Academic Year {DISTRICT.year} · {DISTRICT.state}</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><CheckCircle2 size={13} />System Active</span>
                        <span><Zap size={13} />Automation On</span>
                    </div>
                </div>

                <div className="edu-content">
                    {/* ═══════════════ OVERVIEW ═══════════════ */}
                    {tab === 'overview' && (
                        <>
                            {/* ── Clickable Stat Cards ── */}
                            <div className="edu-stats-row">
                                <StatCard icon={Users} label="Total DEOs" value={DISTRICT.totalZones} sub="Click to view all DEOs" color="#3b82f6" active={drilldown === 'deos'} onClick={() => toggleDrill('deos')} />
                                <StatCard icon={Building2} label="Total Schools" value={DISTRICT.totalSchools.toLocaleString()} sub="Click to view schools" color="#8b5cf6" active={drilldown === 'schools'} onClick={() => toggleDrill('schools')} />
                                <StatCard icon={GraduationCap} label="Total Students" value={DISTRICT.totalStudents.toLocaleString()} sub="Click to view students" color="#10b981" active={drilldown === 'students'} onClick={() => toggleDrill('students')} />
                                <StatCard icon={BookOpen} label="Total Teachers" value={DISTRICT.totalTeachers.toLocaleString()} sub="Click to view teachers" color="#f59e0b" active={drilldown === 'teachers'} onClick={() => toggleDrill('teachers')} />
                                <StatCard icon={Award} label="Literacy Rate" value={DISTRICT.literacy} sub="District Average" color="#ef4444" />
                                <StatCard icon={TrendingUp} label="SSLC Pass %" value="97.2%" sub="2024–25" color="#06b6d4" />
                            </div>

                            {/* ── Drill-Down Panels ── */}
                            {drilldown === 'deos' && <DeoDrillDown assignments={assignments} onClose={() => setDrilldown(null)} />}
                            {drilldown === 'schools' && <SchoolsDrillDown onClose={() => setDrilldown(null)} />}
                            {drilldown === 'students' && <StudentsDrillDown onClose={() => setDrilldown(null)} />}
                            {drilldown === 'teachers' && <TeachersDrillDown onClose={() => setDrilldown(null)} />}

                            {/* Zone breakdown table */}
                            <div className="edu-card">
                                <div className="edu-card-header">
                                    <h3>Zone-wise Summary</h3>
                                    <button className="edu-tag-btn" onClick={() => setTab('zones')}>View Analytics</button>
                                </div>
                                <table className="edu-table">
                                    <thead><tr><th>Zone</th><th>DEO Status</th><th>Schools</th><th>Students</th><th>HMs</th></tr></thead>
                                    <tbody>
                                        {ZONES.map((z, i) => {
                                            const deo = allDeos[i];
                                            return (
                                                <tr key={z.id}>
                                                    <td className="fw-500">{z.name}</td>
                                                    <td>
                                                        <span className={`edu-badge ${assignments[z.name] ? 'green' : 'amber'}`}>
                                                            {assignments[z.name] ? '✓ Complete' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td>{z.schools}</td>
                                                    <td>{z.students.toLocaleString()}</td>
                                                    <td>{z.headmasters}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Recent activity */}
                            <div className="edu-card">
                                <h3 className="edu-card-title">Recent Activity</h3>
                                <div className="edu-activity">
                                    {activity.map((act, i) => (
                                        <div key={i} className={`act-item ${act.type}`}>
                                            <div className="act-dot" />
                                            <div className="act-content">
                                                <div className="act-msg">{act.msg}</div>
                                                <div className="act-time">{act.t}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══════════════ DEO MANAGEMENT ═══════════════ */}
                    {tab === 'deos' && (
                        <div className="edu-card">
                            <div className="edu-card-header">
                                <h3>DEO Roster – All Zones</h3>
                                <span className="edu-tag-info">{allDeos.filter(d => d.isAssigned).length}/{allDeos.length} Assigned</span>
                            </div>
                            <table className="edu-table">
                                <thead><tr><th>Name</th><th>Username</th><th>Contact</th><th>Assigned Zone</th><th>Schools</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {allDeos.map(deo => (
                                        <tr key={deo.id}>
                                            <td>
                                                <div className="edu-name-cell">
                                                    <div className="edu-av blue">{deo.name[0]}</div>
                                                    {deo.name}
                                                </div>
                                            </td>
                                            <td className="mono">{deo.username}</td>
                                            <td>
                                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                    <div><Phone size={10} style={{ marginRight: 3 }} />{deo.phone}</div>
                                                    <div><Mail size={10} style={{ marginRight: 3 }} />{deo.email}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {deo.assignedZone
                                                    ? <span style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>{deo.assignedZone}</span>
                                                    : <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Not assigned</span>}
                                            </td>
                                            <td>{deo.schools || 0}</td>
                                            <td>
                                                <span className={`edu-badge ${Object.values(assignments).includes(deo.name) ? 'green' : 'amber'}`}>
                                                    {Object.values(assignments).includes(deo.name) ? 'Complete' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="edu-assign-btn" onClick={() => setAssigningDeo(deo)}>
                                                    <Edit3 size={13} /> {deo.isAssigned ? 'Reassign' : 'Assign'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ═══════════════ SCHOOLS ═══════════════ */}
                    {tab === 'schools' && <SchoolsDrillDown onClose={() => setTab('overview')} />}

                    {/* ═══════════════ ZONES ═══════════════ */}
                    {tab === 'zones' && (
                        <div className="edu-zones-grid">
                            {ZONES.map((z, i) => {
                                const deo = allDeos[i];
                                const passRate = [94.2, 91.7, 96.3, 88.4, 89.9][i];
                                const zoneSchools = ALL_SCHOOLS.filter(s => s.zoneId === z.id);
                                return (
                                    <div key={z.id} className="edu-zone-card">
                                        <div className="zone-card-header">
                                            <MapPin size={18} color="#3b82f6" />
                                            <h4>{z.name}</h4>
                                        </div>
                                        <div className="zone-stats">
                                            <div><span>Schools</span><strong>{z.schools}</strong></div>
                                            <div><span>Students</span><strong>{z.students.toLocaleString()}</strong></div>
                                            <div><span>HMs</span><strong>{z.headmasters}</strong></div>
                                        </div>
                                        {zoneSchools.length > 0 && (
                                            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
                                                <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: '#1e293b', fontSize: '0.8rem' }}>Sample Schools</div>
                                                {zoneSchools.slice(0, 3).map(s => (
                                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px dashed #e2e8f0' }}>
                                                        <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                                                        <span style={{ fontWeight: 700, color: perfColor(s.performance) }}>{s.performance}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="zone-deo-row">
                                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>DEO:</span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: deo?.isAssigned ? '#0f172a' : '#94a3b8' }}>
                                                {deo?.name} {!deo?.isAssigned && '(Pending)'}
                                            </span>
                                        </div>
                                        <div className="zone-pass">
                                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Avg Pass Rate:</span>
                                            <span style={{ fontWeight: 700, color: passRate >= 92 ? '#10b981' : '#f59e0b' }}>{passRate}%</span>
                                        </div>
                                        <div className="edu-progress" style={{ marginTop: '0.5rem' }}>
                                            <div className="edu-progress-bar" style={{ width: `${passRate}%`, background: passRate >= 92 ? '#10b981' : '#f59e0b' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {tab === 'taskAssign' && (
                        <TaskAssignPanel user={user} role="CEO" department="EDUCATION" accentColor="#3b82f6" />
                    )}
                    {tab === 'taskStatus' && (
                        <TaskStatusPanel user={user} role="CEO" department="EDUCATION" accentColor="#3b82f6" />
                    )}
                    {tab === 'settings' && <SettingsTab user={user} />}
                </div>
            </main>

            {/* Assign Modal */}
            {assigningDeo && (
                <AssignModal
                    deo={assigningDeo}
                    onClose={() => setAssigningDeo(null)}
                    onSave={(data) => handleAssign(data)}
                />
            )}
        </div>
    );
};

export default CEODashboard;
