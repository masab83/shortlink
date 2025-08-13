import { useLocation } from "wouter";
import Sidebar from "@/components/layout/Sidebar";
import UserOverview from "./user/overview";

export default function Home() {
  const [location] = useLocation();

  // Default to overview if at root
  if (location === "/") {
    return <UserOverview />;
  }

  return (
    <div className="min-h-screen bg-royal-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Welcome to ShrinkEarn</h1>
          <p className="text-gray-400">Use the sidebar to navigate through your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
