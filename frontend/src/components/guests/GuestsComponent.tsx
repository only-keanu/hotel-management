import React, { useState, useEffect } from 'react';
import guestService from '../../services/guestService';


function GuestList() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const data = await guestService.getAllGuests();
            setGuests(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch guests: ' + err.message);
            console.error('Error fetching guests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this guest?')) {
            try {
                await guestService.deleteGuest(id);
                fetchGuests(); // Refresh the list
            } catch (err) {
                alert('Failed to delete guest: ' + err.message);
            }
        }
    };

    if (loading) return <div>Loading guests...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Guest List</h2>
            {guests.length === 0 ? (
                <p>No guests found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.id}>
                            <td>{guest.id}</td>
                            <td>{guest.fullName}</td>
                            <td>{guest.email}</td>
                            <td>{guest.phone}</td>
                            <td>
                                <button onClick={() => handleDelete(guest.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GuestList;