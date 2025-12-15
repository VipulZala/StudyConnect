import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface User {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    createdAt: string;
    avatarUrl?: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await apiFetch('/users');
            setUsers(data);
        } catch (err: any) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading users...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-4">Registered Users</h1>
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            {u.avatarUrl ? (
                                                <img src={u.avatarUrl} alt={u.name} className="rounded-circle" width="40" height="40" />
                                            ) : (
                                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="fw-bold">{u.name}</div>
                                                <div className="small text-muted">ID: {u._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {u.email && <div><i className="bi bi-envelope me-2"></i>{u.email}</div>}
                                        {u.phone && <div><i className="bi bi-telephone me-2"></i>{u.phone}</div>}
                                    </td>
                                    <td>
                                        <span className={`badge bg-${u.role === 'admin' ? 'danger' : 'primary'}`}>{u.role}</span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
