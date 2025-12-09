import Sidebar from "../navigations/Sidebar";
import bgImage from "../../assets/images/bg-img.jpg";
import Header from "../navigations/Header";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-[#a66a30] opacity-40 z-10"></div>
      <div className="relative z-30">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 md:ml-64 relative z-20">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
