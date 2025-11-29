"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MatrixBackground from "@/components/MatrixBackground";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 调用 API 路由进行登录
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("ACCESS_DENIED: INVALID_CREDENTIALS");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-endfield-base flex items-center justify-center font-mono text-white relative overflow-hidden">
      <MatrixBackground />
      <div className="z-10 bg-black/80 border border-endfield-accent/50 p-8 w-full max-w-md backdrop-blur-md shadow-[0_0_30px_rgba(252,238,33,0.1)]">
        <h1 className="text-2xl font-bold text-endfield-accent mb-6 tracking-widest text-center border-b border-white/10 pb-4">
          SYSTEM_LOGIN
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 mb-2">admin@endfield:~$ enter_password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 p-3 text-endfield-accent outline-none focus:border-endfield-accent transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-900/20 p-2 border border-red-900">
              [ERROR] {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest clip-path-button disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "CONNECT"}
          </button>
        </form>
      </div>
    </main>
  );
}