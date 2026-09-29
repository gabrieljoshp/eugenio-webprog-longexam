import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateCurrentUser } from "../services/UserService";

const AccountPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    contactNumber: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const update = ({ target }) =>
    setForm((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault();
    try {
      await updateCurrentUser(form);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile.");
    }
  };
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Customer account
      </p>
      <h1 className="mt-2 text-4xl font-bold">Profile</h1>
      <p className="mt-2 text-zinc-600">
        {user.email} · {user.role}
      </p>
      {message && (
        <p className="mt-6 rounded-lg border border-zinc-300 bg-white p-3 text-sm">
          {message}
        </p>
      )}
      <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
        {Object.entries(form).map(([name, value]) => (
          <label
            key={name}
            className="text-sm font-medium capitalize text-zinc-700"
          >
            {name.replace(/([A-Z])/g, " $1")}
            <input
              name={name}
              value={value}
              onChange={update}
              required
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3"
            />
          </label>
        ))}
        <button className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white sm:col-span-2">
          Save changes
        </button>
      </form>
    </main>
  );
};

export default AccountPage;
