import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TopBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 40
        }}>
            <div style={{
                display: 'flex',
                height: '4rem',
                alignItems: 'center',
                padding: '0 1.5rem',
                gap: '1rem'
            }}>
                {/* Mobile Menu Button */}
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    className="md:hidden"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--muted)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <Menu style={{ height: '1.25rem', width: '1.25rem', color: 'var(--foreground)' }} />
                </button>

                {/* Search Bar */}
                <div style={{
                    position: 'relative',
                    flex: 1,
                    maxWidth: '32rem',
                    display: 'none'
                }} className="md:flex">
                    <div style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                    }}>
                        <Search style={{ height: '1.125rem', width: '1.125rem', color: 'var(--muted-foreground)' }} />
                    </div>
                    <input
                        type="search"
                        placeholder="Search tasks, departments, or logs..."
                        className="input-enhanced"
                        style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.5rem',
                            borderRadius: '0.75rem',
                            border: '2px solid var(--border)',
                            background: 'var(--background)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />
                </div>

                {/* Right Section */}
                <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {/* Notifications */}
                    <button
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--muted)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Bell style={{ height: '1.25rem', width: '1.25rem', color: 'var(--muted-foreground)' }} />
                        {/* Notification Badge */}
                        <span style={{
                            position: 'absolute',
                            top: '0.375rem',
                            right: '0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.125rem',
                            height: '1.125rem',
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                        }}>
                            3
                        </span>
                    </button>

                    {/* Divider */}
                    <div style={{
                        width: '1px',
                        height: '2rem',
                        background: 'var(--border)'
                    }}></div>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--muted)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '9999px',
                                    overflow: 'hidden',
                                    border: '2px solid transparent',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '2px'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '9999px',
                                        overflow: 'hidden',
                                        background: 'white'
                                    }}>
                                        <Avatar style={{ width: '100%', height: '100%' }}>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                                            <AvatarFallback style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                fontWeight: '600'
                                            }}>
                                                DC
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'none',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }} className="md:flex">
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: 'var(--foreground)',
                                        lineHeight: '1.25'
                                    }}>
                                        District Collector
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--muted-foreground)',
                                        lineHeight: '1.25'
                                    }}>
                                        Admin
                                    </span>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            forceMount
                            style={{
                                width: '14rem',
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                background: 'var(--card)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <DropdownMenuLabel style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: 'var(--foreground)'
                                    }}>
                                        District Collector
                                    </p>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--muted-foreground)'
                                    }}>
                                        admin@district.gov.in
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator style={{ margin: '0.5rem 0', background: 'var(--border)' }} />
                            <DropdownMenuItem style={{
                                padding: '0.625rem 0.75rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem style={{
                                padding: '0.625rem 0.75rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator style={{ margin: '0.5rem 0', background: 'var(--border)' }} />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                style={{
                                    padding: '0.625rem 0.75rem',
                                    borderRadius: '0.5rem',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
