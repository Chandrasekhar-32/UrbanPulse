import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Registration failed. Email might already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/20">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Citizen Portal
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Create your UrbanPulse ID
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus-within:border-blue-500 transition-all">
              <User size={18} className="text-slate-400" />
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-transparent text-slate-900 font-medium outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus-within:border-blue-500 transition-all">
              <Mail size={18} className="text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-transparent text-slate-900 font-medium outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Security Key
            </label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus-within:border-blue-500 transition-all">
              <Lock size={18} className="text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-slate-900 font-medium outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 font-bold flex items-center gap-2">
              <ArrowRight size={16} className="rotate-180" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register ID"}
            {!loading && <ArrowRight size={20} />}
          </button>

          <p className="text-center text-sm text-slate-400 font-bold uppercase tracking-widest">
            Already registered?{" "}
            <a href="/account/signin" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
