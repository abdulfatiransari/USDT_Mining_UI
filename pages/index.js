import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/HomePage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <div className="flex flex-1 justify-center">
            <div className="max-w-[1080px] flex flex-col gap-4">
                <Navbar />
                <HomePage />
                <BottomNav />
            </div>
        </div>
    );
}
