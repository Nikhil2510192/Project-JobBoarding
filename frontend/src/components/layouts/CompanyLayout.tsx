import { Outlet } from "react-router-dom";
import { CompanySidebar } from "./CompanySidebar";

export const CompanyLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <CompanySidebar />
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};
