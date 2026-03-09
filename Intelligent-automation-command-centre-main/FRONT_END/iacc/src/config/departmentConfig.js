/**
 * Department Dashboard Configuration
 * Defines the hierarchy, roles, and metadata for each department.
 * Used by dashboard pages to know their role's display info.
 */

export const DEPT_CONFIG = {
    EDUCATION: {
        label: 'Education Department',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        lightBg: '#eff6ff',
        roles: {
            CEO: {
                title: 'Chief Education Officer',
                abbr: 'CEO',
                level: 'Department Head',
                manages: ['DEOs', 'All Schools'],
                color: '#1d4ed8',
            },
            DEO: {
                title: 'District Education Officer',
                abbr: 'DEO',
                level: 'Sub-District Admin',
                manages: ['Schools', 'Headmasters'],
                color: '#3b82f6',
            },
            HEADMASTER: {
                title: 'Headmaster / Principal',
                abbr: 'HM',
                level: 'School Admin',
                manages: ['Teachers', 'Students'],
                color: '#60a5fa',
            },
            TEACHER: {
                title: 'Teacher / Professor',
                abbr: 'TCH',
                level: 'Teaching Staff',
                manages: ['Students', 'Classes'],
                color: '#34d399',
            },
            STUDENT: {
                title: 'Student',
                abbr: 'STU',
                level: 'Student',
                manages: [],
                color: '#93c5fd',
            },
            'AUTOMATION-SUPERVISOR': {
                title: 'Automation Supervisor',
                abbr: 'AUT',
                level: 'RPA & Bot Admin',
                manages: ['Bots', 'Workflows'],
                color: '#7c3aed',
            },
        }
    },
    HEALTH: {
        label: 'Health Department',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
        lightBg: '#fef2f2',
        roles: {
            CMO: {
                title: 'Chief Medical Officer',
                abbr: 'CMO',
                level: 'Department Head',
                manages: ['DHOs', 'All Hospitals'],
                color: '#b91c1c',
            },
            DHO: {
                title: 'District Health Officer',
                abbr: 'DHO',
                level: 'Sub-District Admin',
                manages: ['Hospitals', 'Wardens'],
                color: '#ef4444',
            },
            'HOSPITAL-WARDEN': {
                title: 'Hospital Director',
                abbr: 'HD',
                level: 'Hospital Admin',
                manages: ['Doctors', 'Staff'],
                color: '#f87171',
            },
            DOCTOR: {
                title: 'Doctor / Medical Staff',
                abbr: 'DOC',
                level: 'Staff',
                manages: [],
                color: '#fca5a5',
            },
            'AUTOMATION-SUPERVISOR': {
                title: 'Automation Supervisor',
                abbr: 'AUT',
                level: 'RPA & Bot Admin',
                manages: ['Bots', 'Workflows'],
                color: '#7c3aed',
            },
        }
    },
    TRANSPORT: {
        label: 'Transport Department',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        lightBg: '#fffbeb',
        roles: {
            CTO: {
                title: 'Chief Transport Officer',
                abbr: 'CTO',
                level: 'Department Head',
                manages: ['DTOs', 'All RTOs'],
                color: '#d97706',
            },
            DTO: {
                title: 'District Transport Officer',
                abbr: 'DTO',
                level: 'Sub-District Admin',
                manages: ['RTO Officers', 'Routes'],
                color: '#f59e0b',
            },
            'RTO-OFFICER': {
                title: 'RTO Officer',
                abbr: 'RTO',
                level: 'Operations Staff',
                manages: ['Vehicle Permits', 'Licenses'],
                color: '#fbbf24',
            },
            STAFF: {
                title: 'Transport Staff',
                abbr: 'STF',
                level: 'Staff',
                manages: [],
                color: '#fcd34d',
            },
            'AUTOMATION-SUPERVISOR': {
                title: 'Automation Supervisor',
                abbr: 'AUT',
                level: 'RPA & Bot Admin',
                manages: ['Bots', 'Workflows'],
                color: '#7c3aed',
            },
        }
    },
    FINANCE: {
        label: 'Finance Department',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        lightBg: '#f0fdf4',
        roles: {
            CFO: {
                title: 'Chief Finance Officer',
                abbr: 'CFO',
                level: 'Department Head',
                manages: ['DFOs', 'All Accounts'],
                color: '#059669',
            },
            DFO: {
                title: 'District Finance Officer',
                abbr: 'DFO',
                level: 'Sub-District Admin',
                manages: ['Accounts Officers', 'Budgets'],
                color: '#10b981',
            },
            'ACCOUNTS-OFFICER': {
                title: 'Accounts Officer',
                abbr: 'AO',
                level: 'Finance Operations',
                manages: ['Ledgers', 'Reports'],
                color: '#34d399',
            },
            STAFF: {
                title: 'Finance Staff',
                abbr: 'STF',
                level: 'Staff',
                manages: [],
                color: '#6ee7b7',
            },
            'AUTOMATION-SUPERVISOR': {
                title: 'Automation Supervisor',
                abbr: 'AUT',
                level: 'RPA & Bot Admin',
                manages: ['Bots', 'Workflows'],
                color: '#7c3aed',
            },
        }
    },
    REVENUE: {
        label: 'Revenue Department',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        lightBg: '#f5f3ff',
        roles: {
            CRO: {
                title: 'Chief Revenue Officer',
                abbr: 'CRO',
                level: 'Department Head',
                manages: ['DROs', 'All Revenue Offices'],
                color: '#6d28d9',
            },
            DRO: {
                title: 'District Revenue Officer',
                abbr: 'DRO',
                level: 'Sub-District Admin',
                manages: ['Tahsildars', 'Revenue Inspectors'],
                color: '#8b5cf6',
            },
            TAHSILDAR: {
                title: 'Tahsildar / Revenue Inspector',
                abbr: 'TAH',
                level: 'Revenue Operations',
                manages: ['Land Records', 'Tax Collection'],
                color: '#a78bfa',
            },
            STAFF: {
                title: 'Revenue Staff',
                abbr: 'STF',
                level: 'Staff',
                manages: [],
                color: '#c4b5fd',
            },
            'AUTOMATION-SUPERVISOR': {
                title: 'Automation Supervisor',
                abbr: 'AUT',
                level: 'RPA & Bot Admin',
                manages: ['Bots', 'Workflows'],
                color: '#7c3aed',
            },
        }
    },
};

export const getDeptConfig = (dept) => DEPT_CONFIG[dept?.toUpperCase()] || null;
export const getRoleConfig = (dept, role) => {
    const d = getDeptConfig(dept);
    if (!d) return null;
    return d.roles[role?.toUpperCase()] || d.roles[role] || null;
};
