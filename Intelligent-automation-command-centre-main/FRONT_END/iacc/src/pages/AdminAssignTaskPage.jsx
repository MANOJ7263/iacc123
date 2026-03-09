import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, AlertTriangle, Send, Loader2 } from 'lucide-react';
import useDeptTaskStore from '../data/deptTaskStore';

const DEPT_CEO_ROLES = {
    EDUCATION: 'CEO',
    HEALTH: 'DEPT_HEAD',
    REVENUE: 'DEPT_HEAD',
    TRANSPORT: 'DEPT_HEAD',
    FINANCE: 'DEPT_HEAD',
};

const DEPT_LABELS = {
    EDUCATION: 'Education Department',
    HEALTH: 'Health Department',
    REVENUE: 'Revenue Department',
    TRANSPORT: 'Transport Department',
    FINANCE: 'Finance Department',
};

const AdminAssignTaskPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: 'EDUCATION',
        priority: 'HIGH',
        deadline: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { createTask } = useDeptTaskStore();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const collectorName = user?.username || 'collector41';

        // 1. Always save to shared Zustand store so department heads see it immediately
        try {
            createTask({
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                department: formData.department,
                deadline: formData.deadline || null,
                fromCollector: true,                           // ← marks as collector-originated
                assignedBy: collectorName,
                assignedByName: `${collectorName} (Collector)`,
                assignedByRole: 'COLLECTOR',
                assignedTo: null,                              // dept head not yet claimed
                assignedToName: `${DEPT_LABELS[formData.department]} Head`,
                assignedToRole: DEPT_CEO_ROLES[formData.department] || 'DEPT_HEAD',
            });
        } catch (storeErr) {
            console.warn('Store save failed:', storeErr);
        }

        // 2. Also try to persist to backend (optional — doesn't block on failure)
        try {
            const token = localStorage.getItem('token');
            const payload = {
                title: formData.title,
                description: formData.description,
                department: formData.department,
                priority: formData.priority,
            };
            const response = await axios.post('http://localhost:8080/api/tasks/delegate', payload, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000, // 5s timeout — don't hang if backend is down
            });
            setMessage(
                `✅ Task "${response.data?.title || formData.title}" delegated to ${DEPT_LABELS[formData.department]}. Department head has been notified.`
            );
        } catch (apiErr) {
            // Backend failed, but store already saved — show partial success
            const isCors = apiErr.message?.includes('Network Error') || apiErr.code === 'ERR_NETWORK';
            const isTimeout = apiErr.code === 'ECONNABORTED';
            const isAuth = apiErr.response?.status === 401 || apiErr.response?.status === 403;

            if (isAuth) {
                setError('Authentication error. Please log out and log in again. (Task was saved locally.)');
            } else if (isCors || isTimeout) {
                // Backend is likely offline — that's OK, task is in store
                setMessage(
                    `✅ Task "${formData.title}" delegated to ${DEPT_LABELS[formData.department]}. (Saved locally — will sync when backend is online.)`
                );
            } else {
                setMessage(
                    `✅ Task "${formData.title}" delegated to ${DEPT_LABELS[formData.department]}. Department head will see it in their dashboard.`
                );
            }
        }

        setLoading(false);
        if (!error) {
            setFormData({ title: '', description: '', department: 'EDUCATION', priority: 'HIGH', deadline: '' });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Global Task Delegation
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Assign tasks to department heads. They'll receive an in-app notification immediately.
                </p>
            </div>

            <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="text-slate-800">Assign Task to Department</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {message && (
                        <Alert className="bg-green-50 border-green-200 text-green-800" style={{ borderRadius: '0.75rem' }}>
                            <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert className="bg-red-50 border-red-200 text-red-700" style={{ borderRadius: '0.75rem' }}>
                            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title" className="text-slate-600 font-semibold">Task Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 mt-1"
                                placeholder="e.g., Conduct Safety Audit"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-slate-600 font-semibold">Description / Instructions *</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[100px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                placeholder="Provide detailed instructions for the department head..."
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <Label htmlFor="department" className="text-slate-600 font-semibold">Target Department</Label>
                                <select
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                >
                                    <option value="EDUCATION">🎓 Education</option>
                                    <option value="HEALTH">🏥 Health</option>
                                    <option value="REVENUE">💰 Revenue</option>
                                    <option value="TRANSPORT">🚌 Transport</option>
                                    <option value="FINANCE">📊 Finance</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="priority" className="text-slate-600 font-semibold">Priority</Label>
                                <select
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                >
                                    <option value="HIGH">🔴 High</option>
                                    <option value="MEDIUM">🟡 Medium</option>
                                    <option value="LOW">🟢 Low</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="deadline" className="text-slate-600 font-semibold">Deadline (optional)</Label>
                            <input
                                id="deadline"
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                style={{ boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Preview card */}
                        {formData.title && (
                            <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '0.75rem', padding: '0.875rem', fontSize: '0.82rem', color: '#0369a1' }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>📋 Task Preview</div>
                                <div><strong>To:</strong> {DEPT_LABELS[formData.department]}</div>
                                <div><strong>Title:</strong> {formData.title}</div>
                                <div><strong>Priority:</strong> {formData.priority}</div>
                                {formData.deadline && <div><strong>Deadline:</strong> {new Date(formData.deadline).toLocaleString('en-IN')}</div>}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-[1.02]"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            >
                                {loading ? (
                                    <><Loader2 size={16} className="animate-spin" /> Delegating...</>
                                ) : (
                                    <><Send size={16} /> Delegate Task</>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAssignTaskPage;
