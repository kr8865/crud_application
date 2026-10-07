// All calls to the NestJS REST API live in this one file.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type User = {
  _id: string; // MongoDB's unique id
  name: string;
  email: string;
  age: number;
};

// The data we send when creating/updating (no _id - MongoDB creates it).
export type UserInput = Pick<User, 'name' | 'email' | 'age'>;

// Small helper: call the API and throw a readable error if it fails.
async function request(path: string, method = 'GET', body?: UserInput) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    // NestJS sends errors like { message: "..." } or { message: ["...", "..."] }
    throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
  }
  return data;
}

export const getUsers = (): Promise<User[]> => request('/users');
export const createUser = (user: UserInput): Promise<User> => request('/users', 'POST', user);
export const updateUser = (id: string, user: UserInput): Promise<User> => request(`/users/${id}`, 'PATCH', user);
export const deleteUser = (id: string): Promise<User> => request(`/users/${id}`, 'DELETE');
