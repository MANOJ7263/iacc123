import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { CheckCircle, Clock, Check, User, Bot, ArrowRight } from 'lucide-react';

import useDeptTaskStore from '../data/deptTaskStore';

const AdminTaskStatusPage = () => {
    const { tasks } = useDeptTaskStore();
    const [loading, setLoading] = useState(true);

    // Only collector-initiated tasks
    const collectorTasks = tasks.filter(t => t.fromCollector || t.assignedByRole === 'COLLECTOR');

    useEffect(() => {
        // Simulate loading briefly
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const getStatusStep = (task) => {
        if (task.status === 'COMPLETED') return 3;
        if (task.status === 'IN_PROGRESS' || task.status === 'OVERDUE') return 3;
        if (task.reassignedTo) return 2; // Dept head delegated to a subordinate
        return 1; // Created, waiting for dept head action
    };

    const getDisplayStatus = (task) => {
        if (task.status === 'COMPLETED') return 'COMPLETED';
        if (task.status === 'IN_PROGRESS') return 'IN PROGRESS';
        if (task.status === 'OVERDUE') return 'OVERDUE';
        if (task.reassignedTo) return 'DEPT ASSIGNED';
        return 'PENDING DEPT ACTION';
    };

    if (loading) return <div className="p-6 text-slate-600 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy"></div></div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Task Execution Status
            </h1>

            <div className="space-y-4">
                {collectorTasks.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <CheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No delegated tasks found</h3>
                        <p className="mt-1">Tasks you delegate to department heads will appear here.</p>
                    </div>
                ) : collectorTasks.map((task) => {
                    const step = getStatusStep(task);
                    const displayStatus = getDisplayStatus(task);
                    return (
                        <Card key={task.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{task.title}</h3>
                                        <p className="text-sm text-slate-500 font-mono mt-1">ID: #{task.id} • Dept: {task.department}</p>
                                        {task.reassignedToName && (
                                            <p className="text-sm text-indigo-600 font-semibold mt-1">
                                                ↳ Delegated to: {task.reassignedToName}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 
                                        ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                        {displayStatus}
                                    </span>
                                </div>

                                {/* Stepper UI */}
                                <div className="relative flex items-center justify-between w-full mt-2 px-2">
                                    {/* Progress Bar Background */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-0"></div>
                                    {/* Active Progress Bar (Approximation based on step) */}
                                    <div
                                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full -z-0 transition-all duration-500`}
                                        style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : step === 3 ? '100%' : '0%' }}
                                    ></div>

                                    {/* Step 1: Admin Created */}
                                    <div className={`relative z-10 flex flex-col items-center gap-2 group`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white
                                            ${step >= 1 ? 'border-blue-500 text-blue-600 shadow-md' : 'border-slate-200 text-slate-300'}`}>
                                            <User size={20} />
                                        </div>
                                        <span className={`text-xs font-semibold mt-1 ${step >= 1 ? 'text-blue-700' : 'text-slate-400'}`}>Admin Initiated</span>
                                    </div>

                                    {/* Step 2: Dept Head Assigned */}
                                    <div className={`relative z-10 flex flex-col items-center gap-2`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white
                                            ${step >= 2 ? 'border-amber-500 text-amber-600 shadow-md' : 'border-slate-200 text-slate-300'}`}>
                                            <CheckCircle size={20} />
                                        </div>
                                        <span className={`text-xs font-semibold mt-1 ${step >= 2 ? 'text-amber-700' : 'text-slate-400'}`}>Dept Assigned</span>
                                    </div>

                                    {/* Step 3: Execution */}
                                    <div className={`relative z-10 flex flex-col items-center gap-2`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white
                                            ${step >= 3 ? 'border-green-500 text-green-600 shadow-md' : 'border-slate-200 text-slate-300'}`}>
                                            <Bot size={20} />
                                        </div>
                                        <span className={`text-xs font-semibold mt-1 ${step >= 3 ? 'text-green-700' : 'text-slate-400'}`}>Execution</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminTaskStatusPage;
