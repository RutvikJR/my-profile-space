import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <main className="">
        <Navbar />
        <div className=" p-4 h-full w-full">
          <Outlet></Outlet>
        </div>
      </main>
    </>
  );
};

export default Layout;
