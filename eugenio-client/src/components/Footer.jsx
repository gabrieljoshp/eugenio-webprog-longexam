import logo from "../assets/img/nubdexchange_logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="border-t-5 border-yellow-400 bg-blue-900/95 backdrop-blur px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-zinc-50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <img src={logo} alt="BulldogEx" className="h-15 w-15" />
          <div>
            <p className="text-lg font-bold">Bulldogs Exchange Shop</p>
            <p className="mt-1 text-sm text-zinc-300">
              Campus essentials, simple ordering.
            </p>
          </div>
        </div>

        <div className="flex gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
          <Link to="products">Products</Link>
          <p>{"| Cart | Pickup"}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
