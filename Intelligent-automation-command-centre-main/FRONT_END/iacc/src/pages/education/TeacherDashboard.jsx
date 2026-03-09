import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, Users, BookOpen, CheckCircle2,
    Calendar, Clock, FileText, Bell, LogOut,
    Search, Award, Plus, Activity, Bot, AlertTriangle,
    Settings, Home, User, UserCheck, ArrowRight, ClipboardList
} from 'lucide-react';
import {
    HM_SCHOOL, CLASS_STRUCTURE, TEACHERS, generateStudents
} from '../../data/educationData';
import { useEducationStore } from '../../data/educationStore';
import NotificationBell from '../../components/education/NotificationBell';
import { MemberTasksPanel } from '../../components/education/EduTaskPanels';
import './EducationDashboard.css';


function seededRand(index, min, max) {
    const x = Math.sin(index * 9301 + 49297) * 49297;
    const r = x - Math.floor(x);
    return Math.floor(r * (max - min + 1)) + min;
}

// ─── Helper: pick a teacher identity from localStorage ────────────────────────
function getMyTeacher(user) {
    // Select teacher based on username or just pick a default one for now
    const match = (user?.username || '').match(/\d+/);
    const idx = match ? parseInt(match[0], 10) - 1 : 0;
    return TEACHERS[Math.min(idx, TEACHERS.length - 1)] || TEACHERS[0];
}

// ─── Stat Card (edu-style) ────────────────────────────────────────────────────
const Stat = ({ icon: Icon, label, value, sub, color, onClick }) => (
    <div className="edu-stat-card" style={{ '--c': color, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s' }} onClick={onClick} title={onClick ? `Go to ${label}` : undefined}>
        <div className="edu-stat-icon" style={{ background: `${color}18` }}><Icon size={24} color={color} /></div>
        <div>
            <div className="edu-stat-value">{value}</div>
            <div className="edu-stat-label">{label}</div>
            {sub && <div className="edu-stat-sub">{sub}</div>}
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 1 — Overview (Class Stats + Recent Activity)
// ═══════════════════════════════════════════════════════════════════════════════
const OverviewTab = ({ teacher, students, onNavigate }) => {
    const classAvg = Math.round(students.reduce((s, st) => s + (st.tamil + st.english + st.maths + st.science + st.social) / 5, 0) / students.length);
    const attendancePct = Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length);

    const recentActivity = [
        { time: '1h ago', action: 'New assignment created: "Maths - Geometry Basic"', type: 'task', status: 'done', navigateTo: 'tasks' },
        { time: '3h ago', action: 'Attendance marked for Class 10A', type: 'member', status: 'done', navigateTo: 'attendance' },
        { time: 'Yesterday', action: '5 students submitted Tamil Essay', type: 'task', status: 'pending', navigateTo: 'tasks' },
        { time: '2 days ago', action: 'Alert: 3 students have attendance < 80%', type: 'alert', status: 'alert', navigateTo: 'attendance' },
    ];

    const actIcons = { task: Clock, bot: Bot, member: User, alert: AlertTriangle, report: FileText };
    const actColors = { pending: '#f59e0b', done: '#10b981', alert: '#ef4444' };

    return (
        <>
            <div className="edu-stats-row">
                <Stat icon={Users} label="Total Students" value={students.length} sub={`Class ${teacher.subject} teacher`} color="#3b82f6" onClick={() => onNavigate('students')} />
                <Stat icon={CheckCircle2} label="Avg Attendance" value={`${attendancePct}%`} sub="Current Term" color="#10b981" onClick={() => onNavigate('attendance')} />
                <Stat icon={Award} label="Class Average" value={`${classAvg}%`} sub="Internal Exams" color="#8b5cf6" onClick={() => onNavigate('students')} />
                <Stat icon={AlertTriangle} label="Pending Tasks" value="4" sub="To review" color="#ef4444" onClick={() => onNavigate('tasks')} />
            </div>

            <div className="edu-card school-info-card" style={{ marginBottom: '1.25rem' }}>
                <div className="school-info-left" style={{ padding: '1.25rem' }}>
                    <div className="edu-avatar" style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.5rem', borderRadius: '1rem' }}>{teacher.name[0]}</div>
                    <div style={{ marginLeft: '1rem' }}>
                        <div className="edu-username" style={{ fontSize: '1.2rem', color: '#0f172a' }}>{teacher.name}</div>
                        <div className="edu-userrole" style={{ fontSize: '0.85rem' }}>{teacher.qualification} · {teacher.experience} Years Experience</div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}><BookOpen size={12} style={{ marginRight: 4 }} />{teacher.subject} Specialist</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}><GraduationCap size={12} style={{ marginRight: 4 }} />Handling {teacher.classes?.join(', ') || 'Assigned Classes'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                <div className="edu-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Recent Class Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {recentActivity.map((item, i) => {
                            const Icon = actIcons[item.type];
                            return (
                                <div key={i}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                                    onClick={() => onNavigate(item.navigateTo)}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: actColors[item.status], marginTop: 6, flexShrink: 0 }} />
                                    <Icon size={16} color={actColors[item.status]} style={{ marginTop: 2 }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>{item.action}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.time}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="edu-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Teaching Assistant Bot</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Attendance Automator', status: 'running', stats: 'Synced today' },
                            { name: 'Grade Analyzer', status: 'idle', stats: 'Last used 1d ago' },
                            { name: 'Assignment Planner', status: 'running', stats: 'Updated 2h ago' }
                        ].map((bot, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                                <Bot size={20} color={bot.status === 'running' ? '#10b981' : '#94a3b8'} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{bot.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{bot.stats}</div>
                                </div>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: bot.status === 'running' ? '#10b981' : '#cbd5e1' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 2 — My Students
// ═══════════════════════════════════════════════════════════════════════════════
const StudentsTab = ({ students, onUpdateAttendance }) => {
    return (
        <div className="edu-card">
            <div className="edu-card-header">
                <h3>Students Management</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="edu-tag-info" style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
                        {students.length} Students Assigned
                    </div>
                </div>
            </div>
            <table className="edu-table">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Gender</th>
                        <th>Attendance</th>
                        <th>Avg. Marks</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, i) => {
                        const avg = Math.round((s.tamil + s.english + s.maths + s.science + s.social) / 5);
                        return (
                            <tr key={i}>
                                <td className="mono" style={{ fontSize: '0.75rem' }}>{s.rollNo}</td>
                                <td>
                                    <div className="edu-name-cell">
                                        <div className="edu-av" style={{ width: '1.8rem', height: '1.8rem', fontSize: '0.7rem' }}>{s.name[0]}</div>
                                        <span className="fw-500">{s.name}</span>
                                    </div>
                                </td>
                                <td><span style={{ color: s.gender === 'Male' ? '#3b82f6' : '#ec4899', fontSize: '0.8rem', fontWeight: 600 }}>{s.gender === 'Male' ? '♂' : '♀'}</span></td>
                                <td>
                                    <div className="edu-progress" style={{ minWidth: '80px', cursor: 'pointer' }} onClick={() => {
                                        const newAtt = prompt(`Enter new attendance for ${s.name}:`, s.attendance);
                                        if (newAtt !== null) onUpdateAttendance(s.rollNo, parseInt(newAtt, 10));
                                    }}>
                                        <div className="edu-progress-bar" style={{ width: `${s.attendance}%`, background: s.attendance >= 80 ? '#10b981' : '#f59e0b' }} />
                                        <span>{s.attendance}%</span>
                                    </div>
                                </td>
                                <td><b>{avg}%</b></td>
                                <td><span className={`edu-badge ${avg >= 40 ? 'green' : 'red'}`}>{avg >= 40 ? 'Passed' : 'At Risk'}</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 3 — Tasks & Assignments
// ═══════════════════════════════════════════════════════════════════════════════
const TasksTab = ({ onManage }) => {
    const tasks = [
        { id: 101, title: 'English Poetry Essay', due: '2026-03-01', submissions: '24/30', status: 'active' },
        { id: 102, title: 'Maths - Statistics Quiz', due: '2026-03-05', submissions: '0/30', status: 'draft' },
        { id: 103, title: 'Science Project Submission', due: '2026-02-20', submissions: '28/30', status: 'grading' },
        { id: 104, title: 'Term 1 History Report', due: '2026-02-15', submissions: '30/30', status: 'completed' },
    ];

    return (
        <div className="edu-card">
            <div className="edu-card-header">
                <h3>Assignments & Homework</h3>
                <button className="edu-tag-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Plus size={14} /> New Assignment
                </button>
            </div>
            <table className="edu-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Submissions</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t) => (
                        <tr key={t.id}>
                            <td className="mono" style={{ fontSize: '0.72rem' }}>#{t.id}</td>
                            <td className="fw-500">{t.title}</td>
                            <td>{t.due}</td>
                            <td>{t.submissions}</td>
                            <td>
                                <span className={`edu-badge ${t.status === 'active' ? 'blue' :
                                    t.status === 'grading' ? 'amber' :
                                        t.status === 'completed' ? 'green' : 'red'
                                    }`}>{t.status}</span>
                            </td>
                            <td><button className="edu-assign-btn" onClick={() => onManage(t)}>Manage</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  Assignment Detail (Submission View)
// ═══════════════════════════════════════════════════════════════════════════════
const AssignmentDetail = ({ assignment, students, onBack }) => {
    return (
        <div className="edu-detail-view">
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="edu-icon-btn" onClick={onBack} style={{ background: '#f8fafc' }}>
                    <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assignments / Detail</div>
                    <h2 style={{ margin: 0 }}>{assignment.title}</h2>
                </div>
            </div>

            <div className="edu-stats-row" style={{ marginBottom: '1.5rem' }}>
                <Stat icon={Users} label="Target Students" value="30" color="#3b82f6" />
                <Stat icon={CheckCircle2} label="Submissions" value={assignment.submissions} color="#10b981" />
                <Stat icon={Clock} label="Due Date" value={assignment.due} color="#f59e0b" />
                <Stat icon={Activity} label="Status" value={assignment.status.toUpperCase()} color="#8b5cf6" />
            </div>

            <div className="edu-card">
                <div className="edu-card-header">
                    <h3>Student Submissions</h3>
                    <div className="edu-badge-pill blue"><Search size={12} /> Filter Students</div>
                </div>
                <table className="edu-table">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Submitted On</th>
                            <th>Grade</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.slice(0, 10).map((s, i) => {
                            const isSubmitted = i < 7; // Mocked submission status
                            return (
                                <tr key={i}>
                                    <td className="mono">{s.rollNo}</td>
                                    <td>
                                        <div className="edu-name-cell">
                                            <div className="edu-av" style={{ width: '1.8rem', height: '1.8rem', fontSize: '0.7rem' }}>{s.name[0]}</div>
                                            <span className="fw-500">{s.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`edu-badge ${isSubmitted ? 'green' : 'amber'}`}>
                                            {isSubmitted ? 'Submitted' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>{isSubmitted ? '2026-02-20' : '—'}</td>
                                    <td>{isSubmitted ? <b>{seededRand(i, 60, 100)}%</b> : '—'}</td>
                                    <td><button className="edu-assign-btn">Review</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 4 — Schedule
// ═══════════════════════════════════════════════════════════════════════════════
const ScheduleTab = ({ teacher }) => {
    const schedule = [
        { time: '09:00 - 09:45', mon: 'Class 10A', tue: 'Class 10B', wed: 'Prep', thu: 'Class 10A', fri: 'Class 9C' },
        { time: '09:45 - 10:30', mon: 'Class 10C', tue: 'Prep', wed: 'Class 10A', thu: 'Class 10B', fri: 'Class 10A' },
        { time: 'Break', mon: '—', tue: '—', wed: '—', thu: '—', fri: '—' },
        { time: '10:45 - 11:30', mon: 'Class 9A', tue: 'Class 9A', wed: 'Class 9B', thu: 'Class 9B', fri: 'Class 10B' },
        { time: '11:30 - 12:15', mon: 'Lab', tue: 'Lab', wed: 'Prep', thu: 'Class 10C', fri: 'Class 10C' },
    ];

    return (
        <div className="edu-card">
            <div className="edu-card-header">
                <h3>Teaching Timetable</h3>
                <span className="edu-tag-info">{teacher.subject} Department</span>
            </div>
            <table className="edu-table" style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: '150px' }}>Time</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((row, i) => (
                        <tr key={i} style={row.time === 'Break' ? { background: '#f8fafc' } : {}}>
                            <td className="fw-500" style={{ fontSize: '0.75rem' }}>{row.time}</td>
                            {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => (
                                <td key={day} style={{ textAlign: 'center' }}>
                                    {row[day] !== '—' && row[day] !== 'Prep' && row[day] !== 'Lab' ? (
                                        <div style={{ padding: '0.4rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', color: '#1e40af', fontWeight: 600, fontSize: '0.75rem' }}>
                                            {row[day]}
                                        </div>
                                    ) : row[day] === 'Prep' || row[day] === 'Lab' ? (
                                        <div style={{ color: '#64748b', fontSize: '0.72rem', fontStyle: 'italic' }}>{row[day]}</div>
                                    ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 5 — Settings
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsTab = ({ teacher }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div className="edu-card" style={{ padding: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="edu-avatar green-av" style={{ width: '5rem', height: '5rem', fontSize: '2rem', margin: '0 auto 1rem' }}>{teacher.name[0]}</div>
                    <h3 style={{ margin: 0 }}>{teacher.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{teacher.designation}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Staff ID</span>
                        <span className="fw-500">{teacher.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Department</span>
                        <span className="fw-500">Education</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Experience</span>
                        <span className="fw-500">{teacher.experience} Years</span>
                    </div>
                </div>
            </div>

            <div className="edu-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="edu-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Mobile Number</label>
                        <input type="text" className="edu-input" defaultValue="+91 94421-XXXXX" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                    </div>
                    <div className="form-group">
                        <label className="edu-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                        <input type="text" className="edu-input" defaultValue={teacher.name.toLowerCase().replace(' ', '.') + '@tn.school.in'} style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                    </div>
                </div>

                <h3 style={{ margin: '2rem 0 1rem' }}>Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email Notifications</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Receive daily summaries of class activity</div>
                        </div>
                        <div style={{ width: '2.5rem', height: '1.25rem', background: '#10b981', borderRadius: '1rem', position: 'relative' }}>
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
                    <button className="edu-tag-btn" style={{ background: '#10b981', color: 'white' }}>Save Changes</button>
                    <button className="edu-tag-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN TEACHER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { students, updateStudentAttendance } = useEducationStore();
    const [tab, setTab] = useState('overview');
    const [managedAssignment, setManagedAssignment] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacher = getMyTeacher(user);

    // Get students assigned to this teacher (mocked as selecting a chunk of students)
    const myStudents = (students || []).slice(0, 30);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'students', label: 'My Students', icon: Users },
        { id: 'tasks', label: 'Assignments', icon: FileText },
        { id: 'myTasks', label: 'My Tasks', icon: ClipboardList },
        { id: 'schedule', label: 'Timetable', icon: Calendar },
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="edu-dashboard">
            <aside className="edu-sidebar">
                <div className="edu-brand">
                    <div className="edu-logo" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">Education Dept.</div>
                        <div className="edu-brand-sys">Teacher Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag green-tag">Teacher – {teacher.subject}</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'green-active' : ''}`} onClick={() => setTab(t.id)}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar green-av">{teacher.name?.[0] || 'T'}</div>
                        <div>
                            <div className="edu-username">{teacher.name || 'Teacher'}</div>
                            <div className="edu-userrole">Staff ID: {teacher.id || 'N/A'}</div>
                        </div>
                    </div>
                    <button className="edu-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            <main className="edu-main">
                <header className="edu-topbar">
                    <div>
                        <div className="edu-breadcrumb">Education · Teacher Portal · {teacher.subject}</div>
                        <h1 className="edu-page-title">{tabs.find(t => t.id === tab)?.label}</h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill green"><Search size={12} /> Search Students</div>
                        <NotificationBell username={teacher?.name || user?.username || ''} accentColor="#10b981" />
                    </div>
                </header>

                <div className="edu-hero green-hero">
                    <div className="hero-l">
                        <UserCheck size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">Welcome back, {teacher.name}!</div>
                            <div className="hero-sub">Subject Specialist: {teacher.subject} · {HM_SCHOOL.name}</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><Users size={13} />{myStudents.length} Students</span>
                        <span><Clock size={13} />Next Class: 09:00 AM</span>
                    </div>
                </div>

                <div className="edu-content">
                    {tab === 'overview' && <OverviewTab teacher={teacher} students={myStudents} onNavigate={setTab} />}
                    {tab === 'students' && <StudentsTab students={myStudents} onUpdateAttendance={updateStudentAttendance} />}
                    {tab === 'tasks' && (
                        managedAssignment ? (
                            <AssignmentDetail
                                assignment={managedAssignment}
                                students={myStudents}
                                onBack={() => setManagedAssignment(null)}
                            />
                        ) : (
                            <TasksTab onManage={setManagedAssignment} />
                        )
                    )}
                    {tab === 'myTasks' && (
                        <MemberTasksPanel
                            user={user}
                            role="TEACHER"
                            memberName={teacher?.name || user?.username || ''}
                            accentColor="#10b981"
                        />
                    )}
                    {tab === 'schedule' && <ScheduleTab teacher={teacher} />}
                    {tab === 'attendance' && <StudentsTab students={myStudents} onUpdateAttendance={updateStudentAttendance} />}
                    {tab === 'settings' && <SettingsTab teacher={teacher} />}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
