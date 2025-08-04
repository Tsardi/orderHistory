import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';

interface User {
    id: string;
    name: string;
    age: number;
    email?: string;
}

interface UpdateState {
    [key: string]: Partial<Omit<User, 'id' | 'email'>>;
}

const DisplayData = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [updates, setUpdates] = useState<UpdateState>({});

    // updateUser Function
    const updateUser = async (userId: string, updatedData: Partial<User>): Promise<void>  => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, updatedData);
        // Clear the input fields for this user after update
        setUpdates(prev => ({...prev, [userId]: {}}));
    };

    const handleUpdateChange = (userId: string, field: 'name' | 'age', value: string) => {
        setUpdates(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: field === 'age' ? parseInt(value, 10) : value,
            }
        }));
    };

    useEffect(() => {
        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
            const dataArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as User[];
            setUsers(dataArray);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2>Users List</h2>
            {users.map((user) => (
                <div
                    key={user.id}
                    style={{ border: '2px solid black', margin: '10px' }}
                >
                    <div key={user.id}>
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email || 'N/A'}</p>
                        <p>Age: {user.age}</p>
                    </div>
                    <input
                        value={updates[user.id]?.name ?? ''}
                        onChange={(e) => handleUpdateChange(user.id, 'name', e.target.value)}
                        type="text"
                        placeholder="Enter new name:"
                    />
                    <button onClick={() => {
                        if (updates[user.id]?.name) {
                            updateUser(user.id, { name: updates[user.id].name });
                        }
                    }}>
                        Update Name
                    </button>
                    <input
                        value={updates[user.id]?.age?.toString() ?? ''}
                        onChange={(e) => handleUpdateChange(user.id, 'age', e.target.value)}
                        type="number"
                        placeholder="Enter new age:"
                    />
                    <button onClick={() => {
                        if (updates[user.id]?.age) {
                            updateUser(user.id, { age: Number(updates[user.id].age) });
                        }
                    }}>
                        Update Age
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DisplayData;