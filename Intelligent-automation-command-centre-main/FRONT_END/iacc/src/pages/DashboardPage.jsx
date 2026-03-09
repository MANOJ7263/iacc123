import React, { useState, useEffect } from 'react';
import { taskService } from '@/services/api';
import {
    Activity, Clock, CheckCircle, AlertTriangle, Terminal,
    TrendingUp, Zap, Shield, Download, X, Layers, User,
    BarChart2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, Legend
} from 'recharts';
import { useTaskStore, computeDeptStats } from '../data/taskStore';

// ─── Static productivity chart (time of day — illustrative) ───────────────────
const productivityData = [
    { name: '08:00', tasks: 12, automated: 10 },
    { name: '09:00', tasks: 18, automated: 14 },
    { name: '10:00', tasks: 19, automated: 15 },
    { name: '11:00', tasks: 27, automated: 22 },
    { name: '12:00', tasks: 35, automated: 32 },
    { name: '13:00', tasks: 22, automated: 19 },
    { name: '14:00', tasks: 28, automated: 25 },
    { name: '15:00', tasks: 38, automated: 33 },
    { name: '16:00', tasks: 45, automated: 40 },
    { name: '17:00', tasks: 30, automated: 27 },
    { name: '18:00', tasks: 20, automated: 18 },
];

// ─── Task generation lives in taskStore.js ────────────────────────────────────


// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, bgColor, trend, onClick, active }) => (
    <div
        onClick={onClick}
        style={{
            background: active ? color : '#fff',
            border: `2px solid ${active ? color : '#e2e8f0'}`,
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s',
            boxShadow: active ? `0 4px 20px ${color}33` : '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: '1rem',
        }}
    >
        <div style={{
            width: '3rem', height: '3rem', borderRadius: '0.75rem',
            background: active ? 'rgba(255,255,255,0.2)' : bgColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            <Icon size={22} color={active ? '#fff' : color} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: active ? '#fff' : '#0f172a', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: active ? 'rgba(255,255,255,0.85)' : '#64748b', marginTop: '0.2rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.72rem', color: active ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginTop: '0.1rem' }}>{sub}</div>}
        </div>
        {trend !== undefined && (
            <div style={{ textAlign: 'right' }}>
                {trend >= 0
                    ? <ArrowUpRight size={18} color={active ? '#fff' : '#10b981'} />
                    : <ArrowDownRight size={18} color={active ? '#fff' : '#ef4444'} />}
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: active ? 'rgba(255,255,255,0.8)' : (trend >= 0 ? '#10b981' : '#ef4444') }}>
                    {trend >= 0 ? '+' : ''}{trend}%
                </div>
            </div>
        )}
    </div>
);

// ─── Task Drill-Down Panel ──────────────────────────────────────────────────────
const TaskDrillDown = ({ title, tasks, onClose }) => {
    const grouped = tasks.reduce((acc, t) => {
        const d = t.department || 'UNASSIGNED';
        if (!acc[d]) acc[d] = [];
        acc[d].push(t);
        return acc;
    }, {});

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <div style={{ background: '#fff', border: '1.5px solid #c7d2fe', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(99,102,241,0.08)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e0e7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #eef2ff, #f8faff)' }}>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Layers size={18} /> Detailed View: {title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6366f1', marginTop: '0.2rem' }}>{tasks.length} tasks across departments</div>
                    </div>
                    <button onClick={onClose} style={{ background: '#e0e7ff', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} color="#6366f1" />
                    </button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {Object.keys(grouped).map(dept => (
                        <div key={dept} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Dept: <span style={{ color: '#6366f1' }}>{dept}</span></span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#e0e7ff', color: '#4338ca', padding: '0.15rem 0.6rem', borderRadius: '99px' }}>{grouped[dept].length}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                                {grouped[dept].map(task => (
                                    <div key={task.id} style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '0.875rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.3 }}>{task.title}</span>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', flexShrink: 0,
                                                background: task.priority === 'HIGH' ? '#fee2e2' : task.priority === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                                                color: task.priority === 'HIGH' ? '#dc2626' : task.priority === 'MEDIUM' ? '#d97706' : '#16a34a',
                                            }}>{task.priority}</span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem', lineHeight: 1.4 }}>{task.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: task.createdByAdmin ? '#7c3aed' : '#2563eb', background: task.createdByAdmin ? '#ede9fe' : '#dbeafe', padding: '0.1rem 0.5rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {task.createdByAdmin ? <Shield size={10} /> : <User size={10} />}
                                                {task.createdByAdmin ? 'Collector' : 'Dept Head'}
                                            </span>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.5rem', borderRadius: '99px',
                                                background: task.status === 'COMPLETED' ? '#dcfce7' : task.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                                                color: task.status === 'COMPLETED' ? '#16a34a' : task.status === 'PENDING' ? '#d97706' : '#dc2626',
                                            }}>{task.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No tasks found.</div>}
                </div>
            </div>
        </div>
    );
};

// ─── Department Breakdown Chart — data from shared taskStore ──────────────────
const DeptBreakdownChart = ({ stats }) => {
    const chartData = [
        { dept: 'Education', completed: stats?.EDUCATION?.completed || 0, pending: stats?.EDUCATION?.pending || 0, highRisk: stats?.EDUCATION?.highRisk || 0 },
        { dept: 'Health', completed: stats?.HEALTH?.completed || 0, pending: stats?.HEALTH?.pending || 0, highRisk: stats?.HEALTH?.highRisk || 0 },
        { dept: 'Transport', completed: stats?.TRANSPORT?.completed || 0, pending: stats?.TRANSPORT?.pending || 0, highRisk: stats?.TRANSPORT?.highRisk || 0 },
        { dept: 'Finance', completed: stats?.FINANCE?.completed || 0, pending: stats?.FINANCE?.pending || 0, highRisk: stats?.FINANCE?.highRisk || 0 },
        { dept: 'Revenue', completed: stats?.REVENUE?.completed || 0, pending: stats?.REVENUE?.pending || 0, highRisk: stats?.REVENUE?.highRisk || 0 },
    ];
    return (
        <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '0.75rem 1rem' }}
                        formatter={(value, name) => [value, name]}
                        itemStyle={{ fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '0.5rem' }} />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// ─── Productivity Trend Chart ──────────────────────────────────────────────────
const ProductivityChart = () => (
    <div style={{ height: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '0.5rem' }} />
                <Area type="monotone" dataKey="tasks" stroke="#667eea" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTasks)" name="Total Tasks" />
                <Area type="monotone" dataKey="automated" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAuto)" name="Automated" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// ─── High-Risk Escalation ───────────────────────────────────────────────────────
const HighRiskEscalation = ({ tasks, onEscalate }) => {
    const highRisk = tasks.filter(t => t.riskLevel === 'HIGH' && t.status !== 'COMPLETED');
    if (highRisk.length === 0) return null;
    return (
        <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="#dc2626" />
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#dc2626', margin: 0 }}>High-Risk Escalation Center</h3>
                <span style={{ background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '99px' }}>{highRisk.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
                {highRisk.slice(0, 6).map(task => (
                    <div key={task.id} style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: '0.875rem', padding: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b', marginBottom: '0.35rem' }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#dc2626', marginBottom: '0.75rem' }}>{task.department}</div>
                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', marginBottom: '0.875rem', lineHeight: 1.4 }}>{task.description}</p>
                        <button
                            onClick={() => onEscalate(task.id)}
                            style={{ width: '100%', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                        >🚨 Escalate & Force Automation</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Live Automation Monitor ────────────────────────────────────────────────────
const AutomationMonitor = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await taskService.getAutomationStatus();
                if (data && data.length > 0) setJobs(data);
            } catch (_) { }
        };
        fetch();
        const interval = setInterval(fetch, 10000);
        return () => clearInterval(interval);
    }, []);

    // Always show some mock bot activity when backend is offline
    const mockJobs = [
        { id: 1, assignedBotType: 'TaxBot-01', title: 'Revenue overdue sync', uipathJobStatus: 'Running', createdAt: new Date().toISOString() },
        { id: 2, assignedBotType: 'HealthBot-02', title: 'Patient vitals batch update', uipathJobStatus: 'Successful', createdAt: new Date().toISOString() },
        { id: 3, assignedBotType: 'TransportBot-01', title: 'Fleet maintenance schedule', uipathJobStatus: 'Pending', createdAt: new Date().toISOString() },
        { id: 4, assignedBotType: 'FinanceBot-01', title: 'Transaction approval queue', uipathJobStatus: 'Running', createdAt: new Date().toISOString() },
        { id: 5, assignedBotType: 'EduBot-01', title: 'Scholarship audit automation', uipathJobStatus: 'Successful', createdAt: new Date().toISOString() },
    ];

    const displayJobs = jobs.length > 0 ? jobs : mockJobs;

    const statusColor = (s) =>
        s === 'Successful' ? { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e', text: '#15803d' } :
            ['Faulted', 'Start Failed', 'FAILED'].includes(s) ? { bg: '#fff5f5', border: '#fecaca', dot: '#ef4444', text: '#dc2626' } :
                { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6', text: '#1d4ed8' };

    return (
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '1rem', height: '100%', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Terminal size={18} color="#6366f1" />
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Live Automation Monitor</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time UiPath Orchestrator Feed</div>
                </div>
            </div>
            <div style={{ padding: '1rem 1.25rem', maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {displayJobs.map(job => {
                    const sc = statusColor(job.uipathJobStatus);
                    return (
                        <div key={job.id} style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '0.75rem', padding: '0.75rem 0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sc.dot, flexShrink: 0, animation: job.uipathJobStatus === 'Running' ? 'pulse 1.5s infinite' : 'none' }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#334155', fontFamily: 'monospace' }}>{job.assignedBotType || 'Bot'}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.2rem' }}>{job.title}</div>
                                <div style={{ fontSize: '0.68rem', color: sc.text, fontWeight: 600 }}>● {job.uipathJobStatus || 'Pending'}</div>
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace', flexShrink: 0, marginLeft: '0.5rem' }}>
                                {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
const DashboardPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // ── Read from shared task store (same data as department pages) ─────────────
    const { tasks: allTasks, initialized, loading, initialize, escalateTask: storeEscalate } = useTaskStore();

    useEffect(() => { initialize(); }, [initialize]);

    // Live per-department stats — drives both bar chart AND stat cards
    const deptStats = computeDeptStats(allTasks);

    const handleEscalate = async (id) => {
        try { await taskService.escalateTask(id); } catch (_) { }
        storeEscalate(id); // update shared store → dept pages update too
    };

    const handleExport = async () => {
        try { await taskService.downloadReport(); } catch (_) {
            alert('Export failed – backend offline.');
        }
    };

    // Use ALL totals from shared store
    const summary = deptStats.ALL || { total: 0, completed: 0, highRisk: 0, pending: 0 };

    const statCards = [
        { id: 'TOTAL', icon: Activity, label: 'Total Tasks', value: summary.total, sub: 'All departments', color: '#3b82f6', bgColor: '#eff6ff', trend: 12 },
        { id: 'COMPLETED', icon: CheckCircle, label: 'Completed', value: summary.completed, sub: `${summary.total ? Math.round(summary.completed / summary.total * 100) : 0}% completion rate`, color: '#10b981', bgColor: '#f0fdf4', trend: 8 },
        { id: 'HIGH_RISK', icon: AlertTriangle, label: 'High Risk', value: summary.highRisk, sub: 'Require escalation', color: '#ef4444', bgColor: '#fff5f5', trend: -5 },
        { id: 'PENDING', icon: Clock, label: 'Pending Review', value: summary.pending, sub: 'Awaiting action', color: '#f59e0b', bgColor: '#fffbeb', trend: 3 },
    ];

    const getDrillData = () => {
        switch (selectedCategory) {
            case 'TOTAL': return { title: 'All Tasks', tasks: allTasks };
            case 'COMPLETED': return { title: 'Completed Tasks', tasks: allTasks.filter(t => t.status === 'COMPLETED') };
            case 'HIGH_RISK': return { title: 'High Risk Tasks', tasks: allTasks.filter(t => t.riskLevel === 'HIGH') };
            case 'PENDING': return { title: 'Pending Tasks', tasks: allTasks.filter(t => ['PENDING', 'PENDING_APPROVAL'].includes(t.status)) };
            default: return { title: '', tasks: [] };
        }
    };

    return (
        <div style={{ padding: '0.25rem', maxWidth: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>Collector Dashboard</h2>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0.4rem 0 0' }}>
                        Operational oversight and high-priority escalations.
                        {loading && <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>⟳ Loading data…</span>}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
                        <Download size={15} /> Export Report
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#0f172a', border: 'none', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>
                        <Terminal size={15} /> System Console
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCards.map(s => (
                    <StatCard
                        key={s.id}
                        {...s}
                        active={selectedCategory === s.id}
                        onClick={() => setSelectedCategory(selectedCategory === s.id ? null : s.id)}
                    />
                ))}
            </div>

            {/* Drill Down */}
            {selectedCategory && (
                <TaskDrillDown
                    title={getDrillData().title}
                    tasks={getDrillData().tasks}
                    onClose={() => setSelectedCategory(null)}
                />
            )}

            {/* High Risk Escalations */}
            <HighRiskEscalation tasks={allTasks} onEscalate={handleEscalate} />

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem' }}>
                {/* Productivity Trends */}
                <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={17} color="#667eea" /> Productivity Trends
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Task volume vs automation (today)</div>
                    </div>
                    <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                        <ProductivityChart />
                    </div>
                </div>

                {/* Department Breakdown — driven by shared taskStore */}
                <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BarChart2 size={17} color="#10b981" /> Department Breakdown
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Live task counts — same data shown in each department page</div>
                    </div>
                    <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                        <DeptBreakdownChart stats={deptStats} />
                    </div>
                </div>
            </div>

            {/* Live Automation Monitor */}
            <div style={{ marginTop: '1.25rem' }}>
                <AutomationMonitor />
            </div>
        </div>
    );
};

export default DashboardPage;
