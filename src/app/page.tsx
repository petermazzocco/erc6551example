import NFT from "../components/NFT";
import { ConnectKitButton } from "../components/ConnectKitButton";
import { Connected } from "../components/Connected";

export function Page() {
  return (
    <div className="min-h-screen bg-primary text-base-100 grid place-items-center py-10">
      <h1 className="text-4xl">Super Cool ERC6551 dApp</h1>
      <ConnectKitButton />
      <div className="mt-10">
        <Connected>
          <NFT />
        </Connected>
      </div>
    </div>
  );
}

export default Page;
