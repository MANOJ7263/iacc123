import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, BookOpen, Award, Bell, LogOut,
    BarChart2, CheckCircle2, TrendingUp, Calendar,
    Clock, Building2, Users, MapPin, FileText,
    Activity, Bot, AlertTriangle, Settings, Home, User
} from 'lucide-react';
import {
    HM_SCHOOL, CLASS_STRUCTURE, generateStudents
} from '../../data/educationData';
import { useEducationStore } from '../../data/educationStore';
import './EducationDashboard.css';


// ─── Helper: pick a student identity from localStorage ────────────────────────
function getMyStudent(user, students = []) {
    if (!students || students.length === 0) return { name: 'Student', rollNo: 'N/A', tamil: 0, english: 0, maths: 0, science: 0, social: 0, attendance: 0 };
    const match = (user?.username || '').match(/\d+/);
    const idx = match ? parseInt(match[0], 10) - 1 : 0;
    return students[Math.min(idx, students.length - 1)] || students[0];
}

// ─── Stat Card (edu-style) ────────────────────────────────────────────────────
const Stat = ({ icon: Icon, label, value, sub, color, onClick }) => (
    <div className="edu-stat-card" style={{ '--c': color, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s' }} onClick={onClick} title={onClick ? `Go to ${label}` : undefined}>
        <div className="edu-stat-icon" style={{ background: `${color}18` }}><Icon size={24} color={color} /></div>
        <div><div className="edu-stat-value">{value}</div><div className="edu-stat-label">{label}</div>{sub && <div className="edu-stat-sub">{sub}</div>}</div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 1 — Overview (Stats + Recent Activity + Automation)
// ═══════════════════════════════════════════════════════════════════════════════
const OverviewTab = ({ student, onNavigate }) => {
    const avg = Math.round((student.tamil + student.english + student.maths + student.science + student.social) / 5);
    const total = student.tamil + student.english + student.maths + student.science + student.social;
    const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : avg >= 60 ? 'B' : avg >= 50 ? 'C' : 'D';
    const cls = CLASS_STRUCTURE.find(c => c.grade === student.grade && c.section === student.section);

    const recentActivity = [
        { time: '2h ago', action: 'Assignment submitted: "Tamil Essay – My Village"', type: 'task', status: 'done', navigateTo: 'tasks' },
        { time: '5h ago', action: 'New homework: "Maths – Chapter 8 Exercises"', type: 'task', status: 'pending', navigateTo: 'tasks' },
        { time: 'Yesterday', action: 'Attendance marked: Present', type: 'member', status: 'done', navigateTo: 'attendance' },
        { time: '2 days ago', action: 'Report card generated for Term 1', type: 'report', status: 'done', navigateTo: 'reports' },
        { time: '3 days ago', action: 'Alert: Attendance below 80% for November', type: 'alert', status: 'alert', navigateTo: 'attendance' },
        { time: '4 days ago', action: 'Science lab report submitted', type: 'report', status: 'done', navigateTo: 'reports' },
    ];
    const actIcons = { task: Clock, bot: Bot, member: User, alert: AlertTriangle, report: FileText };
    const actColors = { pending: '#f59e0b', done: '#10b981', alert: '#ef4444' };

    return (
        <>
            {/* Stats Row — each card navigates to the relevant tab */}
            <div className="edu-stats-row">
                <Stat icon={Activity} label="My Tasks" value="7" sub="2 due today" color="#3b82f6" onClick={() => onNavigate('tasks')} />
                <Stat icon={CheckCircle2} label="Completed" value="23" sub="This month" color="#10b981" onClick={() => onNavigate('tasks')} />
                <Stat icon={Clock} label="Pending Review" value="3" sub="Awaiting approval" color="#f59e0b" onClick={() => onNavigate('tasks')} />
                <Stat icon={AlertTriangle} label="Alerts" value="1" sub="Action needed" color="#ef4444" onClick={() => onNavigate('attendance')} />
            </div>

            {/* Student Info Card */}
            <div className="edu-card school-info-card">
                <div className="school-info-left">
                    <div className="school-emblem"><GraduationCap size={40} color="#3b82f6" /></div>
                    <div>
                        <div className="school-full-name">{student.name}</div>
                        <div className="school-code">Roll No: {student.rollNo} &nbsp;·&nbsp; Class: Std {student.grade} – {student.section}</div>
                        <div className="school-address"><MapPin size={13} />{HM_SCHOOL.name}</div>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}><Building2 size={11} style={{ marginRight: 3 }} />{HM_SCHOOL.zone}</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}><Calendar size={11} style={{ marginRight: 3 }} />Academic Year 2025–26</span>
                        </div>
                    </div>
                </div>
                <div className="school-info-meta">
                    <div className="school-meta-item"><span>Gender</span><strong>{student.gender}</strong></div>
                    <div className="school-meta-item"><span>Stream</span><strong>{cls?.stream || 'General'}</strong></div>
                    <div className="school-meta-item"><span>Medium</span><strong>{HM_SCHOOL.medium}</strong></div>
                    <div className="school-meta-item"><span>Overall Grade</span><strong style={{ color: avg >= 70 ? '#10b981' : avg >= 50 ? '#f59e0b' : '#ef4444' }}>{grade} ({avg}%)</strong></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Recent Activity */}
                <div className="edu-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentActivity.map((item, i) => {
                            const Icon = actIcons[item.type];
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', padding: '0.25rem 0.375rem', borderRadius: '0.5rem', transition: 'background 0.15s' }} onClick={() => onNavigate(item.navigateTo)} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} title={`Go to ${item.navigateTo}`}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: actColors[item.status], marginTop: 5, flexShrink: 0 }} />
                                    <Icon size={14} color={actColors[item.status]} style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                        <span style={{ fontSize: '0.835rem', color: '#334155' }}>{item.action}</span>
                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Automation Panel */}
                <div className="edu-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Automation Panel</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Attendance Sync Bot', status: 'running', lastRun: '30m ago', runs: 312 },
                            { name: 'Report Generator', status: 'idle', lastRun: '6h ago', runs: 89 },
                            { name: 'Homework Notifier', status: 'running', lastRun: '1h ago', runs: 156 },
                            { name: 'Exam Alert Bot', status: 'idle', lastRun: '2d ago', runs: 45 },
                        ].map((bot, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <Bot size={20} color={bot.status === 'running' ? '#10b981' : '#94a3b8'} />
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{bot.name}</span>
                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Last run: {bot.lastRun} · {bot.runs} runs</span>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '99px',
                                    background: bot.status === 'running' ? '#f0fdf4' : '#f8fafc',
                                    color: bot.status === 'running' ? '#16a34a' : '#94a3b8',
                                    border: `1px solid ${bot.status === 'running' ? '#bbf7d0' : '#e2e8f0'}`,
                                }}>{bot.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 2 — Team Members (My Classmates)
// ═══════════════════════════════════════════════════════════════════════════════
const TeamTab = ({ student, allStudents }) => {
    const classmates = allStudents
        .filter(s => s.grade === student.grade && s.section === student.section);

    return (
        <>
            <div className="edu-stats-row">
                <Stat icon={Users} label="Total Classmates" value={classmates.length} sub={`Std ${student.grade} – ${student.section}`} color="#3b82f6" />
                <Stat icon={Users} label="Boys" value={classmates.filter(s => s.gender === 'Male').length} color="#6366f1" />
                <Stat icon={Users} label="Girls" value={classmates.filter(s => s.gender === 'Female').length} color="#ec4899" />
                <Stat icon={CheckCircle2} label="Avg Attendance" value={`${Math.round(classmates.reduce((s, c) => s + c.attendance, 0) / classmates.length)}%`} sub="Class average" color="#10b981" />
            </div>

            <div className="edu-card">
                <div className="edu-card-header">
                    <h3>My Classmates – Std {student.grade} {student.section}</h3>
                    <span className="edu-tag-info">{classmates.length} Students</span>
                </div>
                <table className="edu-table">
                    <thead>
                        <tr><th>#</th><th>Name</th><th>Roll No</th><th>Gender</th><th>Attendance</th></tr>
                    </thead>
                    <tbody>
                        {classmates.map((s, i) => {
                            const isMe = s.rollNo === student.rollNo;
                            return (
                                <tr key={i} style={isMe ? { background: '#eff6ff', boxShadow: 'inset 3px 0 0 #3b82f6' } : {}}>
                                    <td className="text-muted">{i + 1}</td>
                                    <td>
                                        <div className="edu-name-cell">
                                            <div className="edu-av" style={{
                                                background: isMe ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : s.gender === 'Male' ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'linear-gradient(135deg,#ec4899,#be185d)',
                                                fontSize: '0.7rem', width: '1.8rem', height: '1.8rem',
                                            }}>{s.name[0]}</div>
                                            <span className="fw-500">{s.name}{isMe ? ' (You)' : ''}</span>
                                        </div>
                                    </td>
                                    <td className="mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.rollNo}</td>
                                    <td><span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.gender === 'Male' ? '#3b82f6' : '#ec4899' }}>{s.gender === 'Male' ? '♂ Boy' : '♀ Girl'}</span></td>
                                    <td>
                                        <div className="edu-progress">
                                            <div className="edu-progress-bar" style={{ width: `${s.attendance}%`, background: s.attendance >= 85 ? '#10b981' : s.attendance >= 75 ? '#f59e0b' : '#ef4444' }} />
                                            <span>{s.attendance}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 3 — Tasks & Workflows
// ═══════════════════════════════════════════════════════════════════════════════
const TasksTab = ({ student }) => {
    const tasks = [
        { id: 1, title: 'Submit Tamil Essay – "My Village"', subject: 'Tamil', dueDate: '2026-02-26', status: 'submitted', submittedOn: '2026-02-24' },
        { id: 2, title: 'Maths Chapter 8 – Exercise Problems', subject: 'Mathematics', dueDate: '2026-02-27', status: 'pending', submittedOn: null },
        { id: 3, title: 'Science Lab Report – Photosynthesis', subject: 'Science', dueDate: '2026-02-25', status: 'submitted', submittedOn: '2026-02-23' },
        { id: 4, title: 'English Grammar Worksheet – Tenses', subject: 'English', dueDate: '2026-02-28', status: 'pending', submittedOn: null },
        { id: 5, title: 'Social Science – Map Work (India Rivers)', subject: 'Social Science', dueDate: '2026-03-01', status: 'pending', submittedOn: null },
        { id: 6, title: 'Science – Chapter 7 Questions', subject: 'Science', dueDate: '2026-02-22', status: 'submitted', submittedOn: '2026-02-21' },
        { id: 7, title: 'Tamil – Thirukkural Memorization (10)', subject: 'Tamil', dueDate: '2026-02-20', status: 'overdue', submittedOn: null },
        { id: 8, title: 'Maths – Statistics Chart Preparation', subject: 'Mathematics', dueDate: '2026-03-03', status: 'pending', submittedOn: null },
    ];

    const statusColors = { submitted: '#10b981', pending: '#f59e0b', overdue: '#ef4444' };
    const submitted = tasks.filter(t => t.status === 'submitted').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;

    return (
        <>
            <div className="edu-stats-row">
                <Stat icon={FileText} label="Total Tasks" value={tasks.length} sub="Assigned this month" color="#3b82f6" />
                <Stat icon={CheckCircle2} label="Submitted" value={submitted} sub="On time" color="#10b981" />
                <Stat icon={Clock} label="Pending" value={pending} sub="Due soon" color="#f59e0b" />
                <Stat icon={AlertTriangle} label="Overdue" value={overdue} sub="Action needed" color="#ef4444" />
            </div>

            <div className="edu-card">
                <div className="edu-card-header">
                    <h3>My Assignments & Tasks</h3>
                    <span className="edu-tag-info">{tasks.length} Tasks</span>
                </div>
                <table className="edu-table">
                    <thead>
                        <tr><th>#</th><th>Task</th><th>Subject</th><th>Due Date</th><th>Submitted On</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {tasks.map((t, i) => (
                            <tr key={t.id}>
                                <td className="text-muted">{i + 1}</td>
                                <td className="fw-500">{t.title}</td>
                                <td><span className="edu-badge blue">{t.subject}</span></td>
                                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.dueDate}</td>
                                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.submittedOn || '—'}</td>
                                <td><span className={`edu-badge ${t.status === 'submitted' ? 'green' : t.status === 'pending' ? 'amber' : 'red'}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 4 — Timetable
// ═══════════════════════════════════════════════════════════════════════════════
const TimetableTab = ({ student }) => {
    const timetable = [
        { day: 'Monday', periods: ['Tamil', 'English', 'Maths', 'Science', 'Social', 'Phys. Ed.', 'Library'] },
        { day: 'Tuesday', periods: ['English', 'Maths', 'Tamil', 'Social', 'Science', 'Art', 'Computer Sci.'] },
        { day: 'Wednesday', periods: ['Maths', 'Science', 'English', 'Tamil', 'Social', 'Phys. Ed.', 'Maths'] },
        { day: 'Thursday', periods: ['Science', 'Tamil', 'Social', 'English', 'Maths', 'Computer Sci.', 'English'] },
        { day: 'Friday', periods: ['Social', 'Maths', 'Science', 'Tamil', 'English', 'Art', 'Sports'] },
        { day: 'Saturday', periods: ['Tamil', 'English', 'Maths', 'Science', 'Moral Ed.', '—', '—'] },
    ];
    const periodTimes = ['9:00–9:45', '9:45–10:30', '10:45–11:30', '11:30–12:15', '1:00–1:45', '1:45–2:30', '2:30–3:15'];
    const colors = {
        'Tamil': '#3b82f6', 'English': '#10b981', 'Maths': '#f59e0b',
        'Science': '#ef4444', 'Social': '#8b5cf6',
        'Phys. Ed.': '#06b6d4', 'Art': '#ec4899', 'Computer Sci.': '#6366f1',
        'Library': '#14b8a6', 'Moral Ed.': '#a855f7', 'Sports': '#06b6d4',
    };

    return (
        <div className="edu-card">
            <div className="edu-card-header">
                <h3>Weekly Timetable – Std {student.grade} {student.section}</h3>
                <span className="edu-tag-info">Academic Year 2025–26</span>
            </div>
            <table className="edu-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        {periodTimes.map((t, i) => <th key={i} style={{ textAlign: 'center', fontSize: '0.65rem' }}>Period {i + 1}<br /><span style={{ fontWeight: 400, color: '#94a3b8' }}>{t}</span></th>)}
                    </tr>
                </thead>
                <tbody>
                    {timetable.map((row, i) => (
                        <tr key={i}>
                            <td className="fw-500">{row.day}</td>
                            {row.periods.map((subject, j) => (
                                <td key={j} style={{ textAlign: 'center' }}>
                                    {subject !== '—' ? (
                                        <span style={{
                                            display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '0.4rem',
                                            fontSize: '0.75rem', fontWeight: 600, background: `${colors[subject] || '#64748b'}15`,
                                            color: colors[subject] || '#64748b', border: `1px solid ${colors[subject] || '#64748b'}30`
                                        }}>{subject}</span>
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
//  TAB 5 — Attendance
// ═══════════════════════════════════════════════════════════════════════════════
const AttendanceTab = ({ student }) => {
    const months = [
        { name: 'June 2025', working: 24 },
        { name: 'July 2025', working: 27 },
        { name: 'Aug 2025', working: 25 },
        { name: 'Sep 2025', working: 22 },
        { name: 'Oct 2025', working: 20 },
        { name: 'Nov 2025', working: 23 },
        { name: 'Dec 2025', working: 18 },
        { name: 'Jan 2026', working: 26 },
        { name: 'Feb 2026', working: 20 },
    ].map((m, i) => {
        const ratio = student.attendance / 100;
        const present = Math.min(Math.round(m.working * (ratio + (i % 3 === 0 ? 0.02 : i % 3 === 1 ? -0.01 : 0))), m.working);
        return { ...m, present, absent: m.working - present, pct: Math.round((present / m.working) * 100) };
    });

    const totalW = months.reduce((s, m) => s + m.working, 0);
    const totalP = months.reduce((s, m) => s + m.present, 0);

    return (
        <>
            <div className="edu-stats-row">
                <Stat icon={Calendar} label="Total Working Days" value={totalW} sub="June 2025 – Feb 2026" color="#3b82f6" />
                <Stat icon={CheckCircle2} label="Days Present" value={totalP} sub={`${Math.round((totalP / totalW) * 100)}% overall`} color="#10b981" />
                <Stat icon={Clock} label="Days Absent" value={totalW - totalP} sub="Includes leave" color="#ef4444" />
                <Stat icon={Award} label="Exam Eligibility" value={student.attendance >= 75 ? 'Eligible' : 'At Risk'} sub="Board Exam" color={student.attendance >= 75 ? '#10b981' : '#ef4444'} />
            </div>

            <div className="edu-card">
                <div className="edu-card-header"><h3>Month-wise Attendance Record</h3></div>
                <table className="edu-table">
                    <thead>
                        <tr><th>Month</th><th>Working Days</th><th>Present</th><th>Absent</th><th>Attendance %</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {months.map((m, i) => (
                            <tr key={i}>
                                <td className="fw-500">{m.name}</td>
                                <td>{m.working}</td>
                                <td style={{ color: '#10b981', fontWeight: 600 }}>{m.present}</td>
                                <td style={{ color: m.absent > 3 ? '#ef4444' : '#64748b', fontWeight: 600 }}>{m.absent}</td>
                                <td>
                                    <div className="edu-progress">
                                        <div className="edu-progress-bar" style={{ width: `${m.pct}%`, background: m.pct >= 85 ? '#10b981' : m.pct >= 75 ? '#f59e0b' : '#ef4444' }} />
                                        <span>{m.pct}%</span>
                                    </div>
                                </td>
                                <td><span className={`edu-badge ${m.pct >= 85 ? 'green' : m.pct >= 75 ? 'amber' : 'red'}`}>{m.pct >= 85 ? 'Good' : m.pct >= 75 ? 'Fair' : 'Low'}</span></td>
                            </tr>
                        ))}
                        <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                            <td>Total</td>
                            <td>{totalW}</td>
                            <td style={{ color: '#10b981' }}>{totalP}</td>
                            <td style={{ color: '#ef4444' }}>{totalW - totalP}</td>
                            <td>
                                <div className="edu-progress">
                                    <div className="edu-progress-bar" style={{ width: `${Math.round((totalP / totalW) * 100)}%`, background: '#3b82f6' }} />
                                    <span style={{ fontWeight: 700 }}>{Math.round((totalP / totalW) * 100)}%</span>
                                </div>
                            </td>
                            <td>—</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 6 — Reports (Subject-wise Marks)
// ═══════════════════════════════════════════════════════════════════════════════
const ReportsTab = ({ student }) => {
    const avg = Math.round((student.tamil + student.english + student.maths + student.science + student.social) / 5);
    const total = student.tamil + student.english + student.maths + student.science + student.social;
    const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : avg >= 60 ? 'B' : avg >= 50 ? 'C' : 'D';

    return (
        <>
            <div className="edu-stats-row">
                <Stat icon={Award} label="Overall Average" value={`${avg}/100`} sub={`Total: ${total}/500`} color="#3b82f6" />
                <Stat icon={TrendingUp} label="Grade" value={grade} sub="Current Term" color="#8b5cf6" />
                <Stat icon={CheckCircle2} label="Pass Status" value={avg >= 35 ? 'Pass' : 'Fail'} sub="All subjects combined" color={avg >= 35 ? '#10b981' : '#ef4444'} />
                <Stat icon={BookOpen} label="Subjects" value="5" sub="Core subjects" color="#f59e0b" />
            </div>

            <div className="edu-card">
                <div className="edu-card-header"><h3>Term 1 – Subject-wise Report Card</h3></div>
                <table className="edu-table">
                    <thead>
                        <tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Performance</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Tamil', marks: student.tamil, icon: '📖' },
                            { name: 'English', marks: student.english, icon: '📝' },
                            { name: 'Mathematics', marks: student.maths, icon: '📐' },
                            { name: 'Science', marks: student.science, icon: '🔬' },
                            { name: 'Social Science', marks: student.social, icon: '🌍' },
                        ].map((s, i) => {
                            const g = s.marks >= 90 ? 'A+' : s.marks >= 80 ? 'A' : s.marks >= 70 ? 'B+' : s.marks >= 60 ? 'B' : s.marks >= 50 ? 'C' : s.marks >= 35 ? 'D' : 'F';
                            return (
                                <tr key={i}>
                                    <td className="fw-500">{s.icon} {s.name}</td>
                                    <td style={{ fontWeight: 700, color: s.marks >= 70 ? '#10b981' : s.marks >= 50 ? '#f59e0b' : '#ef4444' }}>{s.marks}/100</td>
                                    <td><span className={`edu-badge ${s.marks >= 70 ? 'green' : s.marks >= 50 ? 'amber' : 'red'}`}>{g}</span></td>
                                    <td>
                                        <div className="edu-progress">
                                            <div className="edu-progress-bar" style={{ width: `${s.marks}%`, background: s.marks >= 70 ? '#10b981' : s.marks >= 50 ? '#f59e0b' : '#ef4444' }} />
                                            <span>{s.marks}%</span>
                                        </div>
                                    </td>
                                    <td><span className={`edu-badge ${s.marks >= 35 ? 'green' : 'red'}`}>{s.marks >= 35 ? 'Pass' : 'Fail'}</span></td>
                                </tr>
                            );
                        })}
                        <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                            <td>Total / Average</td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{total}/500 ({avg}%)</td>
                            <td><span className={`edu-badge ${avg >= 70 ? 'green' : avg >= 50 ? 'amber' : 'red'}`}>{grade}</span></td>
                            <td>
                                <div className="edu-progress">
                                    <div className="edu-progress-bar" style={{ width: `${avg}%`, background: avg >= 70 ? '#10b981' : avg >= 50 ? '#f59e0b' : '#ef4444' }} />
                                    <span>{avg}%</span>
                                </div>
                            </td>
                            <td>—</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB 7 — Settings
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsTab = ({ student, user }) => (
    <div className="edu-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem' }}>Account Settings</h3>
        <table className="edu-table">
            <tbody>
                <tr><td className="fw-500" style={{ width: '200px' }}>Username</td><td>{user?.username || '—'}</td></tr>
                <tr><td className="fw-500">Student Name</td><td>{student.name}</td></tr>
                <tr><td className="fw-500">Roll Number</td><td>{student.rollNo}</td></tr>
                <tr><td className="fw-500">Class</td><td>Std {student.grade} – Section {student.section}</td></tr>
                <tr><td className="fw-500">Gender</td><td>{student.gender}</td></tr>
                <tr><td className="fw-500">School</td><td>{HM_SCHOOL.name}</td></tr>
                <tr><td className="fw-500">Zone</td><td>{HM_SCHOOL.zone}</td></tr>
                <tr><td className="fw-500">Medium</td><td>{HM_SCHOOL.medium}</td></tr>
                <tr><td className="fw-500">Academic Year</td><td>2025–26</td></tr>
                <tr><td className="fw-500">Role</td><td><span className="edu-badge blue">Student</span></td></tr>
            </tbody>
        </table>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const StudentDashboard = () => {
    const navigate = useNavigate();
    const { students } = useEducationStore();
    const [tab, setTab] = useState('overview');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = getMyStudent(user, students);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'team', label: 'Team Members', icon: Users },
        { id: 'tasks', label: 'Tasks & Workflows', icon: Activity },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="edu-dashboard">
            {/* Sidebar */}
            <aside className="edu-sidebar">
                <div className="edu-brand">
                    <div className="edu-logo"><GraduationCap size={22} color="#fff" /></div>
                    <div>
                        <div className="edu-brand-name">Education Dept.</div>
                        <div className="edu-brand-sys">Student Portal</div>
                    </div>
                </div>
                <div className="edu-role-tag">Student – Std {student.grade} {student.section}</div>
                <nav className="edu-nav">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} className={`edu-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                                <Icon size={17} />{t.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="edu-sidebar-footer">
                    <div className="edu-user">
                        <div className="edu-avatar">{student.name[0]}</div>
                        <div>
                            <div className="edu-username">{student.name}</div>
                            <div className="edu-userrole">{student.rollNo}</div>
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
                        <div className="edu-breadcrumb">Education · Student Portal · Std {student.grade} {student.section}</div>
                        <h1 className="edu-page-title">{tabs.find(t => t.id === tab)?.label}</h1>
                    </div>
                    <div className="edu-topbar-right">
                        <div className="edu-badge-pill blue"><GraduationCap size={12} />{student.rollNo}</div>
                        <button className="edu-icon-btn"><Bell size={18} /></button>
                    </div>
                </header>

                <div className="edu-hero blue-hero">
                    <div className="hero-l">
                        <GraduationCap size={36} color="rgba(255,255,255,0.9)" />
                        <div>
                            <div className="hero-title">{student.name}</div>
                            <div className="hero-sub">Std {student.grade} – Section {student.section} · {HM_SCHOOL.name} · {student.rollNo}</div>
                        </div>
                    </div>
                    <div className="hero-badges">
                        <span><Award size={13} />Roll: {student.rollNo}</span>
                        <span><CheckCircle2 size={13} />{student.attendance}% Attendance</span>
                    </div>
                </div>

                <div className="edu-content">
                    {tab === 'overview' && <OverviewTab student={student} onNavigate={setTab} />}
                    {tab === 'team' && <TeamTab student={student} allStudents={students} />}
                    {tab === 'tasks' && <TasksTab student={student} />}
                    {tab === 'timetable' && <TimetableTab student={student} />}
                    {tab === 'attendance' && <AttendanceTab student={student} />}
                    {tab === 'reports' && <ReportsTab student={student} />}
                    {tab === 'settings' && <SettingsTab student={student} user={user} />}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
