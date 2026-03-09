import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Activity, AlertTriangle } from 'lucide-react';
import { useTaskStore, computeDeptStats } from '../data/taskStore';

const AdminDepartmentsPage = () => {
    const { tasks, initialize, loading } = useTaskStore();

    // Department data structure
    const departments = [
        { name: 'Health', id: 'HEALTH', color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Revenue', id: 'REVENUE', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Education', id: 'EDUCATION', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Transport', id: 'TRANSPORT', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Finance', id: 'FINANCE', color: 'text-teal-500', bg: 'bg-teal-500/10' }
    ];

    useEffect(() => {
        initialize();
    }, [initialize]);

    const deptStats = computeDeptStats(tasks);
    const summary = deptStats.ALL || { total: 0, pending: 0, highRisk: 0 };

    if (loading && tasks.length === 0) {
        return <div className="p-6 text-slate-500">Loading Department Data...</div>;
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Department Health Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {departments.map((dept) => {
                    const stats = deptStats[dept.id] || { total: 0, pending: 0 };
                    return (
                        <Card key={dept.id} className="bg-white border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className={`h-1.5 w-full ${dept.bg.replace('/10', '')}`} />
                            <CardHeader className="pb-2">
                                <CardTitle className={`flex items-center gap-2 ${dept.color}`}>
                                    <Activity size={20} />
                                    {dept.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 text-sm font-medium">Status</span>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                            Operational
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                                            <div className="text-xs text-slate-500 font-medium">Total Tasks</div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                            <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
                                            <div className="text-xs text-slate-500 font-medium">Pending</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8">
                <Card className="bg-white border-red-200 shadow-lg overflow-hidden">
                    <div className="h-1 bg-red-500"></div>
                    <CardHeader className="bg-red-50 border-b border-red-100">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertTriangle size={20} /> System Wide Alert Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="text-red-600 h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-800">High Risk Tasks Detected</div>
                                <div className="text-sm text-slate-500">{summary.highRisk || 0} tasks require immediate attention</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDepartmentsPage;
