import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Register</h1>
        <p className="mt-2 text-sm text-white/60">Create your account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password123"
              required
            />
          </div>

          {registerMutation.isError && (
            <p className="text-sm text-red-400">
              Registration failed. Try a different email.
            </p>
          )}

          <button
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-white text-black font-medium py-2 disabled:opacity-60"
          >
            {registerMutation.isPending ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-white/60">
          Already have an account?{" "}
          <Link className="text-white underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
