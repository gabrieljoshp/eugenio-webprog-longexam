import { Outlet } from "react-router-dom";
import nubdexchange_logo from "../assets/img/nubdexchange_logo.png";
import NUManilaMain from "../assets/img/NU-Manila-Main.png";

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        <div
          className="flex items-center justify-center border-b-2 border-zinc-300 bg-cover bg-center p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-zinc-300 lg:p-16"
          style={{ backgroundImage: `url(${NUManilaMain})` }}
        >
          <div className="flex w-full max-w-md items-center justify-center rounded-3xl">
            <img
              src={nubdexchange_logo}
              alt="NU Shield Logo"
              className="w-full max-w-80 object-contain"
            />
          </div>
        </div>
        <main className="flex items-center bg-zinc-50 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;
