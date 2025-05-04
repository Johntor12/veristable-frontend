type TotalAssetsData = {
  assetSupply?: number;
  protocolReserve?: number;
  verifiablity?: number;
  verificationInterval?: string;
  colleteralRatio?: number;
};

const TotalAssetsSection = ({
  assetSupply = 100000000,
  protocolReserve = 100000000,
  verifiablity = 100,
  verificationInterval = "Real-time",
  colleteralRatio = 100.3,
}: TotalAssetsData) => {
  return (
    <>
      <div className="flex flex-col w-[78.264vw] rounded-[0.694vw]">
        <div className="grid grid-cols-2 w-full">
          <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-tl-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
            <p className="font-jakarta text-[0.972vw] text-[#535862]">
              Total Assets Supply
            </p>
            <p className="font-jakarta font-bold text-[1.528vw]">
              ${assetSupply.toLocaleString("en-us")}
            </p>
            <p className="font-jakarta text-[#717680] text-[0.833vw]">
              Total value of tokenized real-world assets currently circulating
              on-chain.
            </p>
          </div>
          <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-tr-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
            <p className="font-jakarta text-[0.972vw] text-[#535862]">
              Total Protocol Reserves
            </p>
            <p className="font-jakarta font-bold text-[1.528vw]">
              {protocolReserve.toLocaleString("en-us")}USDc
            </p>
            <p className="font-jakarta text-[#717680] text-[0.833vw]">
              Reserves backing all tokenized assets, held in stable and audited
              vaults.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full">
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-bl-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Verifibiality
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {verifiablity}%
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                All assets verified through trusted oracles and off-chain data
                attestations.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Verification Interval
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {verificationInterval}
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                Data synced continuously via automated audit feeds and oracle
                networks.
              </p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col gap-[0.333vw] text-black border-1 rounded-br-[0.694vw] border-[#D5D7DA] p-[0.883vw]">
              <p className="font-jakarta text-[0.972vw] text-[#535862]">
                Colleteral Ratio
              </p>
              <p className="font-jakarta font-bold text-[1.528vw]">
                {colleteralRatio}
              </p>
              <p className="font-jakarta text-[#717680] text-[0.833vw]">
                Assets are overcollateralized to ensure protocol solvency and
                user trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalAssetsSection;
