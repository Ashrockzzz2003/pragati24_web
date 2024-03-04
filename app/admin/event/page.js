"use client";

import NavBar from "@/components/NavBar";
import { ADMIN_DOWNLOAD_ALL_PARTICIPANTS_LIST_URL, ADMIN_DOWNLOAD_PARTICIPANTS_LIST_URL, ADMIN_EVENTS_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";


export default function EventsScreen() {
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

    const [eventsData, setEventsData] = useState([]);
    const [filteredEventsData, setFilteredEventsData] = useState([]);

    useEffect(() => {
        fetch(ADMIN_EVENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setEventsData(data["data"]);
                    setFilteredEventsData(data["data"]);
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


    const downloadParitcipantsList = async (eventId, eventPrice, priceMeasureType) => {
        try {
            const response = await fetch(ADMIN_DOWNLOAD_PARTICIPANTS_LIST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
                },
                body: JSON.stringify({ eventId: eventId }),
            });

            if (response.status === 200) {
                const data = await response.json();

                /*
                createdAt: "2024-01-03T13:27:03.000Z"
                totalMembers: 1
                transactionId: "TXN-1-1704214843907"
                userEmail: "shettyajoy@gmail.com"
                userFullName: "Ajoy Shetty"
                userId: 2
                userPhone: "8870014773"
                */

                let i = 0;

                if (eventId.toString() === '9') {
                    const csvData = data["data"].map((participant) => {
                        i += 1

                        return {
                            "S No": i,
                            "Transaction ID": participant.transactionId,
                            "Roll Number": participant.userRollNumber,
                            "Full Name": participant.userFullName,
                            "Email": participant.userEmail,
                            "Phone": participant.userPhone,
                            "No Of Members": participant.totalMembers,
                            "College Name": participant.collegeName,
                            "College City": participant.collegeCity,
                            "Academic Year": `${participant.academicYear.toString()} year`,
                            "Degree": participant.degree,
                            "Registered At": new Date(participant.createdAt).toDateString(),
                            "Auction Mania Date": participant.whichDay === '1' ? "Feb 17th" : "Feb 16th",
                            "Amount Paid": (priceMeasureType === '1' ? eventPrice : eventPrice * participant.totalMembers),
                            "Need Accomodation": participant.needAccomodation === '1' ? "Yes" : "No",
                            "Number Of Days Accomodation": participant.numberOfDays ?? "0",
                            "Which Day": participant.numberOfDays === "2" ? "Both Days" : participant.theDay === '1' ? "Feb 17th" : "Feb 16th",
                        }
                    });

                    const csvFields = [
                        "S No",
                        "Transaction ID",
                        "Roll Number",
                        "Full Name",
                        "Email",
                        "Phone",
                        "No Of Members",
                        "College Name",
                        "College City",
                        "Academic Year",
                        "Degree",
                        "Registered At",
                        "Auction Mania Date",
                        "Amount Paid",
                        "Need Accomodation",
                        "Number Of Days Accomodation",
                        "Which Day",
                    ];

                    const csv = csvData.map(row => csvFields.map(fieldName => JSON.stringify(row[fieldName], null, 2)).join(','));
                    csv.unshift(csvFields.join(','));
                    const csvArray = csv.join('\r\n');

                    const a = document.createElement('a');
                    const file = new Blob([csvArray], { type: 'text/csv' });
                    a.href = URL.createObjectURL(file);
                    a.download = `event-${eventId}-participants-list-${new Date().getTime()}.csv`
                    a.click();

                    buildDialog('Success', 'Participants List Downloaded', 'Okay');
                    openModal();

                    return;
                }

                const csvData = data["data"].map((participant) => {
                    i += 1

                    return {
                        "S No": i,
                        "Transaction ID": participant.transactionId,
                        "Roll Number": participant.userRollNumber,
                        "Full Name": participant.userFullName,
                        "Email": participant.userEmail,
                        "Phone": participant.userPhone,
                        "No Of Members": participant.totalMembers,
                        "College Name": participant.collegeName,
                        "College City": participant.collegeCity,
                        "Academic Year": `${participant.academicYear.toString()} year`,
                        "Degree": participant.degree,
                        "Registered At": new Date(participant.createdAt).toDateString(),
                        "Amount Paid": (priceMeasureType === '1' ? eventPrice : eventPrice * participant.totalMembers),
                        "Need Accomodation": participant.needAccomodation === '1' ? "Yes" : "No",
                        "Number Of Days Accomodation": participant.needAccomodation === "0" ? "-" : participant.numberOfDays ?? "0",
                        "Which Day": participant.needAccomodation === "0" ? "-" : participant.numberOfDays === "2" ? "Both Days" : participant.theDay === '1' ? "Feb 17th" : "Feb 16th",
                    }
                });

                const csvFields = [
                    "S No",
                    "Transaction ID",
                    "Roll Number",
                    "Full Name",
                    "Email",
                    "Phone",
                    "No Of Members",
                    "College Name",
                    "College City",
                    "Academic Year",
                    "Degree",
                    "Registered At",
                    "Amount Paid",
                    "Need Accomodation",
                    "Number Of Days Accomodation",
                    "Which Day",
                ];

                const csv = csvData.map(row => csvFields.map(fieldName => JSON.stringify(row[fieldName], null, 2)).join(','));
                csv.unshift(csvFields.join(','));
                const csvArray = csv.join('\r\n');

                const a = document.createElement('a');
                const file = new Blob([csvArray], { type: 'text/csv' });
                a.href = URL.createObjectURL(file);
                a.download = `event-${eventId}-participants-list-${new Date().getTime()}.csv`
                a.click();

                buildDialog('Success', 'Participants List Downloaded', 'Okay');
                openModal();

                return;


            } else if (response.status === 401) {
                secureLocalStorage.clear();
                buildDialog('Session Expired', 'Please login again to continue', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else if (response.status === 400) {
                const data = await response.json();
                if (data["ERROR"]) {
                    buildDialog('Error', data["ERROR"], 'Okay');
                    openModal();
                } else {
                    buildDialog('Error', 'Something went wrong', 'Okay');
                    openModal();
                }
            } else {
                buildDialog('Error', 'Something went wrong', 'Okay');
                openModal();
            }

            return;
        } catch (error) {
            console.log(error);
            buildDialog('Error', 'Something went wrong', 'Okay');
            openModal();
        }
    }

    const downloadAllParitcipantsList = async () => {
        try {
            const response = await fetch(ADMIN_DOWNLOAD_ALL_PARTICIPANTS_LIST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                /*
                createdAt: "2024-01-03T13:27:03.000Z"
                totalMembers: 1
                transactionId: "TXN-1-1704214843907"
                userEmail: "shettyajoy@gmail.com"
                userFullName: "Ajoy Shetty"
                userId: 2
                userPhone: "8870014773"
                */

                let i = 0;

                const csvData = data["data"].map((participant) => {
                    let eventPrice = participant.eventPrice;
                    let priceMeasureType = participant.priceMeasureType;

                    i += 1

                    return {
                        "S No": i,
                        "Transaction ID": participant.transactionId,
                        "Roll Number": participant.userRollNumber,
                        "Full Name": participant.userFullName,
                        "Email": participant.userEmail,
                        "Phone": participant.userPhone,
                        "No Of Members": participant.totalMembers,
                        "College Name": participant.collegeName,
                        "College City": participant.collegeCity,
                        "Academic Year": `${participant.academicYear.toString()} year`,
                        "Degree": participant.degree,
                        "Event Name": participant.eventName,
                        "Registered At": new Date(participant.createdAt).toDateString(),
                        "Auction Mania Date": !(participant.whichDay === "1" || participant.whichDay === '0') ? "-" : participant.whichDay === '1' ? "Feb 17th" : "Feb 16th",
                        "Amount Paid": (priceMeasureType === '1' ? eventPrice : eventPrice * participant.totalMembers),
                        "Need Accomodation": participant.needAccomodation === '1' ? "Yes" : "No",
                        "Number Of Days Accomodation": participant.numberOfDays ?? "0",
                        "Which Day": participant.numberOfDays === "2" ? "Both Days" : participant.theDay === '1' ? "Feb 17th" : "Feb 16th",
                    }
                });

                const csvFields = [
                    "S No",
                    "Transaction ID",
                    "Roll Number",
                    "Full Name",
                    "Email",
                    "Phone",
                    "No Of Members",
                    "College Name",
                    "College City",
                    "Academic Year",
                    "Degree",
                    "Event Name",
                    "Registered At",
                    "Auction Mania Date",
                    "Amount Paid",
                    "Need Accomodation",
                    "Number Of Days Accomodation",
                    "Which Day",
                ];

                const csv = csvData.map(row => csvFields.map(fieldName => JSON.stringify(row[fieldName], null, 2)).join(','));
                csv.unshift(csvFields.join(','));
                const csvArray = csv.join('\r\n');

                const a = document.createElement('a');
                const file = new Blob([csvArray], { type: 'text/csv' });
                a.href = URL.createObjectURL(file);
                a.download = `all-events-participants-list-${new Date().getTime()}.csv`
                a.click();

                buildDialog('Success', 'All Participants List Downloaded', 'Okay');
                openModal();

                return;


            } else if (response.status === 401) {
                secureLocalStorage.clear();
                buildDialog('Session Expired', 'Please login again to continue', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else if (response.status === 400) {
                const data = await response.json();
                if (data["ERROR"]) {
                    buildDialog('Error', data["ERROR"], 'Okay');
                    openModal();
                } else {
                    buildDialog('Error', 'Something went wrong', 'Okay');
                    openModal();
                }
            } else {
                buildDialog('Error', 'Something went wrong', 'Okay');
                openModal();
            }

            return;
        } catch (error) {
            console.log(error);
            buildDialog('Error', 'Something went wrong', 'Okay');
            openModal();
        }
    }

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setFilteredEventsData(eventsData.filter((eventD) => {
            return eventD.eventName.toLowerCase().includes(searchText.toLowerCase());
        }));
    }, [searchText, eventsData]);

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

                <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">Pragati 2024 | Events Data</h1>

                <button onClick={() => {
                    downloadAllParitcipantsList();
                }} className={"bg-blue-100 text-[#0f113d] flex flex-row rounded-lg py-2 px-2 justify-between items-center align-middle hover:bg-opacity-80 h-fit disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer ml-auto mr-auto mb-4"}
                >
                    <span className="material-icons mr-2">download</span>
                    <p className="text-sm">Download All Participants Data</p>
                </button>

                {/* Big Search Bar */}
                <div className="flex flex-row justify-center items-center gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by Event Name"
                        className="border bg-white rounded-xl p-3 w-96 text-lg"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </div>

                {filteredEventsData.length === 0 ? (
                    <div className='mx-auto'>
                        <p className="p-8 text-center text-lime-100"> ... </p>
                    </div>
                ) : (
                    <table className="mx-auto max-w-11/12 border-collapse">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="p-2 text-center">Event ID</th>
                                <th className="p-2 text-center">Event Name</th>
                                <th className="p-2 text-center">Event Price</th>
                                <th className="p-2 text-center">Event Category</th>
                                <th className="p-2 text-center">Size</th>
                                <th className="p-2 text-center">No Of Registrations</th>
                                <th className="p-2 text-center">Max Registrations</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredEventsData.map((eventD, index) => (
                                <tr key={index}>
                                    <td className="p-2 text-center border">{eventD.eventId}</td>
                                    <td className="p-2 text-center border">{eventD.eventName}</td>
                                    <td className="p-2 text-end border">{"₹ " + eventD.eventPrice + " / " + (eventD.priceMeasureType === "0" ? "head" : "team")}</td>
                                    <td className="p-2 text-center border">{eventD.eventCategory === '0' ? (
                                        <div className="bg-yellow-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#544a15] align-middle">{"Management"}</div>
                                    ) : (
                                        <div className="bg-pink-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#461348] align-middle">{"Non-Management"}</div>
                                    )}</td>
                                    <td className="p-2 text-center border">
                                        {eventD.minSize === eventD.maxSize ? (
                                            <p className="text-sm">{eventD.minSize + (eventD.minSize === 1 ? " member" : " members")}</p>
                                        ) : (
                                            <p className="text-sm">{eventD.minSize + " to " + eventD.maxSize + " members"}</p>
                                        )}
                                    </td>
                                    <td className="p-2 text-center border">{eventD.noOfRegistrations}</td>
                                    <td className="p-2 text-center border">{eventD.maxRegistrationCount}</td>
                                    <td className="p-2 text-center border">
                                        <button onClick={() => {
                                            if (eventD.noOfRegistrations > 0) {
                                                downloadParitcipantsList(eventD.eventId, eventD.eventPrice, eventD.priceMeasureType)
                                            } else {
                                                buildDialog('Error', 'No Participants Registered yet.', 'Okay');
                                                openModal();
                                            }
                                        }} className={"bg-blue-100 text-[#0f113d] flex flex-row rounded-lg py-2 px-2 justify-between items-center align-middle hover:bg-opacity-80 h-fit mr-2 disabled:bg-gray-100 disabled:text-gray-400" + (eventD.noOfRegistrations <= 0 ? " cursor-not-allowed" : " cursor-pointer")}
                                            disabled={eventD.noOfRegistrations <= 0 ? true : false}
                                        >
                                            <span className="material-icons mr-2">download</span>
                                            <p className="text-sm">Download Participants</p>
                                        </button>
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