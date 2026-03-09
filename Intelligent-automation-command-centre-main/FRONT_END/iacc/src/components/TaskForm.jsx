import React, { useState } from 'react';
import { taskService } from '@/services/api';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        priority: 'Normal',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const departments = ['Revenue', 'Public Works', 'Health', 'Education', 'Police'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await taskService.createTask(formData);
            setSuccess(true);
            setFormData({ title: '', department: '', priority: 'Normal', description: '' });
        } catch (err) {
            setError('Failed to submit task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px' }}>
            <div className="card-header">
                <h3 className="card-title">Submit New Work Request</h3>
            </div>
            <div className="card-content">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {success && (
                        <div className="p-4" style={{ backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '0.375rem' }}>
                            Request submitted successfully!
                        </div>
                    )}

                    {error && (
                        <div className="p-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.375rem' }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="label" htmlFor="title">Task Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Update Land Records"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="department">Department</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="department"
                                name="department"
                                className="input"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            className="input"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="label" htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            className="input"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide details about the work request..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default TaskForm;
