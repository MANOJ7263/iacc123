import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { taskService } from '@/services/api';
import { Loader2, Send, AlertTriangle, FileText, CheckCircle2, Bot, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MyTaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskService.getMyTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch my tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (loading) return <div className="p-4"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-slate-800">My Recent Submissions</h3>
            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-slate-500 italic">No tasks submitted yet.</p>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="card-enhanced border-l-4 border-l-blue-500">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-800">{task.title}</h4>
                                    <p className="text-sm text-slate-500">
                                        Bot: {task.assignedBotType || 'Manual'} | Risk: {task.riskLevel}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        task.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {task.status}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

const TaskSubmissionPage = () => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const onSubmit = async (data) => {
        setLoading(true);
        setSuccess(null);
        setAiAnalysis(null);

        try {
            const payload = {
                title: data.title,
                description: data.description,
                department: data.department,
                priority: data.priority,
                deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
                status: "PENDING"
            };

            const result = await taskService.createTask(payload);

            setSuccess("Task submitted successfully! ID: " + result.id);

            // Store AI analysis result to show immediate feedback
            if (result.aiClassification || result.riskLevel) {
                setAiAnalysis({
                    classification: result.aiClassification,
                    botType: result.assignedBotType,
                    risk: result.riskLevel,
                    riskReason: result.risk_reason
                });
            }

            reset();
            setRefreshTrigger(prev => prev + 1); // Refresh the list
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error response:", error.response);

            // Check token
            const token = localStorage.getItem('token');
            console.log("Token exists:", !!token);

            // Better error messages
            if (error.response?.status === 401) {
                setSuccess("❌ Authentication failed. Please logout and login again.");
            } else if (error.response?.status === 403) {
                setSuccess("❌ You don't have permission to create tasks. Check your role.");
            } else if (error.response?.data?.message) {
                setSuccess("❌ Error: " + error.response.data.message);
            } else {
                setSuccess("❌ Error submitting task. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">Create New Task</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Submit a task to the IACC engine. Our AI will automatically analyze, classify, and route it to the appropriate department or automated bot.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-6">
                    <Card className="card-enhanced border-0 shadow-lg overflow-hidden relative">
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <CardHeader className="pb-6 border-b border-border/50 bg-slate-50/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Task Details</CardTitle>
                                    <CardDescription className="mt-1">
                                        Provide comprehensive details for accurate AI processing
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Task Title</label>
                                    <Input
                                        placeholder="e.g., Generate Monthly Revenue Report"
                                        className="input-enhanced h-12 px-4 bg-slate-50/50"
                                        {...register("title", { required: true })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Description</label>
                                    <Textarea
                                        placeholder="Provide necessary details. The AI looks for keywords like 'Report', 'Email', or 'Analyze'..."
                                        className="input-enhanced min-h-[120px] p-4 bg-slate-50/50 resize-y"
                                        {...register("description", { required: true })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80 ml-1">Department</label>
                                        <Select onValueChange={(val) => setValue("department", val)}>
                                            <SelectTrigger className="input-enhanced h-12 bg-slate-50/50">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="REVENUE">Revenue Dept</SelectItem>
                                                <SelectItem value="HEALTH">Health Dept</SelectItem>
                                                <SelectItem value="EDUCATION">Education Dept</SelectItem>
                                                <SelectItem value="ADMIN">Administration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80 ml-1">Priority Level</label>
                                        <Select onValueChange={(val) => setValue("priority", val)}>
                                            <SelectTrigger className="input-enhanced h-12 bg-slate-50/50">
                                                <SelectValue placeholder="Set Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HIGH">
                                                    <span className="flex items-center text-red-600 font-medium">🔥 High Priority</span>
                                                </SelectItem>
                                                <SelectItem value="MEDIUM">
                                                    <span className="flex items-center text-orange-600 font-medium">⚡ Medium Priority</span>
                                                </SelectItem>
                                                <SelectItem value="LOW">
                                                    <span className="flex items-center text-blue-600 font-medium">☕ Low Priority</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Deadline (Optional)</label>
                                    <Input
                                        type="datetime-local"
                                        className="input-enhanced h-12 px-4 bg-slate-50/50"
                                        {...register("deadline")}
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="btn-enhanced w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Processing Task...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="h-5 w-5" />
                                                Submit Task to Engine
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* My Recent Tasks List */}
                    <MyTaskList key={refreshTrigger} />
                </div>

                <div className="lg:col-span-2 space-y-6 slide-in-right">
                    {/* Instructions Card */}
                    <div className="card-enhanced p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                        <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                            <BrainCircuit className="h-5 w-5 text-blue-400" />
                            AI Processing Logic
                        </h3>
                        <div className="space-y-4 text-slate-300 text-sm">
                            <p>
                                The IACC engine analyzes your request in real-time. Here's how to get the best results:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                    <span>Use specific keywords like <strong>"Generate Invoice"</strong> or <strong>"Compliance Check"</strong>.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                    <span>Mention department names correctly for faster routing.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    <span>High-risk descriptions trigger manual review automatically.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-4">
                        {success && (
                            <div className="state-success rounded-xl p-4 shadow-sm animate-in zoom-in-95 duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="p-1 bg-green-100 rounded-full">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-900">Submission Successful</h4>
                                        <p className="text-sm text-green-700 mt-1">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {aiAnalysis && (
                            <Card className="card-enhanced border-indigo-200 bg-gradient-to-b from-indigo-50/80 to-white overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="bg-indigo-100/50 border-b border-indigo-100 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-indigo-700 text-lg">
                                        <Bot className="h-5 w-5" />
                                        AI Analysis Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    {aiAnalysis.classification && (
                                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-indigo-100 shadow-sm">
                                            <span className="text-sm font-medium text-slate-600">Intent Detected</span>
                                            <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                                                {aiAnalysis.classification}
                                            </span>
                                        </div>
                                    )}

                                    {aiAnalysis.botType && (
                                        <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-indigo-100 shadow-sm">
                                            <span className="text-sm font-medium text-slate-600">Bot Assigned</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold font-mono tracking-wide border border-blue-200">
                                                {aiAnalysis.botType}
                                            </span>
                                        </div>
                                    )}

                                    {aiAnalysis.risk === 'HIGH' && (
                                        <div className="state-error rounded-lg p-4 bg-red-50/80 border-l-4 border-red-500">
                                            <div className="flex items-center text-red-700 font-bold mb-1.5">
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                High Risk Detected
                                            </div>
                                            <p className="text-xs text-red-600 leading-relaxed font-medium">
                                                Reason: {aiAnalysis.riskReason}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskSubmissionPage;
