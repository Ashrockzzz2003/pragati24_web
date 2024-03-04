"use client";

import NavBar from "@/components/NavBar";
import { ADMIN_ACCOMODATION_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";


export default function AccomodationInfoScreen() {
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

    const [pData, setPData] = useState([]);
    const [filteredPData, setFilteredPData] = useState([]);

    useEffect(() => {
        fetch(ADMIN_ACCOMODATION_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setPData(data["data"]);
                    setFilteredPData(data["data"]);
                });
            } else if (response.status === 401) {
                secureLocalStorage.clear();
                buildDialog('Session Expired', 'Please login again to continue', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                buildDialog('Error', 'Something went wrong', 'Okay');
                openModal();
            }
        });
    }, [router]);

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setFilteredPData(pData.filter((eventD) => {
            return eventD.userFullName.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [searchText, pData]);

    return (
        <>
            <NavBar />
            <main className="h-full">
                <div
                    className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-2xl"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a8abce] to-[#a9afde] opacity-10"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%, 45.2% 34.5%)',
                        }}
                    />
                </div>

                <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">Pragati 2024 | Accomodation Data</h1>
                {/* Big Search Bar */}
                <div className="flex flex-row justify-center items-center gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by participant name"
                        className="border bg-white rounded-xl p-3 w-96 text-lg"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </div>

                {filteredPData.length === 0 ? (
                    <div className='mx-auto'>
                        <p className="p-8 text-center text-lime-100"> ... </p>
                    </div>
                ) : (
                    <table className="mx-auto max-w-11/12 border-collapse">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="p-2 text-center">Contact Info</th>
                                <th className="p-2 text-center">College</th>
                                <th className="p-2 text-center">Accomodation Info</th>
                                <th className="p-2 text-center">Events Registered</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredPData.map((eventD, index) => (
                                <tr key={index}>
                                    <td className="p-2 text-center border">
                                        <p className="font-bold">{eventD.userFullName}</p>
                                        <p className="font-normal text-gray-700">{eventD.userEmail}</p>
                                        <p className="font-normal text-gray-700">{eventD.userRollNumber}</p>
                                        <p className="font-normal text-gray-700">{eventD.userPhone}</p>
                                    </td>
                                    <td className="p-2 text-center border w-16">{`${eventD.collegeName}, ${eventD.collegeCity}`}</td>
                                    <td className="p-2 text-center border">
                                        {eventD.needAccomodation === "1" && eventD.numberOfDays === "2" ?
                                            <div className=" bg-black p-4 rounded-xl text-white">
                                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                                <p>Feb 16th, 2024</p>
                                                <p>Feb 17th, 2024</p>
                                            </div> : eventD.needAccomodation === "1" && eventD.numberOfDays === "1" && eventD.theDay === "0" ? <div className="bg-black p-4 rounded-xl text-white">
                                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                                <p>Feb 16th, 2024</p>
                                            </div> : eventD.needAccomodation === "1" && eventD.numberOfDays === "1" && eventD.theDay === "1" ? <div className="bg-black p-4 rounded-xl text-white">
                                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                                <p>Feb 17th, 2024</p>
                                            </div> : <div className="bg-black p-4 rounded-xl text-white">
                                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                                <p>No Accomodation needed.</p>
                                            </div>
                                        }
                                    </td>
                                    <td className="p-2 text-center border">
                                        <p className="font-normal text-gray-700">{eventD.noOfEventsRegistered ?? "0"} events</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </>
    )
}