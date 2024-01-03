"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";

export default function AdminNavBar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRoleId, setUserRoleId] = useState(secureLocalStorage.getItem("pragathi-ur"));

    const router = useRouter();

    useEffect(() => {
        secureLocalStorage.getItem("pragathi-t") && secureLocalStorage.getItem("pragathi-ue") && secureLocalStorage.getItem("pragathi-ur") && setIsLoggedIn(true) && setUserRoleId(secureLocalStorage.getItem("pragathi-ur"));
    }, [])

    return (
        <header className="flex justify-center items-center w-fit ml-auto mr-auto sticky z-50 top-0">
            <nav className="md:w-fit md:ml-auto md:mr-auto md:rounded-xl md:h-fit bg-[#292a2d66] backdrop-blur-lg md:align-middle md:items-center md:p-2 relative
            m-0 p-2 z-10 w-fit ml-auto mr-auto rounded-xl h-fit flex items-center flex-col space-y-2">
                <ul className="flex flex-row justify-center align-middle items-center">
                    <Link className="rounded-xl h-fit bg-[#00000066] backdrop:blur-lg items-center align-middle px-2 py-3 text-white cursor-pointer hover:bg-white hover:px-4 hover:text-black hover:shadow-lg" href="/">
                        <span className="font-semibold">Pragathi 2024</span>
                    </Link>
                    <span className="md:flex md:flex-row md:space-y-0 md:pt-0 flex flex-col space-y-3 pt-2 items-center align-middle">
                        <li className="text-white relative cursor-pointer whitespace-nowrap"><Link className="text-white px-2 py-4 m-2 hover:bg-white hover:px-4 hover:py-3 hover:rounded-xl hover:text-black hover:shadow-lg cursor-pointer" href="/admin/event">Events</Link></li>
                        {isLoggedIn ? (
                            <li className="text-white relative cursor-pointer whitespace-nowrap"><Link className="text-white px-2 py-4 m-2 hover:bg-white hover:px-4 hover:py-3 hover:rounded-xl hover:text-black hover:shadow-lg cursor-pointer" href={userRoleId === 1 ? "/admin" : "/user"}>Profile</Link></li>
                        ) : (
                            <li className="text-white relative cursor-pointer whitespace-nowrap"><Link className="text-white px-2 py-4 m-2 hover:bg-white hover:px-4 hover:py-3 hover:rounded-xl hover:text-black hover:shadow-lg cursor-pointer" href="/auth/register">Register</Link></li>
                        )}
                        {isLoggedIn ? (
                            <li className="text-white relative cursor-pointer whitespace-nowrap"><Link className="text-white px-2 py-4 m-2 hover:bg-white hover:px-4 hover:py-3 hover:rounded-xl hover:text-black hover:shadow-lg cursor-pointer" href={""} onClick={() => {
                                secureLocalStorage.clear();
                                setIsLoggedIn(false);
                                setUserRoleId(0);
                                router.reload();
                            }}>Logout</Link></li>
                        ) : (
                            <li className="text-white relative cursor-pointer whitespace-nowrap"><Link className="text-white px-2 py-4 m-2 hover:bg-white hover:px-4 hover:py-3 hover:rounded-xl hover:text-black hover:shadow-lg cursor-pointer" href="/auth/login">Login</Link></li>
                        )}
                    </span>
                </ul>
            </nav>
        </header>
    );
}