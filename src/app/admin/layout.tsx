import StagingManager from "@/components/StagingManager";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 1. 将暂存管理器提升到 Layout 层级，确保全局监听 */}
      <StagingManager />
      
      {/* 2. 渲染具体的页面内容 */}
      {children}
    </>
  );
}