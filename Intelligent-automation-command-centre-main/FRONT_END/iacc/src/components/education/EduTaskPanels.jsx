/**
 * EduTaskPanels.jsx
 *
 * Exports:
 *   TaskAssignPanel  — for CEO / HM: see incoming tasks + create + reassign
 *   TaskStatusPanel  — for CEO / HM: monitor all task statuses with handler info
 *   MemberTasksPanel — for HM / Teacher: see their tasks + Task Submission
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    ClipboardList, Plus, X, Send, CheckCircle2, Clock,
    AlertTriangle, User, ChevronRight, ArrowLeft, Play,
    Timer, FileText, Shield, Users, Building2
} from 'lucide-react';
import useDeptTaskStore from '../../data/deptTaskStore';
import { TEACHERS, HEADMASTERS, DEOS } from '../../data/educationData';

// ────────────────────────────────────────────── Helpers ─────────
const priorityColor = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', COMPLETED: '#10b981', OVERDUE: '#ef4444' };
const statusLabel = { PENDING: '⏳ Pending', IN_PROGRESS: '🔄 In Progress', COMPLETED: '✅ Completed', OVERDUE: '🔴 Overdue' };

const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const fmtDeadline = (iso) => {
    if (!iso) return '—';
    const diff = new Date(iso) - Date.now();
    if (diff < 0) return '🔴 Overdue by ' + Math.ceil((-diff) / 86400000) + 'd';
    if (diff < 86400000) return '🟡 Due today';
    return `🟢 ${Math.ceil(diff / 86400000)} days left`;
};

const Badge = ({ text, color }) => (
    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '99px', background: `${color}18`, color, border: `1px solid ${color}30` }}>{text}</span>
);

// ── Confirm dialog for task actions ──────────────────────────────
const ConfirmAction = ({ msg, onYes, onNo }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%' }}>
            <AlertTriangle size={28} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem', lineHeight: 1.5 }}>{msg}</div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={onNo} style={{ padding: '0.5rem 1.2rem', borderRadius: '0.5rem', border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Cancel</button>
                <button onClick={onYes} style={{ padding: '0.5rem 1.2rem', borderRadius: '0.5rem', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Confirm</button>
            </div>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════
// 1.  TASK ASSIGN PANEL  (for CEO / HM —  visible on assign tab)
// ════════════════════════════════════════════════════════════════
export const TaskAssignPanel = ({ user, role, department = 'EDUCATION', accentColor = '#3b82f6' }) => {
    const { tasks, createTask, reassignTask, initCEO } = useDeptTaskStore();
    const [showCreate, setShowCreate] = useState(false);
    const [reassigning, setReassigning] = useState(null); // task being reassigned
    const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', deadline: '' });

    const username = user?.username || '';

    // Build member list depending on role
    const memberList = () => {
        const localUsers = JSON.parse(localStorage.getItem('iacc_demo_users') || '[]');
        if (role === 'CEO') {
            const extraHMs = localUsers.filter(u => u.role === 'HEADMASTER');
            return [
                ...HEADMASTERS.map(h => ({ id: h.id, name: h.name, role: 'HEADMASTER', sub: h.school })),
                ...extraHMs,
                ...DEOS.filter(d => d.zone).map(d => ({ id: d.id, name: d.name, role: 'DEO', sub: d.zone })),
            ];
        }
        if (role === 'HEADMASTER') {
            const extraTeachers = localUsers.filter(u => u.role === 'TEACHER');
            return [...TEACHERS.map(t => ({ id: t.id, name: t.name, role: 'TEACHER', sub: t.subject })), ...extraTeachers];
        }
        return [];
    };
    const members = memberList();

    // Tasks from ABOVE (from Collector or a superior) — these need the "Delegate" button
    // Key rule: fromCollector=true OR assignedByRole=COLLECTOR means it came from above
    const incoming = tasks.filter(t => {
        if (role === 'CEO') {
            // Any task created by a Collector for the CEO/Education dept
            return (
                t.fromCollector === true ||
                t.assignedByRole === 'COLLECTOR' ||
                t.assignedToRole === 'CEO'
            ) && t.assignedByRole !== role; // not self-created
        }
        if (role === 'HEADMASTER') {
            return (
                t.reassignedTo === username ||            // specifically delegated to this HM
                t.assignedTo === username ||              // directly assigned
                t.reassignedToRole === 'HEADMASTER' ||   // role-based (demo: any HM can see)
                (t.assignedToRole === 'HEADMASTER' && !t.fromCollector) // HM assigned by CEO
            ) && t.assignedByRole !== 'HEADMASTER';      // exclude self-created
        }
        return false;
    });

    // Tasks created BY this user as a dept head (not collector tasks)
    const outgoing = tasks.filter(t =>
        t.assignedBy === username &&
        t.assignedByRole !== 'COLLECTOR' &&
        !t.fromCollector
    );

    useEffect(() => {
        if (role === 'CEO') initCEO(username);
    }, [username, role]);

    const handleCreate = (member) => {
        if (!form.title.trim()) return alert('Please enter a task title');
        createTask({
            title: form.title,
            description: form.description,
            priority: form.priority,
            deadline: form.deadline,
            department,
            assignedTo: member.name, // use name as identifier for members without login
            assignedToName: member.name,
            assignedToRole: member.role,
            assignedBy: username,
            assignedByName: username,
            assignedByRole: role,
        });
        setForm({ title: '', description: '', priority: 'MEDIUM', deadline: '' });
        setShowCreate(false);
    };

    const handleReassign = (member) => {
        reassignTask(reassigning.id, member.name, member.name, member.role, username, role);
        setReassigning(null);
    };

    return (
        <div>
            {/* ── Incoming Tasks from higher authority ── */}
            <div style={{ background: '#fff', borderRadius: '1rem', border: '1.5px solid #e0e7ff', overflow: 'hidden', marginBottom: '1.25rem', boxShadow: '0 2px 12px rgba(99,102,241,0.06)' }}>
                <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #eef2ff, #f8faff)', borderBottom: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} color="#6366f1" />
                    <span style={{ fontWeight: 700, color: '#3730a3', fontSize: '0.88rem' }}>
                        Tasks Assigned to You {incoming.length > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '99px', padding: '0.05rem 0.5rem', fontSize: '0.65rem', marginLeft: '0.4rem' }}>{incoming.filter(t => t.status !== 'COMPLETED').length} pending</span>}
                    </span>
                </div>
                <div>
                    {incoming.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No tasks assigned from above</div>
                    ) : incoming.map(t => (
                        <div key={t.id} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1e293b' }}>{t.title}</span>
                                    <Badge text={t.priority} color={priorityColor[t.priority] || '#94a3b8'} />
                                    <Badge text={statusLabel[t.status] || t.status} color={statusColor[t.status] || '#64748b'} />
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.25rem' }}>{t.description?.substring(0, 100)}{t.description?.length > 100 ? '…' : ''}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                    From: <strong style={{ color: '#475569' }}>{t.assignedByName}</strong>
                                    {t.deadline && <span style={{ marginLeft: '0.75rem' }}>{fmtDeadline(t.deadline)}</span>}
                                    {t.reassignedToName && <span style={{ marginLeft: '0.75rem', color: '#10b981' }}>→ Delegated to: <strong>{t.reassignedToName}</strong></span>}
                                </div>
                            </div>
                            {t.status !== 'COMPLETED' && !t.reassignedTo && members.length > 0 && (
                                <button onClick={() => setReassigning(t)} style={{ padding: '0.4rem 0.9rem', borderRadius: '0.5rem', border: '1.5px solid #6366f1', background: '#fff', color: '#6366f1', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    <Send size={12} style={{ marginRight: '0.3rem' }} />Delegate
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Create New Task header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>Tasks You Created</div>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1rem', background: accentColor, color: '#fff', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                >
                    <Plus size={14} /> New Task
                </button>
            </div>

            {outgoing.length === 0 && (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed #e2e8f0' }}>
                    No tasks created yet. Use "New Task" to assign work to team members.
                </div>
            )}
            {outgoing.map(t => (
                <div key={t.id} style={{ background: '#fff', borderRadius: '0.875rem', border: '1.5px solid #e2e8f0', padding: '0.875rem 1.125rem', marginBottom: '0.625rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1e293b' }}>{t.title}</span>
                                <Badge text={t.priority} color={priorityColor[t.priority] || '#94a3b8'} />
                                <Badge text={statusLabel[t.status] || t.status} color={statusColor[t.status] || '#64748b'} />
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{t.description?.substring(0, 80)}{t.description?.length > 80 ? '…' : ''}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                                → <strong style={{ color: '#475569' }}>{t.assignedToName}</strong>
                                {t.handledByName && <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>Handler: {t.handledByName}</span>}
                                {t.completedAt && <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>Done: {fmtDate(t.completedAt)}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* ── Create Task Modal ── */}
            {showCreate && (
                <CreateTaskModal
                    members={members}
                    form={form}
                    setForm={setForm}
                    onSubmit={handleCreate}
                    onClose={() => setShowCreate(false)}
                    accentColor={accentColor}
                />
            )}

            {/* ── Reassign / Delegate Modal ── */}
            {reassigning && (
                <SelectMemberModal
                    title={`Delegate: "${reassigning.title}"`}
                    sub="Select the team member to handle this task"
                    members={members}
                    onSelect={handleReassign}
                    onClose={() => setReassigning(null)}
                    accentColor={accentColor}
                />
            )}
        </div>
    );
};

// ── Create Task Modal ─────────────────────────────────────────────
const CreateTaskModal = ({ members, form, setForm, onSubmit, onClose, accentColor }) => {
    const [step, setStep] = useState(1); // 1 = fill form, 2 = pick member
    const [pickedMember, setPickedMember] = useState(null);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
            <div style={{ background: '#fff', borderRadius: '1.25rem', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} color={accentColor} />
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{step === 1 ? 'Create New Task' : 'Assign to Member'}</span>
                    </div>
                    <button onClick={onClose} style={{ background: `${accentColor}18`, border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={15} color={accentColor} />
                    </button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem' }}>
                    {step === 1 && (
                        <>
                            {[
                                { label: 'Task Title *', key: 'title', type: 'text', placeholder: 'e.g. Submit Q1 Report' },
                                { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Describe what needs to be done...' },
                            ].map(f => (
                                <div key={f.key} style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>{f.label}</label>
                                    {f.type === 'textarea' ? (
                                        <textarea rows={3} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                                    ) : (
                                        <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
                                    )}
                                </div>
                            ))}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Priority</label>
                                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none' }}>
                                        <option value="HIGH">🔴 High</option>
                                        <option value="MEDIUM">🟡 Medium</option>
                                        <option value="LOW">🟢 Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Deadline</label>
                                    <input type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>
                            <button onClick={() => { if (!form.title.trim()) { alert('Enter a task title'); return; } setStep(2); }}
                                style={{ width: '100%', padding: '0.75rem', background: accentColor, color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                Next: Select Member →
                            </button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <button onClick={() => setStep(1)} style={{ fontSize: '0.78rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <ArrowLeft size={13} /> Back
                            </button>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>Select who should handle: <strong style={{ color: '#1e293b' }}>{form.title}</strong></div>

                            <div style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Or type any custom username (e.g. test1HM1):</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Username..."
                                        id="custom-user-input-create"
                                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', outline: 'none', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        onClick={() => {
                                            const v = document.getElementById('custom-user-input-create').value.trim();
                                            if (v) onSubmit({ id: v, name: v, role: 'HEADMASTER', sub: 'Custom Member' });
                                        }}
                                        style={{ padding: '0.5rem 1rem', background: accentColor, color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                                    >Assign</button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {members.map(m => (
                                    <button key={m.id} onClick={() => onSubmit(m)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', cursor: 'pointer', textAlign: 'left' }}>
                                        <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{m.name[0]?.toUpperCase() || 'U'}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1e293b' }}>{m.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.role} · {m.sub}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Select Member Modal (for reassignment) ────────────────────────
const SelectMemberModal = ({ title, sub, members, onSelect, onClose, accentColor }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
        <div style={{ background: '#fff', borderRadius: '1.25rem', width: '420px', maxWidth: '95vw', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{title}</div>
                    {sub && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{sub}</div>}
                </div>
                <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>

            <div style={{ padding: '1rem 1.5rem 0 1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Or delegate to custom username (e.g. test1HM1):</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Username..."
                        id="custom-user-input-delegate"
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <button
                        onClick={() => {
                            const v = document.getElementById('custom-user-input-delegate').value.trim();
                            if (v) onSelect({ id: v, name: v, role: 'HEADMASTER', sub: 'Custom Member' });
                        }}
                        style={{ padding: '0.5rem 1rem', background: accentColor, color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                    >Delegate</button>
                </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.2rem' }}>Pick from list:</div>
                {members.map(m => (
                    <button key={m.id} onClick={() => onSelect(m)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#f8fafc', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{m.name[0]?.toUpperCase() || 'U'}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{m.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.role} · {m.sub}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);


// ════════════════════════════════════════════════════════════════
// 2.  TASK STATUS PANEL   (for CEO / HM — monitor all tasks)
// ════════════════════════════════════════════════════════════════
export const TaskStatusPanel = ({ user, role, department = 'EDUCATION', accentColor = '#3b82f6' }) => {
    const { tasks } = useDeptTaskStore();
    const username = user?.username || '';
    const [filter, setFilter] = useState('ALL');

    // CEO sees all EDUCATION tasks; HM sees tasks they created or were assigned to them
    const myTasks = role === 'CEO'
        ? tasks.filter(t => t.department === department)
        : tasks.filter(t => t.assignedBy === username || t.assignedTo === username || t.reassignedTo === username);

    const filtered = filter === 'ALL' ? myTasks : myTasks.filter(t => t.status === filter);

    const summary = {
        PENDING: myTasks.filter(t => t.status === 'PENDING').length,
        IN_PROGRESS: myTasks.filter(t => t.status === 'IN_PROGRESS').length,
        COMPLETED: myTasks.filter(t => t.status === 'COMPLETED').length,
    };

    return (
        <div>
            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { key: 'PENDING', label: '⏳ Pending', color: '#f59e0b', bg: '#fef3c7' },
                    { key: 'IN_PROGRESS', label: '🔄 In Progress', color: '#3b82f6', bg: '#dbeafe' },
                    { key: 'COMPLETED', label: '✅ Completed', color: '#10b981', bg: '#dcfce7' },
                ].map(s => (
                    <div key={s.key} onClick={() => setFilter(f => f === s.key ? 'ALL' : s.key)}
                        style={{ background: filter === s.key ? s.color : '#fff', border: `2px solid ${filter === s.key ? s.color : '#e2e8f0'}`, borderRadius: '0.875rem', padding: '0.875rem', cursor: 'pointer', transition: 'all 0.18s' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: filter === s.key ? '#fff' : s.color }}>{summary[s.key]}</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: filter === s.key ? 'rgba(255,255,255,0.85)' : '#64748b' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px dashed #e2e8f0' }}>
                    No tasks to display
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {filtered.map(t => {
                        const isOverdue = t.deadline && new Date(t.deadline) < Date.now() && t.status !== 'COMPLETED';
                        const effectiveStatus = isOverdue ? 'OVERDUE' : t.status;
                        return (
                            <div key={t.id} style={{ background: '#fff', borderRadius: '0.875rem', border: `1.5px solid ${isOverdue ? '#fee2e2' : '#e2e8f0'}`, padding: '0.875rem 1.125rem', transition: 'box-shadow 0.15s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.87rem', color: '#1e293b' }}>{t.title}</span>
                                            <Badge text={t.priority} color={priorityColor[t.priority] || '#94a3b8'} />
                                            <Badge text={statusLabel[effectiveStatus] || effectiveStatus} color={statusColor[effectiveStatus] || '#64748b'} />
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>{t.description?.substring(0, 90)}{t.description?.length > 90 ? '…' : ''}</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem' }}>
                                            <span style={{ color: '#94a3b8' }}>From: <strong style={{ color: '#475569' }}>{t.assignedByName}</strong></span>
                                            <span style={{ color: '#94a3b8' }}>To: <strong style={{ color: '#475569' }}>{t.reassignedToName || t.assignedToName}</strong></span>
                                            {t.handledByName && <span style={{ color: '#10b981' }}>Handler: <strong>{t.handledByName}</strong></span>}
                                            {t.handledByRole && <span style={{ color: '#64748b' }}>Role: <strong>{t.handledByRole}</strong></span>}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                        {t.deadline && <div style={{ color: isOverdue ? '#ef4444' : '#94a3b8' }}>{fmtDeadline(t.deadline)}</div>}
                                        {t.startedAt && <div>Started: {fmtDate(t.startedAt)}</div>}
                                        {t.completedAt && <div style={{ color: '#10b981' }}>Done: {fmtDate(t.completedAt)}</div>}
                                    </div>
                                </div>
                                {/* History pills */}
                                {t.history && t.history.length > 0 && (
                                    <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                        {t.history.map((h, i) => (
                                            <span key={i} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', background: '#f1f5f9', borderRadius: '99px', color: '#475569', fontWeight: 600 }}>
                                                {h.action} by {h.by}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {t.completionNote && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: '#f0fdf4', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#166534', borderLeft: '3px solid #10b981' }}>
                                        📝 {t.completionNote}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// ════════════════════════════════════════════════════════════════
// 3.  MEMBER TASKS PANEL  (for HM and Teacher — view + submit)
// ════════════════════════════════════════════════════════════════
export const MemberTasksPanel = ({ user, role, memberName, accentColor = '#8b5cf6' }) => {
    const { tasks, startTask, completeTask } = useDeptTaskStore();
    const [selectedTask, setSelectedTask] = useState(null);

    // identifier — use memberName if available, else username
    const ident = memberName || user?.username || '';
    const memberRole = (role || '').toUpperCase();

    const myTasks = tasks.filter(t => {
        // Direct assignment by identifier
        if (t.assignedTo === ident || t.reassignedTo === ident) return true;
        // Role-based (demo mode — show all tasks for this role)
        if (memberRole === 'HEADMASTER' && t.reassignedToRole === 'HEADMASTER') return true;
        if (memberRole === 'TEACHER' && (
            t.reassignedToRole === 'TEACHER' ||
            t.assignedToRole === 'TEACHER'
        )) return true;
        return false;
    });

    if (selectedTask) {
        return (
            <TaskSubmissionView
                task={selectedTask}
                user={user}
                memberName={ident}
                role={role}
                accentColor={accentColor}
                onBack={() => setSelectedTask(null)}
                onStart={() => {
                    startTask(selectedTask.id, ident, ident, role);
                    setSelectedTask(t => ({ ...t, status: 'IN_PROGRESS', startedAt: new Date().toISOString() }));
                }}
                onComplete={(note, deadline) => {
                    completeTask(selectedTask.id, ident, ident, role, note);
                    setSelectedTask(null);
                }}
            />
        );
    }

    return (
        <div>
            {/* Summary row */}
            <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total', value: myTasks.length, color: accentColor },
                    { label: '⏳ Pending', value: myTasks.filter(t => t.status === 'PENDING').length, color: '#f59e0b' },
                    { label: '🔄 In Progress', value: myTasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' },
                    { label: '✅ Done', value: myTasks.filter(t => t.status === 'COMPLETED').length, color: '#10b981' },
                ].map(s => (
                    <div key={s.label} style={{ flex: 1, padding: '0.625rem 0.875rem', background: `${s.color}10`, borderRadius: '0.75rem', border: `1px solid ${s.color}22`, minWidth: '80px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {myTasks.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed #e2e8f0' }}>
                    <ClipboardList size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 0.75rem' }} />
                    No tasks assigned yet. Tasks assigned by your department head will appear here.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {myTasks.map(t => {
                        const isOverdue = t.deadline && new Date(t.deadline) < Date.now() && t.status !== 'COMPLETED';
                        const effectiveStatus = isOverdue ? 'OVERDUE' : t.status;
                        return (
                            <div key={t.id}
                                onClick={() => setSelectedTask(t)}
                                style={{ background: '#fff', borderRadius: '1rem', border: `2px solid ${isOverdue ? '#fee2e2' : '#e2e8f0'}`, padding: '1rem 1.25rem', cursor: 'pointer', transition: 'all 0.18s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{t.title}</span>
                                            <Badge text={t.priority} color={priorityColor[t.priority] || '#94a3b8'} />
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{t.description?.substring(0, 100)}{t.description?.length > 100 ? '…' : ''}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            Assigned by: <strong style={{ color: '#475569' }}>{t.assignedByName || t.assignedBy}</strong>
                                            {t.deadline && <span style={{ marginLeft: '0.75rem', color: isOverdue ? '#ef4444' : '#94a3b8' }}>{fmtDeadline(t.deadline)}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                        <Badge text={statusLabel[effectiveStatus] || effectiveStatus} color={statusColor[effectiveStatus] || '#64748b'} />
                                        <span style={{ fontSize: '0.7rem', color: accentColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            Open <ChevronRight size={11} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// ════════════════════════════════════════════════════════════════
// 4.  TASK SUBMISSION VIEW  (opened when member clicks a task)
// ════════════════════════════════════════════════════════════════
const TaskSubmissionView = ({ task, memberName, role, accentColor, onBack, onStart, onComplete }) => {
    const [note, setNote] = useState('');
    const [timerValue, setTimerValue] = useState('');
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [showConfirmComplete, setShowConfirmComplete] = useState(false);
    const timerRef = useRef(null);

    // Live task from store
    const { tasks } = useDeptTaskStore();
    const liveTask = tasks.find(t => t.id === task.id) || task;

    const isStarted = liveTask.status === 'IN_PROGRESS';
    const isCompleted = liveTask.status === 'COMPLETED';

    const startTimer = () => {
        const mins = parseInt(timerValue, 10);
        if (!mins || mins <= 0) return alert('Enter a valid number of minutes');
        setTimeLeft(mins * 60);
        setTimerRunning(true);
    };

    useEffect(() => {
        if (!timerRunning || timeLeft === null) return;
        if (timeLeft <= 0) {
            setTimerRunning(false);
            alert(`⏰ Timer ended! Please submit your task: "${liveTask.title}"`);
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timerRunning, timeLeft]);

    const fmt = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const isOverdue = liveTask.deadline && new Date(liveTask.deadline) < Date.now() && !isCompleted;

    return (
        <div>
            {/* Back */}
            <button onClick={onBack} style={{ fontSize: '0.82rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                <ArrowLeft size={14} /> Back to My Tasks
            </button>

            {/* Task card */}
            <div style={{ background: '#fff', borderRadius: '1rem', border: `2px solid ${accentColor}33`, marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)`, borderBottom: `1px solid ${accentColor}22` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                        <FileText size={16} color={accentColor} />
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{liveTask.title}</span>
                        <Badge text={liveTask.priority} color={priorityColor[liveTask.priority] || '#94a3b8'} />
                        <Badge text={statusLabel[liveTask.status] || liveTask.status} color={statusColor[liveTask.status] || '#64748b'} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.55 }}>{liveTask.description}</div>
                </div>
                <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Assigned by:</span> <strong style={{ color: '#1e293b' }}>{liveTask.assignedByName || liveTask.assignedBy}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Created:</span> <strong>{fmtDate(liveTask.createdAt)}</strong></div>
                    {liveTask.deadline && <div><span style={{ color: '#94a3b8' }}>Deadline:</span> <strong style={{ color: isOverdue ? '#ef4444' : '#1e293b' }}>{fmtDate(liveTask.deadline)} {isOverdue ? '🔴' : ''}</strong></div>}
                    {liveTask.startedAt && <div><span style={{ color: '#94a3b8' }}>Started:</span> <strong style={{ color: '#3b82f6' }}>{fmtDate(liveTask.startedAt)}</strong></div>}
                    {liveTask.completedAt && <div><span style={{ color: '#94a3b8' }}>Completed:</span> <strong style={{ color: '#10b981' }}>{fmtDate(liveTask.completedAt)}</strong></div>}
                </div>
            </div>

            {isCompleted ? (
                <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '1rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, color: '#166534', fontSize: '1rem' }}>Task Completed!</div>
                    {liveTask.completionNote && <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#15803d' }}>Note: {liveTask.completionNote}</div>}
                </div>
            ) : (
                <>
                    {/* Action Buttons */}
                    <div style={{ background: '#fff', borderRadius: '1rem', border: '1.5px solid #e2e8f0', padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', marginBottom: '1rem' }}>Task Actions</div>
                        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                            {/* Start Task */}
                            <button
                                onClick={!isStarted ? onStart : undefined}
                                disabled={isStarted}
                                style={{
                                    flex: 1, minWidth: '140px',
                                    padding: '0.875rem', borderRadius: '0.75rem',
                                    border: isStarted ? '2px solid #bfdbfe' : '2px solid #3b82f6',
                                    background: isStarted ? '#eff6ff' : '#3b82f6',
                                    color: isStarted ? '#2563eb' : '#fff',
                                    cursor: isStarted ? 'not-allowed' : 'pointer',
                                    fontWeight: 700, fontSize: '0.87rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                    transition: 'all 0.18s',
                                }}
                            >
                                <Play size={16} />
                                {isStarted ? '✓ Task Started (In Progress)' : 'Start Task'}
                            </button>

                            {/* Complete Task */}
                            <button
                                onClick={() => setShowConfirmComplete(true)}
                                disabled={!isStarted}
                                style={{
                                    flex: 1, minWidth: '140px',
                                    padding: '0.875rem', borderRadius: '0.75rem',
                                    border: isStarted ? '2px solid #10b981' : '2px solid #e2e8f0',
                                    background: isStarted ? '#10b981' : '#f1f5f9',
                                    color: isStarted ? '#fff' : '#94a3b8',
                                    cursor: isStarted ? 'pointer' : 'not-allowed',
                                    fontWeight: 700, fontSize: '0.87rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                    transition: 'all 0.18s',
                                }}
                            >
                                <CheckCircle2 size={16} />
                                Complete Task
                            </button>
                        </div>
                        {!isStarted && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>Click "Start Task" first, then "Complete Task" when done.</div>}
                    </div>

                    {/* Timer */}
                    <div style={{ background: '#fff', borderRadius: '1rem', border: '1.5px solid #e2e8f0', padding: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Timer size={15} color="#f59e0b" /> Completion Timer
                        </div>
                        {timerRunning && timeLeft !== null ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: timeLeft < 60 ? '#ef4444' : '#f59e0b', letterSpacing: '0.05em' }}>{fmt(timeLeft)}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.3rem' }}>remaining</div>
                                <button onClick={() => { setTimerRunning(false); setTimeLeft(null); }} style={{ marginTop: '0.75rem', padding: '0.4rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Stop Timer</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <input type="number" value={timerValue} onChange={e => setTimerValue(e.target.value)} placeholder="Minutes to complete"
                                    style={{ flex: 1, padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none' }} />
                                <button onClick={startTimer} style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '0.6rem', background: '#f59e0b', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Timer size={14} /> Set
                                </button>
                            </div>
                        )}
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>Set a timer as a reminder. You'll be alerted when time runs out.</div>
                    </div>

                    {/* Completion Note */}
                    <div style={{ background: '#fff', borderRadius: '1rem', border: '1.5px solid #e2e8f0', padding: '1.25rem' }}>
                        <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', display: 'block', marginBottom: '0.625rem' }}>Completion Note (optional)</label>
                        <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe what was done, any issues encountered, etc."
                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.6rem', fontSize: '0.84rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                </>
            )}

            {/* Confirm Complete Dialog */}
            {showConfirmComplete && (
                <ConfirmAction
                    msg={`Are you sure you want to mark "${liveTask.title}" as Completed?`}
                    onYes={() => { setShowConfirmComplete(false); onComplete(note); }}
                    onNo={() => setShowConfirmComplete(false)}
                />
            )}
        </div>
    );
};
