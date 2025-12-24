import { Outlet } from "react-router-dom";
import { UserSidebar } from "./UserSidebar";

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};
