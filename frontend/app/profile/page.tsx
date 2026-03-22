"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Check, LogOut, User } from "lucide-react";

const Profile = () => {
  const { profile, updateProfile, logout, user } = useAuth();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ Protect route
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  // ✅ Sync profile
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  // ✅ Animation (same)
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { y: 20, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  // ✅ SAVE PROFILE (context → backend later)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    await updateProfile({ name, bio });
    setIsSaving(false);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ❌ REMOVED Navbar (already in layout) */}

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <div ref={contentRef}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
            Profile
          </h1>

          <div className="p-6 rounded-2xl bg-card border border-border card-shadow">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shrink-0">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-primary-foreground" />
                )}
              </div>

              <div>
                <p className="font-semibold text-foreground">
                  {profile?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-muted-foreground text-sm cursor-not-allowed"
                />
              </div>

              {/* BIO */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="A short bio…"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none resize-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" />
                  ) : saved ? (
                    <>
                      <Check /> Saved
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-100 border rounded-xl"
                >
                  <LogOut /> Sign out
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;