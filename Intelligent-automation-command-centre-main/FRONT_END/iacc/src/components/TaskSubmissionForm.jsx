import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileText, Calendar, AlertCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskSubmissionForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        priority: 'MEDIUM',
        deadline: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('http://localhost:8081/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to submit task');
            }

            const data = await response.json();
            console.log('Task created:', data);

            setSuccess(`Task submitted successfully! AI detected intent: ${data.intentType || 'Manual Review'}. Risk Score: ${data.riskScore || 'N/A'}`);

            // Reset form
            setFormData({
                title: '',
                description: '',
                department: '',
                priority: 'MEDIUM',
                deadline: ''
            });

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (err) {
            console.error('Task submission error:', err);
            setError(err.message || 'Failed to submit task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="card-enhanced">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Submit New Task Request
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="title" className="label">Task Title *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g., Generate Health Department Monthly Report"
                            className="input-field"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="label">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Provide detailed description of the task..."
                            className="input-field"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="department" className="label">Department *</label>
                            <select
                                id="department"
                                name="department"
                                className="input-field"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="REVENUE">Revenue</option>
                                <option value="HEALTH">Health</option>
                                <option value="EDUCATION">Education</option>
                                <option value="ADMIN">Administration</option>
                                <option value="TRANSPORT">Transport</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority" className="label">Priority *</label>
                            <select
                                id="priority"
                                name="priority"
                                className="input-field"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline" className="label flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Deadline (Optional)
                        </label>
                        <input
                            id="deadline"
                            name="deadline"
                            type="datetime-local"
                            className="input-field"
                            value={formData.deadline}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="error-box flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-box flex items-center gap-2">
                            <Send size={16} />
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-submit w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Processing with AI...
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5 mr-2" />
                                Submit Task
                            </>
                        )}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TaskSubmissionForm;
