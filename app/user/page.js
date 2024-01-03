"use client";

import DialogModal from "@/components/DialogModal";
import NavBar from "@/components/NavBar";
import RegisteredEventCard from "@/components/RegisteredEventCard";
import { USER_EVENTS_URL, USER_PROFILE_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const crypto = require('crypto');

export default function UserScreen() {
    // For The AlertDialogModal
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');
    const [isReceipt, setIsReceipt] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const router = useRouter();

    const buildDialog = (title, message, buttonLabel, isReceipt=false) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
        setIsReceipt(isReceipt);
    }

    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userRollNumber, setUserRollNumber] = useState("");
    const [hash, setHash] = useState("");
    const [registrationFeeData, setRegistrationFeeData] = useState({});
    const [userAccountStatus, setUserAccountStatus] = useState("");

    const [eventData, setEventData] = useState([]);

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
                    setUserPhone(data["data"][0].userPhone);
                    setRegistrationFeeData(data["data"][0].registrationFee);
                    setUserRollNumber(data["data"][0].userRollNumber);

                    secureLocalStorage.setItem('pragathi-fn', data["data"][0].userFullName);
                    secureLocalStorage.setItem('pragathi-ue', data["data"][0].userEmail);
                    secureLocalStorage.setItem('pragathi-ph', data["data"][0].userPhone);
                    secureLocalStorage.setItem('pragathi-urn', data["data"][0].userRollNumber);

                    fetch(USER_EVENTS_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
                        },
                    }).then((response) => {
                        if (response.status === 200) {
                            response.json().then((data) => {
                                setEventData(data["data"]);
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
                    });
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
        });

    }, [router]);



    return (
        <>
            <NavBar />
            <main>
                <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow lg:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 justify-center w-fit ml-auto mr-auto mt-8" >
                    <img src={`https://www.gravatar.com/avatar/${hash}.jpg?s=200&d=robohash`} alt="Profile" width={200} className="rounded-lg"></img>
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{userFullName}</h5>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{userRollNumber}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{userEmail}</p>
                        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{userPhone}</p>
                        {userAccountStatus === "0" ? <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><span className="text-red-300">Registration Fee Not Paid</span></p> : (<div>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                <span className="text-green-500">Registration Fee Paid</span>
                            </p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                <span className="text-gray-400 italic"> {new Date(registrationFeeData.createdAt).toDateString()}</span>
                            </p>
                        </div>)}
                        {/* Edit profile button */}
                        <button
                            className="px-4 py-2 font-semibold text-black bg-lime-100 rounded-lg shadow-md hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-75"
                            onClick={() => {
                                router.push('/user/edit');
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                <h1 className="mb-1 pt-8 text-2xl text-lime-50 text-center">My Registered Events</h1>
                <div className='mx-auto'>
                    <p className="p-8 text-center text-lime-100">Reload after 5-mins if you have registered and it does not show up here.</p>
                </div>
                <div className="relative mx-6 my-2 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                    {eventData.length <= 0 ? <div className='mx-auto'>
                        <p className="p-8 text-center text-lime-100">No events registered yet.</p>
                    </div> : eventData.map((eventD, index) => {
                        return RegisteredEventCard({
                            key: index,
                            eventId: eventD.eventId,
                            totalAmount: eventD.totalAmount,
                            eventCategory: eventD.eventCategory,
                            totalMembers: eventD.totalMembers,
                            contactName: eventD.contactName,
                            contactNumber: eventD.contactNumber,
                            buildDialog: buildDialog,
                            openModal: openModal,
                            transactionId: eventD.transactionId,
                            eventPrice: eventD.eventPrice,
                            priceMeasureType: eventD.priceMeasureType,
                        });
                    })}
                </div>
            </main>

            <DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
                isReceipt={isReceipt}
            />
        </>
    )
}