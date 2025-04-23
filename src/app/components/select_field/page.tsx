import React from 'react';

interface User {
    id: number;
    name: string;
}

const SelectField = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users",
        { next: { revalidate: 30 } });
    const users: User[] = await res.json();
    return (
        <>
            <h1>Users</h1>
            <ul>
                {users.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
        </>
    )
}

export default SelectField