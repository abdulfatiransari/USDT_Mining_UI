import React, { useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { CiSquarePlus } from "react-icons/ci";
import { BiChart, BiSolidChart, BiSolidPlusSquare } from "react-icons/bi";
import { MdAnalytics, MdOutlineAnalytics } from "react-icons/md";

export default function BottomNav() {
    const [active, setActive] = useState("Home");
    const data = [
        {
            img: <GoHome />,
            imgActive: <GoHomeFill />,
            title: "Home",
        },
        {
            img: <MdOutlineAnalytics />,
            imgActive: <MdAnalytics />,
            title: "Team",
        },
        {
            img: <BiChart />,
            imgActive: <BiSolidChart />,
            title: "Serve",
        },
        {
            img: <CiSquarePlus />,
            imgActive: <BiSolidPlusSquare />,
            title: "Personal",
        },
    ];
    return (
        <div className="flex justify-around items-center bg-blue-800 rounded-t-lg p-4 gap-4">
            {data?.map((item, idx) => (
                <div key={idx} onClick={() => setActive(item?.title)}>
                    <div className="flex flex-col items-center">
                        <div>{item?.img}</div>
                        <p>{item?.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
