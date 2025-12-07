import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AdminDataForm from "@/components/AdminDataForm"; // 1. 引入暂存表单组件

export const runtime = 'edge';

export default async function AdminAboutPage() {
  const file = await fetchJsonData("about.json");
  if (!file) return <div>Error loading data</div>;
  const { data, sha } = file;

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar logoText="ENDFIELD.SYS" /> 
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 w-fit">&lt; RETURN</Link>
        </div>
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">EDIT: ABOUT_PROFILE</h1>

        {/* 2. 使用 AdminDataForm 包裹，这会自动处理暂存逻辑 */}
        <AdminDataForm filename="about.json" sha={sha}>
          
           <div className="grid grid-cols-2 gap-6">
             <div className="group"><label className="block text-[10px] text-gray-500 mb-1">SITE_NAME</label><input name="siteName" defaultValue={data.siteName} className="w-full bg-white/5 border border-white/20 p-2"/></div>
             <div className="group"><label className="block text-[10px] text-gray-500 mb-1">BLOGGER</label><input name="blogger" defaultValue={data.blogger} className="w-full bg-white/5 border border-white/20 p-2"/></div>
          </div>
          <div className="group"><label className="block text-[10px] text-gray-500 mb-1">ROLE</label><input name="role" defaultValue={data.role} className="w-full bg-white/5 border border-white/20 p-2"/></div>
          <div className="group"><label className="block text-[10px] text-gray-500 mb-1">DESC</label><textarea name="description" rows={6} defaultValue={data.description} className="w-full bg-white/5 border border-white/20 p-2"/></div>
          <div className="grid grid-cols-2 gap-6">
             <div className="group"><label className="block text-[10px]">LOGO</label><input name="logo" defaultValue={data.logo} className="w-full bg-white/5 border border-white/20 p-2"/></div>
             <div className="group"><label className="block text-[10px]">AVATAR</label><input name="avatar" defaultValue={data.avatar} className="w-full bg-white/5 border border-white/20 p-2"/></div>
          </div>
          <div className="group"><label className="block text-[10px]">EMAIL</label><input name="email" defaultValue={data.email} className="w-full bg-white/5 border border-white/20 p-2"/></div>
          <div className="group"><label className="block text-[10px]">STACK</label><input name="stack" defaultValue={data.stack.join(", ")} className="w-full bg-white/5 border border-white/20 p-2"/><p className="text-[10px] text-gray-600">Comma separated</p></div>

        </AdminDataForm>
      </div>
    </main>
  );
}