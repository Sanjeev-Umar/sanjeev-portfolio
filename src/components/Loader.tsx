export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#030014]">
      {/* Simple rocket container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Simple rocket */}
        <div className="relative w-20 h-32">
          {/* Rocket body */}
          <div className="absolute w-10 h-24 bg-indigo-200 rounded-lg left-5 bottom-0"></div>

          {/* Rocket top - made more pointy */}
          <div className="absolute w-0 h-0 left-5 bottom-24 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[16px] border-b-indigo-500"></div>

          {/* Rocket window */}
          <div className="absolute w-6 h-6 bg-blue-400 rounded-full left-7 bottom-16 border-2 border-blue-600"></div>

          {/* Rocket fins - made more angular */}
          <div
            className="absolute w-0 h-0 left-1 bottom-4 
            border-l-[12px] border-l-transparent 
            border-b-[20px] border-b-indigo-500"
          ></div>
          <div
            className="absolute w-0 h-0 right-1 bottom-4 
            border-r-[12px] border-r-transparent 
            border-b-[20px] border-b-indigo-500"
          ></div>

          {/* Rocket exhaust animated */}
          <div className="absolute w-10 flex justify-center left-5 -bottom-9">
            <div className="w-2 h-6 bg-purple-400 mx-0.5 animate-pulse opacity-75 rounded-b-lg"></div>
            <div className="w-2 h-8 bg-purple-500 mx-0.5 animate-pulse opacity-75 rounded-b-lg"></div>
            <div className="w-2 h-6 bg-purple-400 mx-0.5 animate-pulse opacity-75 rounded-b-lg"></div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-4 text-blue-400 text-lg font-semibold">
        Preparing to take off...
      </p>
    </div>
  );
};
