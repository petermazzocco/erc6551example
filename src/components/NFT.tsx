"use client";

import { useEffect, useState } from "react";
import type { OwnedNft } from "alchemy-sdk";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import { TokenboundClient } from "@tokenbound/sdk";
import type { Address } from "wagmi";

export default function NFT() {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const [erc6551Addr, setErc6551Addr] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Import API
  const ALCHEMY_API = process.env.NEXT_PUBLIC_ALCHEMY_API as string;

  // Set up config
  const config = {
    apiKey: ALCHEMY_API,
    network: Network.MATIC_MUMBAI,
  };
  // Instantiate alchemy
  const alchemy = new Alchemy(config);

  /**
   * Get the ETHEREUM NFT data for the connected address
   * @returns nfts
   */
  useEffect(() => {
    async function getNftsForOwner() {
      if (isConnected) {
        try {
          let nftArray = [] as OwnedNft[];
          const nftsIterable = alchemy.nft.getNftsForOwnerIterator(
            address as string
          );
          for await (const nft of nftsIterable) {
            nftArray.push(nft as OwnedNft);
          }
          setNfts(nftArray);
          console.log(nftArray);
        } catch (err: any) {
          console.log(err?.message);
        }
      }
      if (!isConnected) return;
    }
    getNftsForOwner();
  }, [address]);

  const tokenboundClient = new TokenboundClient({
    //@ts-ignore
    walletClient,
    chainId: chain?.id as number,
  });

  const handleAddress = async (tokenContract: Address, tokenId: string) => {
    try {
      let tba = "";
      if (walletClient && chain) {
        tba = tokenboundClient.getAccount({
          tokenContract,
          tokenId,
        });
        setErc6551Addr(tba);
        console.log(`ERC6551 Address: ${tba}`);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const deployAccount = async (tokenContract: Address, tokenId: string) => {
    try {
      const deployed = await alchemy.core.isContractAddress(erc6551Addr);
      if (!deployed && walletClient && chain) {
        const tx: Address = await tokenboundClient.createAccount({
          tokenContract,
          tokenId,
        });
        setTxHash(tx);
        setIsDeployed(true);
        setSuccess("Account deployed");
      } else if (deployed) {
        console.log("Account already deployed");
        setError("Account already deployed");
      }
    } catch (err: any) {
      console.log(err?.message);
      setError("Uh oh, an error occured");
    }
  };

  return (
    <div className="grid justify-center space-y-2">
      <div className="grid grid-cols-1">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="grid grid-cols-1">
            <label className="label">
              <p className="label text-accent">{nft.title}</p>
              <p className="label label-text-alt text-accent">#{nft.tokenId}</p>
            </label>
            <img
              src={nft.media[0]?.gateway}
              className="w-72 rounded-md"
              alt={nft.title}
            />
            <label className="label">
              <p className="label text-accent">{nft.tokenType}</p>
              <a
                href={`https://mumbai.polygonscan.com/address/${nft.contract.address}`}
                target="_blank"
                rel="noreferrer"
              >
                <p className="label label-text-alt text-accent">
                  {nft.contract.address.slice(0, 2)}...
                  {nft.contract.address.slice(-4)}
                </p>
              </a>
            </label>
            <div className="join space-x-2">
              <div className="join-item">
                {!erc6551Addr ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-accent"
                    onClick={() =>
                      handleAddress(
                        nft.contract.address as Address,
                        nft.tokenId
                      )
                    }
                  >
                    View Address
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-accent"
                    onClick={() =>
                      handleAddress(
                        nft.contract.address as Address,
                        nft.tokenId
                      )
                    }
                  >
                    <a
                      href={`https://mumbai.polygonscan.com/address/${erc6551Addr}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {erc6551Addr.slice(0, 2)}...{erc6551Addr.slice(-8)}
                    </a>
                  </button>
                )}
              </div>
              <div className="join-item">
                {!isDeployed ? (
                  <button
                    className="btn btn-sm btn-accent"
                    type="button"
                    onClick={() =>
                      deployAccount(
                        nft.contract.address as Address,
                        nft.tokenId
                      )
                    }
                  >
                    Deploy Account
                  </button>
                ) : (
                  <button className="btn btn-sm btn-success" type="button">
                    <a
                      href={`https://mumbai.polygonscan.com/address/${erc6551Addr}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Account Deployed
                    </a>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Toast */}
      <div className="toast toast-top toast-center">
        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
