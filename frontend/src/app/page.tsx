'use client'; // this page uses state and clicks, so it runs in the browser

import { useEffect, useState } from 'react';
import { createUser, deleteUser, getUsers, updateUser, User } from '@/lib/api';

const emptyForm = { name: '', email: '', age: '' };

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null); // null = adding a new user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // READ: load all users
  async function loadUsers() {
    try {
      setUsers(await getUsers());
      setError('');
    } catch {
      setError('Could not load users. Is the backend running on port 4000?');
    } finally {
      setLoading(false);
    }
  }

  // Load users once when the page opens.
  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError('Could not load users. Is the backend running on port 4000?'))
      .finally(() => setLoading(false));
  }, []);

  // CREATE or UPDATE: runs when the form is submitted
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    const user = { name: form.name, email: form.email, age: Number(form.age) };
    try {
      if (editingId === null) {
        await createUser(user);
      } else {
        await updateUser(editingId, user);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError((err as Error).message); // e.g. "A user with this email already exists"
    }
  }

  // Fill the form with a user's data so it can be edited
  function startEdit(user: User) {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, age: String(user.age) });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  // DELETE
  async function handleDelete(user: User) {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await deleteUser(user._id);
      await loadUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      {/* ---------- Form: add or edit ---------- */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{editingId === null ? 'Add user' : 'Edit user'}</h2>

        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          type="number"
          placeholder="Age"
          min={1}
          max={120}
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {editingId === null ? 'Add' : 'Save'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={cancelEdit} className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ---------- List of users ---------- */}
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users yet. Add one above.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Age</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-200">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.age}</td>
                <td className="space-x-3 p-3">
                  <button onClick={() => startEdit(user)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(user)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
