import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, ClipboardList, Activity, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const roles = user.roles || [];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getNavItems = () => {
        const items = [];

        if (roles.includes('ROLE_COLLECTOR')) {
            items.push({ to: '/admin-dashboard', label: 'Command Center', icon: LayoutDashboard });
            items.push({ to: '/admin/departments', label: 'Departments', icon: ClipboardList });
            items.push({ to: '/admin/assign-task', label: 'Assign Task', icon: FileText });
            items.push({ to: '/admin/task-status', label: 'Task Status', icon: Activity });
            items.push({ to: '/admin/profile', label: 'Admin Profile', icon: LayoutDashboard }); // Or UserIcon if available
        }

        if (roles.includes('ROLE_DEPT_HEAD')) {
            items.push({ to: '/dept-dashboard', label: 'My Department', icon: ClipboardList });
        }

        if (roles.includes('ROLE_STAFF')) {
            items.push({ to: '/staff-portal', label: 'Submit Request', icon: FileText });
        }

        if (roles.includes('ROLE_AUTO_SUPERVISOR')) {
            items.push({ to: '/active-monitoring', label: 'Automation Console', icon: Activity });
        }

        // Fallback
        if (items.length === 0) {
            items.push({ to: '/dashboard', label: 'Overview', icon: LayoutDashboard });
        }

        return items;
    };

    const navItems = getNavItems();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span>District IACC</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} style={{ marginRight: '12px' }} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                    onClick={handleLogout}
                    className="nav-item"
                    style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                    <LogOut size={20} style={{ marginRight: '12px' }} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
