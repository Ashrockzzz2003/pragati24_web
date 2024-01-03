"use client";

import AdminNavBar from "@/components/AdminNavbar";
import DialogModal from "@/components/DialogModal";
import { USER_PROFILE_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const crypto = require('crypto');

export default function AdminScreen() {
    // For The AlertDialogModal
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const router = useRouter();

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [hash, setHash] = useState("");
    const [userAccountStatus, setUserAccountStatus] = useState("");

    useEffect(() => {
        fetch(USER_PROFILE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setUserFullName(data["data"][0].userFullName);
                    setUserEmail(data["data"][0].userEmail);
                    setHash(crypto.createHash('md5').update(data["data"][0].userEmail).digest("hex"));
                    setUserAccountStatus(data["data"][0].userAccountStatus);
                });
            } else if (response.status === 401) {
                secureLocalStorage.clear();
                buildDialog('Session Expired', 'Please login again to continue', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                buildDialog('Error', 'Something went wrong', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push('/event');
                }, 2000);
            }
        }).catch((err) => {
            console.log(err);
            buildDialog('Error', 'Something went wrong', 'Okay');
            openModal();

            setTimeout(() => {
                router.push('/event');
            }, 2000);
        })
    }, [router]);

    return (
        <>
            <AdminNavBar />
            <main>
                <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow lg:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 justify-center w-fit ml-auto mr-auto mt-16" >
                    <img src={`https://www.gravatar.com/avatar/${hash}.jpg?s=200&d=robohash`} alt="Profile" width={200} className="rounded-lg"></img>
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{userFullName}</h5>
                        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{userEmail}</p>
                    </div>
                </div>
            </main>

            <DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
            />
        </>
    )
}