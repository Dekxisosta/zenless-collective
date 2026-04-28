import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../../shared";
import { BotWidget } from "../../features/bot";
import { useProfile } from "../../features/profile";

export default function UserLayout() {
  const { loading } = useProfile();

  return (
    <div>
      <Navbar key={loading ? "loading" : "ready"} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}