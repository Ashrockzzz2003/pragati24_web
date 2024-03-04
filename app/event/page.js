"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import 'material-icons/iconfont/material-icons.css';

export default function EventScreen() {
    const viewer = useRef(null);
    const [vw, setVW] = useState();

    useEffect(() => {
        console.log("loading pdftron");
        if (vw) return;
        import('@pdftron/webviewer').then(() => {
            WebViewer(
                {
                    path: '/webviewer/lib',
                    initialDoc: "/files/Pragati'24_brochure.pdf",
                    enableAnnotations: false,
                    enableOptimizedWorkers: true,
                },
                viewer.current,
            ).then((instance) => {
                const { docViewer } = instance;
                setVW(instance);
            });
        })
    }, [vw]);

    return (
        <>
            <NavBar />
            <main className="h-[150vh] overflow-clip">
                <h1 className="mb-4 pt-8 text-2xl text-lime-50 text-center">Pragati 2024 | Brochure</h1>
                <div className="flex flex-col bg-red-700 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
                    <p className="text-md font-medium text-red-100 max-w-[256px] text-center">{"Online Registrations are closed now. Only offline registrations are open! You can go to the venue directly and register"}</p>
                </div>
                <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
                    <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Note: The brochure is loading. Please wait a few seconds!"}</p>
                </div>
                <Link href="/event/register" className="text-lg w-fit ml-auto mr-auto font-semibold text-gray-900 items-center align-middle flex flex-row  border border-gray-400 px-2 py-1 rounded-lg bg-gray-100 mb-8">
                    <span className="material-icons mr-2">app_registration</span>
                    Register for Events
                </Link>
                <div className="w-[90%] h-[64%] m-auto rounded-2xl overflow-visible viewer" ref={viewer}></div>
                {/* <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
                    <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Note: The brochure is loading. Please wait a few seconds!"}</p>
                </div>
                <iframe className="w-[90%] h-[78%] m-auto rounded-2xl overflow-visible" src="https://drive.google.com/file/d/1SANYrGrQqfs7WAOUIKKjMOZmOyVD1vSM/preview" allow="autoplay"></iframe> */}
            </main>
        </>
    );
}