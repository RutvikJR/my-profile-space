import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { NavbarSegmented } from "./NavbarSegmented";

const Layout = () => {
  return (
    <>
      <main className="grid grid-cols-12 h-screen">
        <NavbarSegmented />
        <div className="col-span-9 p-4 h-full overflow-y-scroll w-full">
          <Outlet></Outlet>
        </div>
      </main>
    </>
  );
};

export default Layout;
