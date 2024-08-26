import { Context } from "@/components/Context";
import { Web3ModalProvider } from "@/components/Web3Instance";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { useState } from "react";

export default function App({ Component, pageProps }) {
    const [tabActive, setTabActive] = useState();
    return (
        <Web3ModalProvider>
            <NextUIProvider>
                <Context.Provider value={{ tabActive, setTabActive }}>
                    <Component {...pageProps} />
                </Context.Provider>
            </NextUIProvider>
        </Web3ModalProvider>
    );
}
