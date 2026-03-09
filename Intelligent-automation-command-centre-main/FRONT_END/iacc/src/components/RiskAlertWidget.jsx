import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, CheckCircle, Clock } from 'lucide-react';

const RiskAlertWidget = () => {
    const [highRiskTasks, setHighRiskTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHighRiskTasks();
        // Refresh every 30 seconds
        const interval = setInterval(fetchHighRiskTasks, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchHighRiskTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:8081/api/tasks/high-risk', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHighRiskTasks(data);
            }
        } catch (err) {
            console.error('Failed to fetch high-risk tasks:', err);
            setError('Failed to load risk alerts');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (score) => {
        if (score >= 90) return 'text-red-600 bg-red-100';
        if (score >= 75) return 'text-orange-600 bg-orange-100';
        return 'text-yellow-600 bg-yellow-100';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'IN_PROGRESS': return <Activity className="h-4 w-4 text-blue-500" />;
            case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <Card className="card-enhanced">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Risk Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="card-enhanced border-l-4 border-l-orange-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Alerts
                    {highRiskTasks.length > 0 && (
                        <span className="ml-auto text-sm font-normal px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            {highRiskTasks.length} Critical
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="text-sm text-red-600 mb-4">{error}</div>
                )}

                {highRiskTasks.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">No high-risk tasks</p>
                        <p className="text-sm text-muted-foreground">All systems operating normally</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {highRiskTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-3 border border-border rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {task.description}
                                        </p>
                                    </div>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(task.riskScore)}`}>
                                        {task.riskScore}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(task.status)}
                                        <span>{task.status}</span>
                                    </div>

                                    {task.intentType && (
                                        <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            {task.intentType}
                                        </div>
                                    )}

                                    {task.assignedBotType && (
                                        <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                            🤖 {task.assignedBotType}
                                        </div>
                                    )}
                                </div>

                                {task.risk_reason && (
                                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                        ⚠️ {task.risk_reason}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RiskAlertWidget;
