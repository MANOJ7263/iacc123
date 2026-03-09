import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AuditLogsPage = () => {
    const logs = [
        { id: 'LOG-9821', user: 'System (Bot)', action: 'Task Completed', resource: 'Task #4591', time: '12:31:05', status: 'success' },
        { id: 'LOG-9820', user: 'admin@district.gov.in', action: 'User Login', resource: 'Dashboard', time: '12:30:15', status: 'success' },
        { id: 'LOG-9819', user: 'Revenue_Head', action: 'Approval Granted', resource: 'Budget Request #88', time: '12:28:42', status: 'success' },
        { id: 'LOG-9818', user: 'Bot_Health_02', action: 'Data Validation Failed', resource: 'Patient Record #442', time: '12:15:00', status: 'error' },
        { id: 'LOG-9817', user: 'Education_Admin', action: 'Report Generated', resource: 'Annual Summary', time: '11:55:23', status: 'success' },
        { id: 'LOG-9816', user: 'System', action: 'Backup Scheduled', resource: 'Database', time: '11:00:00', status: 'info' },
    ];

    return (
        <div className="space-y-8 p-1 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-responsive-xl text-gradient tracking-tight">Audit Logs</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Comprehensive log of all system activities for compliance and monitoring.
                </p>
            </div>

            <Card className="card-enhanced border-0 shadow-sm">
                <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-border">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            className="input-enhanced pl-9 bg-slate-50/50"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                        <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Log ID</th>
                                <th className="px-6 py-4">User / Actor</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Resource</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{log.id}</td>
                                    <td className="px-6 py-4 font-medium">{log.user}</td>
                                    <td className="px-6 py-4">{log.action}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{log.resource}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.time}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                                            ${log.status === 'success' ? 'bg-green-100 text-green-700' :
                                                log.status === 'error' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-border bg-slate-50/30 text-xs text-center text-muted-foreground">
                    Showing recent 6 logs.
                </div>
            </Card>
        </div>
    );
};

export default AuditLogsPage;
