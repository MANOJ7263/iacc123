import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Play, Pause, RefreshCw, Settings, AlertCircle, CheckCircle2, History, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { taskService } from '@/services/api';

const AutomationPage = () => {
    const [bots, setBots] = useState([
        { id: 'BOT-001', name: 'Invoice Processor', status: 'running', uptime: '99.8%', tasks: 1240, type: 'Financial' },
        { id: 'BOT-002', name: 'Email Classifier', status: 'running', uptime: '99.9%', tasks: 850, type: 'Communication' },
        { id: 'BOT-003', name: 'Data Validator', status: 'paused', uptime: '95.5%', tasks: 420, type: 'Data Quality' },
        { id: 'BOT-004', name: 'Compliance Checker', status: 'error', uptime: '92.1%', tasks: 115, type: 'Audit' },
        { id: 'BOT-005', name: 'Report Generator', status: 'idle', uptime: '98.2%', tasks: 300, type: 'Reporting' },
    ]);

    const [failedTasks, setFailedTasks] = useState([]);

    React.useEffect(() => {
        const fetchFailed = async () => {
            try {
                const all = await taskService.getAllTasks();
                setFailedTasks(all.filter(t => t.status === 'FAILED' || t.status === 'REJECTED'));
            } catch (e) {
                console.error(e);
            }
        };
        fetchFailed();
    }, []);

    const toggleBot = (id) => {
        setBots(bots.map(b => {
            if (b.id === id) {
                return { ...b, status: b.status === 'running' ? 'paused' : 'running' };
            }
            return b;
        }));
    };

    const restartBot = (id) => {
        alert(`Initiating recovery sequence for ${id}...`);
        setTimeout(() => {
            setBots(bots.map(b => b.id === id ? { ...b, status: 'running' } : b));
        }, 1500);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'running': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'paused': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">Automation Supervisor</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Manage and monitor your fleet of intelligent automation bots.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bots.map((bot, index) => (
                    <div key={bot.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card className="card-enhanced hover-lift border-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    {bot.name}
                                </CardTitle>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase flex items-center gap-1.5 ${getStatusColor(bot.status)}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'running' ? 'bg-green-500 animate-pulse' : bot.status === 'error' ? 'bg-red-500' : 'bg-current'}`} />
                                    {bot.status}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 mt-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Bot ID</span>
                                        <span className="font-mono font-medium">{bot.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Tasks Processed</span>
                                        <span className="font-bold">{bot.tasks.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Uptime</span>
                                        <span className="font-medium text-green-600">{bot.uptime}</span>
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-slate-50" onClick={() => toggleBot(bot.id)}>
                                            {bot.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                            {bot.status === 'running' ? 'Pause' : 'Start'}
                                        </Button>
                                        <Button
                                            variant={bot.status === 'error' ? "destructive" : "outline"}
                                            size="sm"
                                            className="px-3 hover:bg-slate-50"
                                            onClick={() => restartBot(bot.id)}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${bot.status === 'error' ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Failure Recovery & Logs */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="card-enhanced">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-slate-500" />
                                System Audit Logs & Failures
                            </CardTitle>
                            <CardDescription>Recent failed tasks requiring manual intervention or retry</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Dept</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {failedTasks.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                                No system failures detected.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        failedTasks.map(task => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.title}</TableCell>
                                                <TableCell>{task.department}</TableCell>
                                                <TableCell>
                                                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">{task.status}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline">Retry</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="card-enhanced bg-slate-900 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300">
                                <History className="h-4 w-4" /> View Full History
                            </Button>
                            <Button className="w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300">
                                <Settings className="h-4 w-4" /> Bot Configuration
                            </Button>
                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-3">System Status</p>
                                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    All Orchestrators Online
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AutomationPage;
