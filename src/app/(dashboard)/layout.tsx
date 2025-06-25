import { SidebarProvider } from "@/components/ui/sidebar";
import { ListHeader } from "@/modules/agents/ui/components/agent-list-header";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col h-screen w-screen bg-muted">
          <DashboardNavbar />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
