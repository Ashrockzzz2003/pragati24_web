"use client";

import DialogModal from "@/components/DialogModal";
import NavBar from "@/components/NavBar";
import RegisteredEventCard from "@/components/RegisteredEventCard";
import { USER_EVENTS_URL, USER_PROFILE_URL } from "@/components/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import 'material-icons/iconfont/material-icons.css';

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

    const buildDialog = (title, message, buttonLabel, isReceipt = false) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
        setIsReceipt(isReceipt);
    }

    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userRollNumber, setUserRollNumber] = useState("");
    const [collegeName, setCollegeName] = useState('');
    const [collegeCity, setCollegeCity] = useState('');
    const [academicYear, setAcademicYear] = useState(0);
    const [degree, setDegree] = useState('');
    const [needAccomodation, setNeedAccomodation] = useState("0");
    const [numberOfDays, setNumberOfDays] = useState("2");
    const [theDay, setTheDay] = useState("0");

    const [hash, setHash] = useState("");
    // const [registrationFeeData, setRegistrationFeeData] = useState({}); // REG FEE COMMENTED
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
                    // console.log(data);
                    setUserFullName(data["data"][0].userFullName);
                    setUserEmail(data["data"][0].userEmail);
                    setHash(crypto.createHash('md5').update(data["data"][0].userEmail).digest("hex"));
                    setUserAccountStatus(data["data"][0].userAccountStatus);
                    setUserPhone(data["data"][0].userPhone);
                    // setRegistrationFeeData(data["data"][0].registrationFee); // REG FEE COMMENTED
                    setUserRollNumber(data["data"][0].userRollNumber);
                    setCollegeName(data["data"][0].collegeName);
                    setCollegeCity(data["data"][0].collegeCity);
                    setAcademicYear(data["data"][0].academicYear);
                    setDegree(data["data"][0].degree);
                    setNeedAccomodation(data["data"][0].needAccomodation);
                    setNumberOfDays(data["data"][0].numberOfDays ?? "");
                    setTheDay(data["data"][0].theDay ?? "");

                    secureLocalStorage.setItem('pragathi-fn', data["data"][0].userFullName);
                    secureLocalStorage.setItem('pragathi-ue', data["data"][0].userEmail);
                    secureLocalStorage.setItem('pragathi-ph', data["data"][0].userPhone);
                    secureLocalStorage.setItem('pragathi-urn', data["data"][0].userRollNumber);
                    secureLocalStorage.setItem('pragathi-ua', data["data"][0].userAccountStatus);
                    secureLocalStorage.setItem('pragati-colName', data["data"][0].collegeName);
                    secureLocalStorage.setItem('pragati-colCity', data["data"][0].collegeCity);
                    secureLocalStorage.setItem('pragati-aYear', data["data"][0].academicYear);
                    secureLocalStorage.setItem('pragati-deg', data["data"][0].degree);
                    secureLocalStorage.setItem('pragati-nAcco', data["data"][0].needAccomodation);
                    secureLocalStorage.setItem('pragati-nDays', data["data"][0].numberOfDays ?? "1");
                    secureLocalStorage.setItem('pragati-tDay', data["data"][0].theDay ?? "0");

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
                    <div className="p-2">
                        <Image src={`https://www.gravatar.com/avatar/${hash}.jpg?s=200&d=robohash`} alt="Profile" width={200} height={200} className="rounded-lg mb-8"></Image>
                        {needAccomodation === "1" && numberOfDays === "2" ?
                            <div className=" bg-black p-4 rounded-xl text-white">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 16th, 2024</p>
                                <p>Feb 17th, 2024</p>
                            </div> : needAccomodation === "1" && numberOfDays === "1" && theDay === "0" ? <div className="bg-black p-4 rounded-xl text-white">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 16th, 2024</p>
                            </div> : needAccomodation === "1" && numberOfDays === "1" && theDay === "1" ? <div className="bg-black p-4 rounded-xl text-white">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 17th, 2024</p>
                            </div> : <div className="bg-black p-4 rounded-xl text-white">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>No Accomodation needed.</p>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{userFullName}</h5>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{userRollNumber}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{userEmail}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{collegeName}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{collegeCity}</p>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{degree}, {academicYear} year</p>
                        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{userPhone}</p>
                        {/* {userAccountStatus === "0" ? <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><span className="text-red-300">Registration Fee Not Paid</span></p> : (<div>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                <span className="text-green-500">Registration Fee Paid</span>
                            </p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                <span className="text-gray-400 italic"> {new Date(registrationFeeData.createdAt).toDateString()}</span>
                            </p>
                        </div>)} */} {/* // REG FEE COMMENTED */}
                        {/* Edit profile button */}
                        <button
                            className="px-4 py-2 mt-4 md:mt-8 lg:mt-16 font-semibold text-black bg-lime-100 rounded-lg shadow-md hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-75"
                            onClick={() => {
                                router.push('/user/edit');
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="flex flex-col bg-red-700 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
                    <p className="text-md font-medium text-red-100 max-w-[256px] text-center">{"Online Registrations are closed now. Only offline registrations are open! You can go to the venue directly and register"}</p>
                </div>
                
                <Link href="/event/register" className="text-lg w-fit ml-auto mr-auto font-semibold text-gray-900 items-center align-middle flex flex-row  border border-gray-400 px-2 py-1 rounded-lg bg-gray-100 my-8">
                    <span className="material-icons mr-2">app_registration</span>
                    Register for Events
                </Link>

                <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow lg:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 justify-center w-fit ml-auto mr-auto mt-8" >
                    <Link href="/user/transactions" className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">My Transactions</h5>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">View status of your transactions</p>
                    </Link>
                </div>

                <h1 className="mb-1 pt-8 text-2xl text-lime-50 text-center">My Registered Events</h1>
                <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto mt-4">
                    <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"If you have registered for events and it does not show up here, please go to My Transactions above and then click on verify now."}</p>
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