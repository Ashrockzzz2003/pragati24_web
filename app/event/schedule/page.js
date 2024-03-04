"use client";

import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';

export default function EventScheduleScreen() {
    return (
        <>
            <NavBar />
            <main>
                <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">Pragati 2024 | Schedule</h1>
                <div className="flex flex-col bg-red-700 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
                    <p className="text-md font-medium text-red-100 max-w-[256px] text-center">{"Online Registrations are closed now. Only offline registrations are open! You can go to the venue directly and register"}</p>
                </div>
                <Link href="/event/register" className="text-lg w-fit ml-auto mr-auto font-semibold text-gray-900 items-center align-middle flex flex-row  border border-gray-400 px-2 py-1 rounded-lg bg-gray-100 mb-8">
                    <span className="material-icons mr-2">app_registration</span>
                    Register for Events
                </Link>
                <Image alt="pragathi main" src="/s1.jpg" className="rounded-xl ml-auto mr-auto" width={720} height={720} />
                <br />
                <Image alt="pragathi main" src="/s2.jpg" className="rounded-xl ml-auto mr-auto" width={720} height={720} />
                <div className="my-16"></div>    
            </main>
        </>
    );
}