const OneClick = () => {
  return (
    <div className="flex flex-col gap-[2.667vw] justify-center items-center w-full font-jakarta">
      <div className="flex flex-col gap-[0.667vw] items-center">
        <h6 className="text-[#420092] font-bold text-[1.806vw]">
          Just &quot;One Click&quot;
        </h6>
        <p className="text-[1.111vw] text-gray-700">
          Instant RWA verification, ready for minting in a single click.
        </p>
        <div className="bg-[#D9D9D9] w-[60vw] aspect-[864/307]"></div>
      </div>
      <div className="grid-cols-4 w-[75vw] flex flex-row text-[1.25vw] text-[#420092] px-[2vw]">
        <div className="col-span-1 flex flex-col items-center gap-y-[1.667vw] w-full">
          <div className="w-[3.194vw] aspect-square rounded-full bg-transparent border-[#712DC5] border-2 flex justify-center items-center">
            1
          </div>
          <p className="font-jakarta font-bold ">Login</p>
        </div>
        <div className="col-span-1 flex flex-col items-center gap-y-[1.667vw] w-full">
          <div className="w-[3.194vw] aspect-square rounded-full bg-transparent border-[#712DC5] border-2 flex justify-center items-center">
            2
          </div>
          <p className="font-jakarta font-bold ">ExploreRWA</p>
        </div>
        <div className="col-span-1 flex flex-col items-center gap-y-[1.667vw] w-full">
          <div className="w-[3.194vw] aspect-square rounded-full bg-transparent border-[#712DC5] border-2 flex justify-center items-center">
            3
          </div>
          <p className="font-jakarta font-bold ">Deploy</p>
        </div>
        <div className="col-span-1 flex flex-col items-center gap-y-[1.667vw] w-full">
          <div className="w-[3.194vw] aspect-square rounded-full bg-transparent border-[#712DC5] border-2 flex justify-center items-center">
            4
          </div>
          <p className="font-jakarta font-bold ">Verification</p>
        </div>
        <div className="col-span-1 flex flex-col items-center gap-y-[1.667vw] w-full">
          <div className="w-[3.194vw] aspect-square rounded-full bg-transparent border-[#712DC5] border-2 flex justify-center items-center">
            5
          </div>
          <p className="font-jakarta font-bold ">Minting</p>
        </div>
      </div>
    </div>
  );
};

export default OneClick;
