import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp, ArrowRight, Loader2, X, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { taskService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Department Detail Modal
const DepartmentDetailModal = ({ department, onClose }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED

    useEffect(() => {
        fetchDepartmentTasks();
    }, [department]);

    const fetchDepartmentTasks = async () => {
        setLoading(true);
        try {
            const allTasks = await taskService.getAllTasks();
            // Filter by department
            const deptTasks = allTasks.filter(t => t.department === department.name.toUpperCase());
            setTasks(deptTasks);
        } catch (error) {
            console.error("Failed to fetch department tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'ALL') return true;
        if (filter === 'PENDING') return task.status === 'PENDING' || task.status === 'PENDING_APPROVAL';
        if (filter === 'APPROVED') return task.status === 'APPROVED' || task.status === 'IN_PROGRESS' || task.status === 'COMPLETED';
        if (filter === 'REJECTED') return task.status === 'REJECTED';
        return true;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'PENDING' || t.status === 'PENDING_APPROVAL').length,
        approved: tasks.filter(t => t.status === 'APPROVED' || t.status === 'IN_PROGRESS').length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        rejected: tasks.filter(t => t.status === 'REJECTED').length,
        highRisk: tasks.filter(t => t.riskLevel === 'HIGH').length
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{department.name} Department</h2>
                            <p className="text-blue-100">Detailed task management and analytics</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 bg-slate-50 border-b">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <div className="text-xs text-slate-600 mt-1">Total Tasks</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-xs text-slate-600 mt-1">Pending</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
                        <div className="text-xs text-slate-600 mt-1">Approved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-xs text-slate-600 mt-1">Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        <div className="text-xs text-slate-600 mt-1">Rejected</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.highRisk}</div>
                        <div className="text-xs text-slate-600 mt-1">High Risk</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-4 border-b bg-white">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Tasks Table */}
                <div className="overflow-auto max-h-[50vh] p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                            <p>No tasks found for this filter</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Risk</TableHead>
                                    <TableHead>Bot</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id} className="hover:bg-slate-50">
                                        <TableCell className="font-mono text-sm">#{task.id}</TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                task.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${task.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                task.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {task.riskLevel}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {task.assignedBotType || 'Manual'}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
};

// Task Queue Component
const DepartmentTaskQueue = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskService.getAllTasks();
            // Get user's department from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userDept = user.department;

            // Filter tasks by user's department
            const deptTasks = userDept ? data.filter(t => t.department === userDept) : data;
            setTasks(deptTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDecision = async (taskId, decision) => {
        if (!confirm(`Are you sure you want to ${decision} this task?`)) return;
        try {
            await taskService.approveTask(taskId, decision, "Reviewed by Department Head");
            fetchTasks(); // Refresh
            alert(`Task ${decision.toLowerCase()}d successfully!`);
        } catch (error) {
            alert("Failed to update task: " + error.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );

    const pendingTasks = tasks.filter(t =>
        t.status === 'PENDING' ||
        t.status === 'PENDING_APPROVAL' ||
        t.riskLevel === 'HIGH'
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Task Approval Queue</h3>
                <span className="text-sm text-slate-600">
                    {pendingTasks.length} tasks pending review
                </span>
            </div>

            {/* Admin Delegated Tasks Section */}
            {tasks.filter(t => t.status === 'PENDING_DEPT_ASSIGNMENT').length > 0 && (
                <Card className="card-enhanced border-l-4 border-l-purple-500">
                    <CardHeader>
                        <CardTitle className="text-purple-700 flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Admin Delegated Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Instructions</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.filter(t => t.status === 'PENDING_DEPT_ASSIGNMENT').map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.title}</TableCell>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>
                                            <Button
                                                className="bg-purple-600 hover:bg-purple-700"
                                                onClick={() => {
                                                    const staffUsername = prompt("Enter Staff Username to Assign:");
                                                    if (staffUsername) {
                                                        // In a real app, use a modal with dropdown
                                                        axios.post(`http://localhost:8080/api/tasks/${task.id}/assign`, { staffUsername }, {
                                                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                                        }).then(() => {
                                                            alert("Assigned!");
                                                            fetchTasks();
                                                        }).catch(err => alert("Failed: " + (err.response?.data?.message || err.message)));
                                                    }
                                                }}
                                            >
                                                Assign to Staff
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Card className="card-enhanced">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Risk</TableHead>
                                <TableHead>Bot Assigned</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                        <p className="text-slate-600 font-medium">All caught up!</p>
                                        <p className="text-sm text-slate-500 mt-1">No pending tasks require your approval</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingTasks.map((task) => (
                                    <TableRow key={task.id} className="hover:bg-slate-50">
                                        <TableCell className="font-mono text-sm">#{task.id}</TableCell>
                                        <TableCell className="font-medium max-w-xs">
                                            <div className="truncate">{task.title}</div>
                                            <div className="text-xs text-slate-500 mt-1 truncate">{task.description}</div>
                                        </TableCell>
                                        <TableCell>{task.department}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit ${task.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                task.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {task.riskLevel === 'HIGH' && <AlertTriangle className="h-3 w-3" />}
                                                {task.riskLevel}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {task.assignedBotType || 'Manual Review'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                                                <Clock className="h-3 w-3" />
                                                {task.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleDecision(task.id, 'APPROVE')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDecision(task.id, 'REJECT')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

// Main DepartmentsPage
const DepartmentsPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [userDept, setUserDept] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.department) setUserDept(user.department);
    }, []);

    const allDepartments = [
        { name: 'Revenue', staff: 45, tasks: 1250, efficiency: 94, color: 'blue' },
        { name: 'Health', staff: 62, tasks: 3400, efficiency: 98, color: 'emerald' },
        { name: 'Education', staff: 38, tasks: 890, efficiency: 88, color: 'amber' },
        { name: 'Administration', staff: 25, tasks: 450, efficiency: 92, color: 'purple' },
        { name: 'Transport', staff: 30, tasks: 670, efficiency: 85, color: 'cyan' },
        { name: 'Public Works', staff: 55, tasks: 1100, efficiency: 90, color: 'orange' },
    ];

    // Filter departments: If user has a dept, only show that one. If Admin/Collector (who shouldn't be here typically but might), show all.
    const departments = userDept
        ? allDepartments.filter(d => d.name.toUpperCase() === userDept.toUpperCase())
        : allDepartments;

    const dynamicTitle = userDept
        ? `${userDept} Command Center`
        : "Department Head Dashboard";

    const getTheme = (color) => {
        const themes = {
            blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
            emerald: { bg: 'bg-emerald-500', lightBg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
            amber: { bg: 'bg-amber-500', lightBg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' },
            purple: { bg: 'bg-purple-500', lightBg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
            cyan: { bg: 'bg-cyan-500', lightBg: 'bg-cyan-100', text: 'text-cyan-600', icon: 'text-cyan-600' },
            orange: { bg: 'bg-orange-500', lightBg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' }
        };
        return themes[color] || themes['blue'];
    };

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">{dynamicTitle}</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Manage and approve tasks for {userDept || 'all departments'}. Click on a card for detailed analytics.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map((dept, index) => {
                    const theme = getTheme(dept.color);
                    return (
                        <div key={dept.name} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Card
                                className="card-enhanced hover-lift border-0 overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedDepartment(dept)}
                            >
                                <div className={`h-1.5 w-full ${theme.bg}`} />
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex justify-between items-center">
                                        <span className="text-xl">{dept.name}</span>
                                        <div className={`p-2 rounded-lg ${theme.lightBg}`}>
                                            <Building2 className={`h-6 w-6 ${theme.icon}`} />
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5" /> Staff
                                            </p>
                                            <p className="text-2xl font-bold">{dept.staff}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5" /> Tasks
                                            </p>
                                            <p className="text-2xl font-bold">{dept.tasks.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span className="text-green-600">{dept.efficiency}% Efficiency</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Task Queue Section */}
            <DepartmentTaskQueue />

            {/* Department Detail Modal */}
            {selectedDepartment && (
                <DepartmentDetailModal
                    department={selectedDepartment}
                    onClose={() => setSelectedDepartment(null)}
                />
            )}
        </div>
    );
};

export default DepartmentsPage;
