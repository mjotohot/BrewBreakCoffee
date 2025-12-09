import bgImage from "../../assets/images/bg-img.jpg";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-[#a66a30] opacity-60"></div>
      <div className="relative flex justify-center items-center w-full max-w-6xl gap-20 px-4 lg:px-0">
        <div className="hidden lg:flex flex-col items-center justify-center jomhuria-regular overflow-hidden">
          <span className="inline-block text-[300px] font-extrabold text-white leading-[0.85] -mb-[0.3em]">
            BREW
          </span>
          <span className="inline-block text-[300px] font-extrabold text-[#4a2204] leading-[0.85] -mb-[0.3em]">
            BREAK
          </span>
          <span className="inline-block text-[300px] font-extrabold text-black leading-[0.85]">
            COFFEE
          </span>
        </div>
        <div className="w-full max-w-lg bg-[#d6ba73] rounded-2xl overflow-y-auto relative z-10 shadow-lg">
          <div className="p-6 lg:p-12 flex flex-col justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
