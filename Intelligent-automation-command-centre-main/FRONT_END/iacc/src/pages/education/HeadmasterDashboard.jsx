import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, Users, BookOpen, Award, Bell, LogOut,
    BarChart2, CheckCircle2, Clock, TrendingUp, Layers,
    MapPin, Phone, Mail, Building2, Search, Settings, ClipboardList, Activity
} from 'lucide-react';
import {
    HM_SCHOOL, HEADMASTERS, CLASS_STRUCTURE, generateStudents
} from '../../data/educationData';
import { useEducationStore } from '../../data/educationStore';
import NotificationBell from '../../components/education/NotificationBell';
import { TaskAssignPanel, TaskStatusPanel, MemberTasksPanel } from '../../components/education/EduTaskPanels';
import './EducationDashboard.css';


// ─── Stat Card ────────────────────────────────────────────────────────────────
const Stat = ({ icon: Icon, label, value, sub, color }) => (
    <div className="edu-stat-card" style={{ '--c': color }}>
        <div className="edu-stat-icon" style={{ background: `${color}18` }}><Icon size={24} color={color} /></div>
        <div><div className="edu-stat-value">{value}</div><div className="edu-stat-label">{label}</div>{sub && <div className="edu-stat-sub">{sub}</div>}</div>
    </div>
);

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ students = [], teachers = [] }) => {
    const totalStudents = (students || []).length;
    const totalBoys = (students || []).filter(s => s.gender === 'Male').length;
    const totalGirls = (students || []).filter(s => s.gender === 'Female').length;
    const presentToday = (students || []).filter(s => s.attendance >= 75).length; // Simulated "present" for today

    return (
        <>
            {/* School Info Card */}
            <div className="edu-card school-info-card">
                <div className="school-info-left">
                    <div className="school-emblem"><GraduationCap size={40} color="#3b82f6" /></div>
                    <div>
                        <div className="school-full-name">{HM_SCHOOL.name}</div>
                        <div className="school-code">UDISE: {HM_SCHOOL.udise} &nbsp;·&nbsp; Code: {HM_SCHOOL.code}</div>
                        <div className="school-address"><MapPin size={13} />{HM_SCHOOL.address}</div>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}><Phone size={11} style={{ marginRight: 3 }} />{HM_SCHOOL.phone}</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}><Mail size={11} style={{ marginRight: 3 }} />{HM_SCHOOL.email}</span>
                        </div>
                    </div>
                </div>
                <div className="school-info-meta">
                    <div className="school-meta-item"><span>Est.</span><strong>{HM_SCHOOL.estd}</strong></div>
                    <div className="school-meta-item"><span>Type</span><strong>{HM_SCHOOL.type}</strong></div>
                    <div className="school-meta-item"><span>Medium</span><strong>{HM_SCHOOL.medium}</strong></div>
                    <div className="school-meta-item"><span>Aid Status</span><strong>{HM_SCHOOL.aidStatus}</strong></div>
                    <div className="school-meta-item"><span>Zone</span><strong>{HM_SCHOOL.zone}</strong></div>
                    <div className="school-meta-item"><span>DEO</span><strong>{HM_SCHOOL.deo}</strong></div>
                </div>
            </div>

            {/* Stats */}
            <div className="edu-stats-row">
                <Stat icon={Users} label="Total Students" value={totalStudents.toLocaleString()} sub={`${totalBoys}B · ${totalGirls}G`} color="#3b82f6" />
                <Stat icon={BookOpen} label="Teachers" value={HM_SCHOOL.totalTeachers} sub="PG + BT + Special" color="#10b981" />
                <Stat icon={Layers} label="Classes" value={CLASS_STRUCTURE.length} sub="Std VI to XII" color="#8b5cf6" />
                <Stat icon={CheckCircle2} label="Present Today" value={presentToday} sub={`${((presentToday / totalStudents) * 100).toFixed(1)}% Attendance`} color="#10b981" />
                <Stat icon={Award} label="SSLC Pass %" value={HM_SCHOOL.lastBoardResult.sslcPass} sub="2024–25" color="#f59e0b" />
                <Stat icon={TrendingUp} label="District Rank" value={`#${HM_SCHOOL.lastBoardResult.districtRank}`} sub="In Namakkal" color="#ef4444" />
            </div>

            {/* Class-wise summary table */}
            <div className="edu-card">
                <div className="edu-card-header"><h3>Class-wise Strength Summary</h3></div>
                <table className="edu-table">
                    <thead>
                        <tr><th>Class</th><th>Section / Stream</th><th>Boys</th><th>Girls</th><th>Total</th><th>Class Teacher</th></tr>
                    </thead>
                    <tbody>
                        {CLASS_STRUCTURE.map((c, i) => {
                            return (
                                <tr key={i}>
                                    <td className="fw-500">Std {c.grade}</td>
                                    <td><span className="edu-badge blue">{c.section}{c.stream ? ` (${c.stream})` : ''}</span></td>
                                    <td style={{ color: '#3b82f6', fontWeight: 600 }}>{c.boys}</td>
                                    <td style={{ color: '#ec4899', fontWeight: 600 }}>{c.girls}</td>
                                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.strength}</td>
                                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{teachers.find(t => t.id === c.classTeacher)?.name || '—'}</td>
                                </tr>
                            );
                        })}
                        <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                            <td>Total</td><td>—</td>
                            <td style={{ color: '#3b82f6' }}>{CLASS_STRUCTURE.reduce((s, c) => s + c.boys, 0)}</td>
                            <td style={{ color: '#ec4899' }}>{CLASS_STRUCTURE.reduce((s, c) => s + c.girls, 0)}</td>
                            <td style={{ color: '#0f172a' }}>{CLASS_STRUCTURE.reduce((s, c) => s + c.strength, 0)}</td>
                            <td>—</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ─── Teachers Tab ─────────────────────────────────────────────────────────────
const TeachersTab = ({ teachers = [], onToggleStatus }) => {
    const [search, setSearch] = useState('');
    const filtered = (teachers || []).filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="edu-card">
            <div className="edu-card-header">
                <h3>Teaching Staff – {(teachers || []).length} Members</h3>
                <div className="search-box">
                    <Search size={14} />
                    <input placeholder="Search by name or subject…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
            <table className="edu-table">
                <thead>
                    <tr><th>Staff ID</th><th>Name</th><th>Subject</th><th>Classes Assigned</th><th>Designation</th><th>Qualification</th><th>Experience</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {filtered.map((t, i) => (
                        <tr key={t.id}>
                            <td className="mono" style={{ fontSize: '0.72rem' }}>{t.id}</td>
                            <td>
                                <div className="edu-name-cell">
                                    <div className="edu-av" style={{ background: t.status === 'on-leave' ? '#fee2e2' : 'linear-gradient(135deg,#3b82f6,#6366f1)', color: t.status === 'on-leave' ? '#ef4444' : '#fff', fontSize: '0.75rem', fontWeight: 700, width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <span className="fw-500">{t.name}</span>
                                </div>
                            </td>
                            <td>
                                <span className="edu-badge blue" style={{ fontSize: '0.75rem' }}>{t.subject}</span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '180px' }}>
                                    {t.classes.map((c, ci) => (
                                        <span key={ci} className="class-tag">{c}</span>
                                    ))}
                                </div>
                            </td>
                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.designation}</td>
                            <td style={{ fontSize: '0.78rem', color: '#475569' }}>{t.qualification}</td>
                            <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.experience} yrs</td>
                            <td>
                                <button
                                    className={`edu-badge ${t.status === 'active' ? 'green' : 'amber'}`}
                                    onClick={() => onToggleStatus(t.id, t.status === 'active' ? 'on-leave' : 'active')}
                                    style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                >
                                    {t.status === 'active' ? 'Active' : 'On Leave'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ─── Students Tab (Class-wise) ────────────────────────────────────────────────
const StudentsTab = ({ students = [] }) => {
    const [filterGrade, setFilterGrade] = useState('All');
    const [filterGender, setFilterGender] = useState('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 50;

    const grades = ['All', ...Array.from(new Set(CLASS_STRUCTURE.map(c => String(c.grade))))];

    const filtered = useMemo(() => (students || []).filter(s => {
        const gMatch = filterGrade === 'All' || String(s.grade) === filterGrade;
        const genMatch = filterGender === 'All' || s.gender === filterGender;
        const sMatch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search);
        return gMatch && genMatch && sMatch;
    }), [students, filterGrade, filterGender, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            {/* Gender summary bar */}
            <div className="gender-summary-row">
                <div className="gender-card boys">
                    <div className="gender-count">{(students || []).filter(s => s.gender === 'Male').length}</div>
                    <div className="gender-label">Boys</div>
                </div>
                <div className="gender-card girls">
                    <div className="gender-count">{(students || []).filter(s => s.gender === 'Female').length}</div>
                    <div className="gender-label">Girls</div>
                </div>
                <div className="gender-card total">
                    <div className="gender-count">{students.length}</div>
                    <div className="gender-label">Total Students</div>
                </div>
            </div>

            <div className="edu-card">
                <div className="edu-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h3>Student Records – {filtered.length} students</h3>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="search-box">
                            <Search size={14} />
                            <input placeholder="Name / Roll No…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                        <select className="filter-select" value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setPage(1); }}>
                            {grades.map(g => <option key={g} value={g}>Std {g}</option>)}
                        </select>
                        <select className="filter-select" value={filterGender} onChange={e => { setFilterGender(e.target.value); setPage(1); }}>
                            <option value="All">All Genders</option>
                            <option value="Male">Boys</option>
                            <option value="Female">Girls</option>
                        </select>
                    </div>
                </div>

                <table className="edu-table">
                    <thead>
                        <tr><th>Roll No.</th><th>Name</th><th>Class</th><th>Section</th><th>Gender</th><th>Attendance%</th><th>Tamil</th><th>English</th><th>Maths</th><th>Science</th><th>Social</th></tr>
                    </thead>
                    <tbody>
                        {paginated.map((s, i) => (
                            <tr key={i}>
                                <td className="mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.rollNo}</td>
                                <td className="fw-500">{s.name}</td>
                                <td style={{ fontSize: '0.8rem' }}>Std {s.grade}</td>
                                <td><span className="class-tag">{s.section}</span></td>
                                <td>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.gender === 'Male' ? '#3b82f6' : '#ec4899' }}>
                                        {s.gender === 'Male' ? '♂ Boy' : '♀ Girl'}
                                    </span>
                                </td>
                                <td>
                                    <div className="edu-progress mini">
                                        <div className="edu-progress-bar" style={{ width: `${s.attendance}%`, background: s.attendance >= 85 ? '#10b981' : s.attendance >= 75 ? '#f59e0b' : '#ef4444' }} />
                                        <span style={{ fontSize: '0.75rem' }}>{s.attendance}%</span>
                                    </div>
                                </td>
                                <td className={`score ${s.tamil >= 70 ? 'good' : s.tamil >= 50 ? 'avg' : 'low'}`}>{s.tamil}</td>
                                <td className={`score ${s.english >= 70 ? 'good' : s.english >= 50 ? 'avg' : 'low'}`}>{s.english}</td>
                                <td className={`score ${s.maths >= 70 ? 'good' : s.maths >= 50 ? 'avg' : 'low'}`}>{s.maths}</td>
                                <td className={`score ${s.science >= 70 ? 'good' : s.science >= 50 ? 'avg' : 'low'}`}>{s.science}</td>
                                <td className={`score ${s.social >= 70 ? 'good' : s.social >= 50 ? 'avg' : 'low'}`}>{s.social}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="edu-pagination">
                    <span className="pag-info">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                    <div className="pag-btns">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const p = page <= 3 ? i + 1 : page - 2 + i;
                            if (p < 1 || p > totalPages) return null;
                            return <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>;
                        })}
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Performance Tab ──────────────────────────────────────────────────────────
const PerformanceTab = ({ students }) => {
    const classPerf = CLASS_STRUCTURE.map(c => {
        const classStudents = students.filter(s => s.grade === c.grade && s.section === c.section);
        if (!classStudents.length) return { ...c, avg: 0 };
        const avg = s => Math.round((s.tamil + s.english + s.maths + s.science + s.social) / 5);
        const classAvg = Math.round(classStudents.reduce((sum, s) => sum + avg(s), 0) / classStudents.length);
        const passed = classStudents.filter(s => s.tamil >= 35 && s.english >= 35 && s.maths >= 35 && s.science >= 35 && s.social >= 35).length;
        return { ...c, avgScore: classAvg, passRate: Math.round((passed / classStudents.length) * 100) };
    });

    return (
        <>
            {/* Board Results */}
            <div className="edu-card">
                <h3 className="edu-card-title">Board Examination Results – 2024–25</h3>
                <div className="board-cards">
                    <div className="board-card green">
                        <div className="board-val">{HM_SCHOOL.lastBoardResult.sslcPass}</div>
                        <div className="board-lbl">SSLC (Std X) Pass Rate</div>
                        <div className="board-sub">Class X – 107/107 students passed</div>
                    </div>
                    <div className="board-card blue">
                        <div className="board-val">{HM_SCHOOL.lastBoardResult.hscPass}</div>
                        <div className="board-lbl">HSC (Std XII) Pass Rate</div>
                        <div className="board-sub">Class XII – 157/167 students passed</div>
                    </div>
                    <div className="board-card purple">
                        <div className="board-val">#{HM_SCHOOL.lastBoardResult.districtRank}</div>
                        <div className="board-lbl">District Rank</div>
                        <div className="board-sub">Among 74 schools in Namakkal Town Zone</div>
                    </div>
                </div>
            </div>

            {/* Class-wise performance */}
            <div className="edu-card">
                <h3 className="edu-card-title">Class-wise Internal Performance</h3>
                <table className="edu-table">
                    <thead><tr><th>Class</th><th>Section</th><th>Strength</th><th>Avg Score</th><th>Pass Rate</th><th>Status</th></tr></thead>
                    <tbody>
                        {classPerf.map((c, i) => (
                            <tr key={i}>
                                <td className="fw-500">Std {c.grade}</td>
                                <td><span className="edu-badge blue">{c.section}</span></td>
                                <td>{c.strength}</td>
                                <td>
                                    <span style={{ fontWeight: 700, color: c.avgScore >= 70 ? '#10b981' : c.avgScore >= 55 ? '#f59e0b' : '#ef4444' }}>
                                        {c.avgScore}/100
                                    </span>
                                </td>
                                <td>
                                    <div className="edu-progress">
                                        <div className="edu-progress-bar" style={{ width: `${c.passRate}%`, background: c.passRate >= 90 ? '#10b981' : c.passRate >= 75 ? '#f59e0b' : '#ef4444' }} />
                                        <span>{c.passRate}%</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`edu-badge ${c.passRate >= 90 ? 'green' : c.passRate >= 75 ? 'amber' : 'red'}`}>
                                        {c.passRate >= 90 ? 'Excellent' : c.passRate >= 75 ? 'Good' : 'Needs Attention'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ─── Settings Tab ─────────────────────────────────────────────────────────────
const SettingsTab = ({ hm }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div className="edu-card" style={{ padding: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="edu-avatar purple-av" style={{ width: '5rem', height: '5rem', fontSize: '2rem', margin: '0 auto 1rem' }}>{hm.name[0]}</div>
                    <h3 style={{ margin: 0 }}>{hm.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Headmaster · {hm.school}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Staff ID</span>
                        <span className="fw-500">{hm.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Department</span>
                        <span className="fw-500">Education</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Experience</span>
                        <span className="fw-500">{hm.experience} Years</span>
                    </div>
                </div>
            </div>

            <div className="edu-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="edu-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Mobile Number</label>
                        <input type="text" className="edu-input" defaultValue={hm.phone || "+91 94421-XXXXX"} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                    </div>
                    <div className="form-group">
                        <label className="edu-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                        <input type="text" className="edu-input" defaultValue={hm.email || (hm.name.toLowerCase().replace(' ', '.') + '@tn.school.in')} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                    </div>
                </div>

                <h3 style={{ margin: '2rem 0 1rem' }}>Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Notifications</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Receive daily summaries of class activity</div>
                        </div>
                        <div style={{ width: '2.5rem', height: '1.25rem', background: '#8b5cf6', borderRadius: '1rem', position: 'relative' }}>
                            <div style={{ width: '1rem', height: '1rem', background: 'white', borderRadius: '50%', position: 'absolute', right: '0.125rem', top: '0.125rem' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>SMS Alerts</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Urgent alerts for attendance or performance issues</div>
                        </div>
                        <div style={{ width: '2.5rem', height: '1.25rem', background: '#cbd5e1', borderRadius: '1rem', position: 'relative' }}>
                            <div style={{ width: '1rem', height: '1rem', background: 'white', borderRadius: '50%', position: 'absolute', left: '0.125rem', top: '0.125rem' }} />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="edu-tag-btn" style={{ background: '#8b5cf6', color: 'white' }}>Save Changes</button>
                    <button className="edu-tag-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Headmaster Dashboard ────────────────────────────────────────────────
const HeadmasterDashboard = () => {
    const navigate = useNavigate();
    const { students: rawStudents, teachers: rawTeachers, updateTeacherStatus } = useEducationStore();
    // Safe defaults — store may not be hydrated yet on first render
    const students = rawStudents || [];
    const teachers = rawTeachers || [];
    const safeUpdateTeacherStatus = updateTeacherStatus || (() => { });
    const [tab, setTab] = useState('overview');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const tabs = [
        { id: 'overview', label: 'School Overview', icon: Building2 },
        { id: 'teachers', label: 'Teachers', icon: BookOpen },
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'performance', label: 'Performance', icon: BarChart2 },
        { id: 'taskAssign', label: 'Task Assign', icon: ClipboardList },
        { id: 'taskStatus', label: 'Task Status', icon: Activity },
        { id: 'myTasks', label: 'My Tasks', icon: CheckCircle2 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const hmInfo = HEADMASTERS.find(h => h.username === user.username) || HEADMASTERS[0];

    return (
        <div className="edu-dashboard">
            {/* Sidebar */}
            <aside className="edu-sidebar purple">
                <div className="edu-brand">
                    <div className="edu-logo purple-logo"><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">GHS Namakkal</div>
                        <div className="edu-brand-sys">Headmaster Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag purple-tag">Headmaster – School Admin</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'active purple-active' : ''}`} onClick={() => setTab(t.id)}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar purple-av">{user?.username?.[0]?.toUpperCase() || 'H'}</div>
                        <div>
                            <div className="edu-username">{user?.username || 'testHM1'}</div>
                            <div className="edu-userrole">Headmaster</div>
                        </div>
                    </div>
                    <button className="edu-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="edu-main">
                <header className="edu-topbar">
                    <div>
                        <div className="edu-breadcrumb">Education · Headmaster · GHS Namakkal Main</div>
                        <h1 className="edu-page-title">{tabs.find(t => t.id === tab)?.label}</h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill purple"><Building2 size={12} />School Admin</div>
                        <NotificationBell username={hmInfo?.name || user?.username || ''} accentColor="#8b5cf6" />
                    </div>
                </header>

                <div className="edu-hero purple-hero">
                    <div className="hero-l">
                        <Building2 size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">{HM_SCHOOL.name}</div>
                            <div className="hero-sub">UDISE: {HM_SCHOOL.udise} · Est. {HM_SCHOOL.estd} · {HM_SCHOOL.aidStatus}</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><Award size={13} />District Rank #{HM_SCHOOL.lastBoardResult.districtRank}</span>
                        <span><CheckCircle2 size={13} />{students.length} Students</span>
                    </div>
                </div>

                <div className="edu-content">
                    {tab === 'overview' && <OverviewTab students={students} teachers={teachers} />}
                    {tab === 'teachers' && <TeachersTab teachers={teachers} onToggleStatus={updateTeacherStatus} />}
                    {tab === 'students' && <StudentsTab students={students} />}
                    {tab === 'performance' && <PerformanceTab students={students} />}
                    {tab === 'taskAssign' && (
                        <TaskAssignPanel
                            user={{ username: hmInfo?.name || user?.username || 'Headmaster' }}
                            role="HEADMASTER"
                            department="EDUCATION"
                            accentColor="#8b5cf6"
                        />
                    )}
                    {tab === 'taskStatus' && (
                        <TaskStatusPanel
                            user={{ username: hmInfo?.name || user?.username || 'Headmaster' }}
                            role="HEADMASTER"
                            department="EDUCATION"
                            accentColor="#8b5cf6"
                        />
                    )}
                    {tab === 'myTasks' && (
                        <MemberTasksPanel
                            user={user}
                            role="HEADMASTER"
                            memberName={hmInfo?.name || user?.username || ''}
                            accentColor="#8b5cf6"
                        />
                    )}
                    {tab === 'settings' && <SettingsTab hm={hmInfo} />}
                </div>
            </main>
        </div>
    );
};

export default HeadmasterDashboard;
