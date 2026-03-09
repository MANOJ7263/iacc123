import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Ensure strictly "Bearer <token>"
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const taskService = {
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    getMyTasks: async () => {
        const response = await api.get('/tasks/my');
        return response.data;
    },
    approveTask: async (id, decision, reason) => {
        const response = await api.post(`/tasks/${id}/decision`, { decision, reason });
        return response.data;
    },
    escalateTask: async (id) => {
        const response = await api.post(`/tasks/${id}/escalate`);
        return response.data;
    },
    getCollectorSummary: async () => {
        const response = await api.get('/tasks/analytics');
        return response.data;
    },
    downloadReport: async () => {
        const response = await api.get('/reports/export/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tasks_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },
    getAutomationStatus: async () => {
        const response = await api.get('/tasks/automation/status');
        return response.data;
    },
    retryTask: async (id) => {
        const response = await api.post(`/tasks/${id}/retry`);
        return response.data;
    }
};

// ─── Department Data Service — reads from MySQL via /api/dept/* ─────────────
export const deptService = {

    // Overview across all departments
    getOverview: () => api.get('/dept/overview').then(r => r.data),

    // Education
    education: {
        getDistrict: () => api.get('/dept/education/district').then(r => r.data),
        getHeadmasters: (zoneId) => api.get('/dept/education/headmasters', { params: zoneId ? { zoneId } : {} }).then(r => r.data),
        getTeachers: (status) => api.get('/dept/education/teachers', { params: status ? { status } : {} }).then(r => r.data),
        getStudents: (grade, section) => api.get('/dept/education/students', { params: { ...(grade ? { grade } : {}), ...(section ? { section } : {}) } }).then(r => r.data),
        getSummary: () => api.get('/dept/education/summary').then(r => r.data),
        updateTeacherStatus: (id, status) => api.put(`/dept/education/teachers/${id}/status`, { status }).then(r => r.data),
    },

    // Health
    health: {
        getPatients: (status) => api.get('/dept/health/patients', { params: status ? { status } : {} }).then(r => r.data),
        getDoctors: (params) => api.get('/dept/health/doctors', { params: params || {} }).then(r => r.data),
        getSummary: () => api.get('/dept/health/summary').then(r => r.data),
        updatePatientStatus: (id, status) => api.put(`/dept/health/patients/${id}/status`, { status }).then(r => r.data),
    },

    // Transport
    transport: {
        getFleet: (params) => api.get('/dept/transport/fleet', { params: params || {} }).then(r => r.data),
        getSummary: () => api.get('/dept/transport/summary').then(r => r.data),
        updateFleetStatus: (id, status) => api.put(`/dept/transport/fleet/${id}/status`, { status }).then(r => r.data),
    },

    // Revenue
    revenue: {
        getProperties: (params) => api.get('/dept/revenue/properties', { params: params || {} }).then(r => r.data),
        getSummary: () => api.get('/dept/revenue/summary').then(r => r.data),
        updatePropertyStatus: (id, status) => api.put(`/dept/revenue/properties/${id}/status`, { status }).then(r => r.data),
    },

    // Finance
    finance: {
        getTransactions: (params) => api.get('/dept/finance/transactions', { params: params || {} }).then(r => r.data),
        createTransaction: (tx) => api.post('/dept/finance/transactions', tx).then(r => r.data),
        getSummary: () => api.get('/dept/finance/summary').then(r => r.data),
        updateTransactionStatus: (id, status) => api.put(`/dept/finance/transactions/${id}/status`, { status }).then(r => r.data),
    },
};

export default api;

