import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar"
import Footer from "../components/user/Footer"
import BotWidget from "../components/user/BotWidget";

export default function UserLayout() {
  return (
    <div>
        <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BotWidget />
    </div>
  );
}