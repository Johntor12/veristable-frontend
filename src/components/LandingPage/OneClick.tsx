import Image from "next/image";

const OneClick = () => {
  return (
    <div className="flex flex-col gap-[1.5vw] justify-center items-center w-full font-jakarta px-[5vw] py-[3vw] bg-white tracking-normal">
      {/* Intro Section */}
      <div className="flex flex-col gap-[0.8vw] text-center max-w-5xl">
        <h2 className="text-[#420092] font-bold text-[2.2vw] leading-tight tracking-normal">
          Empowering Real-World Assets in Web3
        </h2>
        <p className="text-[#420092] text-[1.1vw] leading-relaxed tracking-normal">
          VeriStable is a dApp designed to support the Real World Assets (RWA)
          and DeFi ecosystem. While RWAs are productive assets in the real
          world, they still face challenges around trust and authenticity.
        </p>
        <p className="text-black text-[1.1vw] leading-relaxed tracking-normal">
          With VeriStable, asset tokenization can be done through verification
          methods such as bank accounts or key ownership documents — all without
          requiring traditional KYC. This is made possible using zkTLS
          technology, allowing anyone, including retail investors, to tokenize
          their assets while preserving Web3’s core principles: permissionless
          access and anonymity.
        </p>
        <p className="text-black text-[1.1vw] leading-relaxed tracking-normal">
          VeriStable ensures RWA authenticity by providing real-time asset
          proof, backed by a staking mechanism involving participants via AVS.
        </p>
      </div>

      {/* Mint Everything Section */}
      <div className="flex flex-col gap-[0.6vw] text-center max-w-4xl border-t border-b border-[#E0D6F7] py-[1.5vw]">
        <h3 className="text-[#420092] font-bold text-[1.8vw] tracking-normal">
          Mint Everything
        </h3>
        <p className="text-black text-[1.1vw] leading-relaxed tracking-normal">
          VeriStable is a platform for minting all kinds of real-world assets
          (RWAs), and will soon support tokens like ERC-20, ERC-721, ERC-1155,
          and more. Tokenize your assets and verify your reserves so that
          everyone can trust you.
        </p>
      </div>

      {/* Problem & Solution Section */}
      <div className="flex flex-col gap-[1vw] text-left w-full max-w-4xl">
        <div>
          <h4 className="text-[#420092] font-bold text-[1.4vw] tracking-normal">
            Problem
          </h4>
          <p className="text-black text-[1.1vw] leading-relaxed tracking-normal">
            Retailers struggle to tokenize assets due to complicated
            verification, often requiring KYC, making it hard to gain trust.
          </p>
        </div>
        <div>
          <h4 className="text-[#420092] font-bold text-[1.4vw] tracking-normal">
            Solution
          </h4>
          <p className="text-black text-[1.1vw] leading-relaxed tracking-normal">
            VeriStable makes it easy for anyone to tokenize assets with
            automatic verification via zkTLS — no KYC needed, fully anonymous,
            and trustworthy.
          </p>
        </div>
      </div>

      {/* Just One Click Section */}
      <div className="flex flex-col gap-[0.6vw] items-center w-full">
        <h6 className="text-[#420092] font-bold text-[1.8vw] tracking-normal">
          Just One Click
        </h6>
        <p className="text-black text-[1.1vw] text-center tracking-normal">
          Instant RWA verification, ready for minting in a single click.
        </p>
        <Image
          src="/images/villaRWA.jpeg"
          alt="RWA Villa"
          width={864}
          height={307}
          sizes="60vw"
          className="w-[60vw] aspect-[864/307] rounded-lg shadow-md"
        />
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-5 w-full max-w-6xl gap-x-[1.5vw] mt-[1.5vw] relative">
        <div className="absolute top-[1.4vw] left-1/2 transform -translate-x-1/2 w-4/5 h-[0.2vw] bg-[#712DC5] z-0"></div>
        {[
          { step: 1, title: "Connect Wallet" },
          { step: 2, title: "Explore RWA" },
          { step: 3, title: "Deploy" },
          { step: 4, title: "Verification" },
          { step: 5, title: "Minting" },
        ].map((item) => (
          <div
            key={item.step}
            className="flex flex-col items-center gap-y-[1vw]"
          >
            <div className="w-[2.8vw] aspect-square rounded-full border-[#712DC5] border flex justify-center items-center text-[#420092] font-bold text-[1.1vw] z-10 bg-white">
              {item.step}
            </div>
            <p className="font-jakarta font-semibold text-[1.1vw] text-[#420092] text-center tracking-normal">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OneClick;
