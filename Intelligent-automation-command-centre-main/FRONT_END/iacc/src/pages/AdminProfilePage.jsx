import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';

const AdminProfilePage = () => {
    const [user, setUser] = useState({});
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setUser(JSON.parse(userStr));
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        // Implement password update logic here (Backend endpoint needed)
        setMessage('Password update functionality coming soon.');
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Profile
            </h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white border-slate-200 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-slate-800">Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-white shadow-sm">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-800">{user.username}</div>
                                <div className="text-sm text-slate-500">System Administrator</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</Label>
                                <div className="text-base font-medium text-slate-900 mt-1">{user.email}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Roles</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {user.roles?.map(role => (
                                        <span key={role} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                                            {role.replace('ROLE_', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-slate-800">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            {message && <Alert className="bg-green-100 border-green-200 text-green-700"><AlertDescription>{message}</AlertDescription></Alert>}

                            <div>
                                <Label className="text-slate-600 font-semibold">New Password</Label>
                                <Input
                                    type="password"
                                    className="bg-white border-slate-200 text-slate-900 mt-1 focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter new password"
                                />
                                <p className="text-xs text-slate-400 mt-2">Password must be at least 8 characters long.</p>
                            </div>
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform hover:scale-[1.02]">
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminProfilePage;
