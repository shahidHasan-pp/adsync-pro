import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("Independent Advertiser");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, company_name: companyName });
      setSession(response.data.access_token, email);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Unable to login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ffedd5_0%,#fff7ed_30%,#f8fafc_100%)] p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">AdSync Pro</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Login with Gmail</h1>
        <p className="mt-1 text-sm text-slate-600">No OTP or email verification required in this build.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block text-sm text-slate-700">
            Gmail Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-slate-700">
            Company Name
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
