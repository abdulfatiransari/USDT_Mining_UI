import { Button } from "@nextui-org/react";
import React from "react";
import USDTMiningABI from "@/contract/USDTMiningABI.json";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { BsCpuFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { ethers } from "ethers";

export default function HomePage() {
    const details = [
        {
            img: <BsCpuFill color="green" />,
            title: "Wallet balance",
            value: "0",
        },
        {
            img: <FaUserFriends color="purple" />,
            title: "Hash Aid",
            value: "0.00",
        },
        {
            img: <FaChartSimple color="blue" />,
            title: "Total participation",
            value: "0",
        },
    ];
    const { walletProvider } = useWeb3ModalProvider();
    const { address } = useWeb3ModalAccount();

    const contractAddress = "0x4d61BC1f51c0D82f979c7914BeFf4bEee8C4743D";
    const checkBalance = async () => {
        try {
            if (walletProvider) {
                const provider = new ethers.providers.Web3Provider(walletProvider);
                const signer = provider.getSigner();
                const myContract = new ethers.Contract(contractAddress, USDTMiningABI, signer);
                const getBal = await myContract.checkBalance(address);
                const result = await getBal.wait();
                console.log("🚀 ~ checkBalance ~ result:", result);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <p>Receive Voucher</p>
                <Button onClick={checkBalance}>Increase Revenue</Button>
            </div>
            <div className="flex justify-around items-center gap-4">
                {details.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div>{item?.img}</div>
                        <p>{item?.title}</p>
                        <p>{item?.value} USDT</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
