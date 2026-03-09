/**
 * NotificationBell.jsx  — reusable bell with dropdown
 * Reads from deptTaskStore; works for any logged-in user
 */
import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import useDeptTaskStore from '../../data/deptTaskStore';

const typeColors = { task_assigned: '#3b82f6', task_completed: '#10b981', task_overdue: '#ef4444' };

const NotificationBell = ({ username, accentColor = '#3b82f6' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const { getMyNotifs, getUnreadCount, markRead, markAllRead } = useDeptTaskStore();

    const notifs = getMyNotifs(username || '');
    const unread = getUnreadCount(username || '');

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fmt = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                className="edu-icon-btn"
                onClick={() => setOpen(o => !o)}
                style={{ position: 'relative' }}
                title="Notifications"
            >
                <Bell size={18} />
                {unread > 0 && (
                    <span style={{
                        position: 'absolute', top: '-5px', right: '-5px',
                        background: '#ef4444', color: '#fff', borderRadius: '50%',
                        minWidth: '17px', height: '17px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.58rem', fontWeight: 800, padding: '0 3px',
                        boxShadow: '0 0 0 2px #fff',
                    }}>{unread > 9 ? '9+' : unread}</span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    width: '340px', background: '#fff',
                    borderRadius: '1rem', border: '1.5px solid #e2e8f0',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                    zIndex: 9999, overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{ padding: '0.875rem 1rem 0.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc, #fff)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bell size={14} color={accentColor} />
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>Notifications</span>
                            {unread > 0 && (
                                <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', borderRadius: '99px', padding: '0.05rem 0.4rem', fontWeight: 700 }}>{unread} new</span>
                            )}
                        </div>
                        {unread > 0 && (
                            <button
                                onClick={() => markAllRead(username)}
                                style={{ fontSize: '0.72rem', color: accentColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                                <CheckCheck size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {notifs.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                <Bell size={28} style={{ opacity: 0.3, display: 'block', margin: '0 auto 0.5rem' }} />
                                No notifications yet
                            </div>
                        ) : notifs.slice(0, 20).map(n => (
                            <div
                                key={n.id}
                                onClick={() => { markRead(n.id); }}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderBottom: '1px solid #f8fafc',
                                    background: n.read ? '#fff' : `${typeColors[n.type] || '#3b82f6'}08`,
                                    cursor: 'pointer',
                                    display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
                                    transition: 'background 0.15s',
                                }}
                            >
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: n.read ? '#cbd5e1' : (typeColors[n.type] || '#3b82f6'),
                                    flexShrink: 0, marginTop: '0.35rem',
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.81rem', color: '#1e293b', fontWeight: n.read ? 400 : 600, lineHeight: 1.45 }}>{n.message}</div>
                                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>{fmt(n.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {notifs.length > 0 && (
                        <div style={{ padding: '0.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{notifs.length} total notification{notifs.length !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
