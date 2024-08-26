import { Button } from "@nextui-org/react";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import React from "react";

export default function Navbar() {
    const { open } = useWeb3Modal();
    const { isConnected, address } = useWeb3ModalAccount();
    return (
        <div className="flex justify-between items-center min-w-full py-4">
            <div>
                <p className="font-bold text-[18px]">USDT Minig</p>
            </div>
            <div>
                <Button onClick={() => open()} className="font-semibold flex rounded-[100px] px-6 py-4 text-base">
                    {isConnected
                        ? address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length)
                        : "Connect"}
                </Button>
            </div>
        </div>
    );
}
