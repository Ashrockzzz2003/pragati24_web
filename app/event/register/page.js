"use client";

import DialogModal from "@/components/DialogModal";
import EventCard from "@/components/EventCard";
import NavBar from "@/components/NavBar";
import { GET_EVENTS_URL, REGISTER_EVENT_URL } from "@/components/constants";
import { payUKey } from "@/components/payU";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function RegisterEventScreen() {

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
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [filteredEventsData, setFilteredEventsData] = useState([]);

    const [isSelected, setIsSelected] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);

    // Check if Logged In
    useEffect(() => {
        fetch(GET_EVENTS_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secureLocalStorage.getItem('pragathi-t')}`
            }
        }).then(res => {
            if (res.status === 401) {
                buildDialog('Error', 'You are not logged in!\nPlease Login to continue.', 'Okay');
                openModal();
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else if (res.status === 500) {
                buildDialog('Error', 'Something went wrong!', 'OK');
                openModal();

                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else if (res.status === 200) {
                return res.json();
            } else {
                alert('Something went wrong');
                router.push('/login');
            }
        })
            .then(data => {
                setEventsData(data["data"]);
                setFilteredEventsData(data["data"]);
                setSelectedEvents([]);

                let temp = {};
                data["data"].forEach((eventD) => {
                    temp[eventD["eventId"]] = false;
                });

                setIsSelected(temp);

                if (data["userAccountStatus"] === '1' || data["userAccountStatus"] === '2' || data["userAccountStatus"] === '0') {
                    secureLocalStorage.setItem('pragathi-ua', data["userAccountStatus"]);
                    if (data["userAccountStatus"] === '0') {
                        setTotalAmount(60);
                    }
                }

            })
            .catch(err => {
                console.log(err);
                buildDialog('Alert', 'You must login to register to events!', 'OK');
                openModal();
            })
    }, [router]);

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (eventsData.length) {
            setFilteredEventsData(eventsData.filter((eventD) => {
                return  (isSelected[eventD["eventId"]] === false) && 
                        (searchText === null || searchText === "" || eventD["eventName"].toLowerCase().includes(searchText.toLowerCase()));
            }));
        }
    }, [isSelected, eventsData, searchText]);

    const registerToEvent = (eventId, eventName, eventPrice, priceMeasureType, minSize, maxSize) => {
        if (minSize === maxSize) {
            selectedEvents.push({
                "eventId": eventId,
                "eventName": eventName,
                "eventPrice": eventPrice,
                "priceMeasureType": priceMeasureType,
                "totalMembers": minSize
            });

            setSelectedEvents(selectedEvents);
            setIsSelected({ ...isSelected, [eventId]: true });

            if (priceMeasureType === '1') {
                setTotalAmount(totalAmount + eventPrice);
            } else {
                setTotalAmount(totalAmount + eventPrice * minSize);
            }

        } else {
            // prompt for team size
            let teamSize = prompt(`The team leader alone should register for the event and pay the amount. The team size should be between ${minSize} and ${maxSize}. Enter Number of members in your team`, minSize);
            teamSize = parseInt(teamSize);

            if (teamSize >= minSize && teamSize <= maxSize) {
                selectedEvents.push({
                    "eventId": eventId,
                    "eventName": eventName,
                    "eventPrice": eventPrice,
                    "priceMeasureType": priceMeasureType,
                    "totalMembers": teamSize
                });

                setSelectedEvents(selectedEvents);
                setIsSelected({ ...isSelected, [eventId]: true });

                if (priceMeasureType === '1') {
                    setTotalAmount(totalAmount + eventPrice);
                } else {
                    setTotalAmount(totalAmount + eventPrice * teamSize);
                }

            } else {
                buildDialog('Error', 'Invalid Team Size', 'OK');
                openModal();
            }
        }
    };

    const removeEvent = (eventId, eventPrice) => {
        setTotalAmount(totalAmount - eventPrice);

        let temp = selectedEvents.filter((eventD) => {
            return eventD["eventId"] !== eventId;
        });

        setSelectedEvents(temp);
        setIsSelected({ ...isSelected, [eventId]: false });
    }


    const moveToTransaction = async () => {
        try {
            // main multi dimensional array
            let finalToTransactionArray = [];

            // make array. (eventId, totalMembers, totalPrice)
            selectedEvents.forEach((eventD) => {
                finalToTransactionArray.push([eventD["eventId"], eventD["totalMembers"], (eventD["priceMeasureType"] === '1' ? eventD["eventPrice"] : eventD["eventPrice"] * eventD["totalMembers"])]);
            });

            // console.log(finalToTransactionArray);

            // make api call to our server to get hash
            const response = await fetch(REGISTER_EVENT_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${secureLocalStorage.getItem('pragathi-t')}`
                },
                body: JSON.stringify({
                    "eventList": finalToTransactionArray
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                /*
                amount: 1109
                email: "shettyajoy@gmail.com"
                firstname: "Ajoy Shetty"
                furl: "http://localhost:3000/event/register/success"
                hash: "5665664057950c6a9208a4829f4ac3822fe42145f4552f32951831731e664ddb9afe6dd1a226239f26cb33a4b52f084b6427cdb29b720f531b5d262299743335"
                phone: "8870014773"
                productinfo: "(1,1,299)-(2,3,750)-(0,1,60)"
                surl: "http://localhost:3000/event/register/failure"
                txnid: "TXN-2-1704185233379"
                */

                // Send to payU
                const payUData = {
                    key: payUKey,
                    txnid: data["txnid"],
                    amount: data["amount"],
                    productinfo: data["productinfo"],
                    firstname: data["firstname"],
                    email: data["email"],
                    phone: data["phone"],
                    surl: data["surl"],
                    furl: data["furl"],
                    hash: data["hash"]
                }

                const payUForm = document.createElement('form');
                payUForm.method = 'post';
                payUForm.action = 'https://test.payu.in/_payment';

                for (const key in payUData) {
                    if (payUData.hasOwnProperty(key)) {
                        const hiddenField = document.createElement('input');
                        hiddenField.type = 'hidden';
                        hiddenField.name = key;
                        hiddenField.value = payUData[key];

                        payUForm.appendChild(hiddenField);
                    }
                }

                document.body.appendChild(payUForm);

                // secureLocalStorage.clear(); // logout before going to payU. This is to prevent user from going back to the registration page after paying.
                payUForm.submit();
            } else if (response.status === 201 ) {
                const data = await response.json();

                router.push('/event/register/success');
            } else if (response.status === 401) {
                buildDialog('Session Expired', 'Please Login to continue.', 'Okay');
                openModal();
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else if (response.status === 400) {
                const data = await response.json();

                if (data["ERROR"]) {
                    buildDialog('Error', data["ERROR"], 'Okay');
                    openModal();
                } else {
                    buildDialog('Error', 'Something went wrong!', 'Okay');
                    openModal();
                }
            } else {
                buildDialog('Error', 'Something went wrong!', 'Okay');
                openModal();
            }
        } catch (error) {
            console.log(error);
            buildDialog('Error', 'Something went wrong!', 'Okay');
            openModal();
        }
    }


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

                {/* Info Box regarding mandatory registration fee of 60 rs */}
                {secureLocalStorage.getItem('pragathi-ua') !== '1' ? (
                    <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto mt-4">
                        <div className="flex flex-row justify-between items-center p-4 bg-gray-50 rounded-xl w-full ml-auto mr-auto mb-2">
                            <p className="text-xl font-medium">{"Registration Fee"}</p>
                            <p className="text-xl font-medium">{"₹ 60"}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"You have to pay a mandatory registration fee of ₹ 60 to register to events."}</p>
                        <hr className="my-2" />
                        <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"If you have already paid and still see this message, please allow us upto 5 mins to process your payment. Refresh your page after 5 mins."}</p>
                    </div>
                ) : null}

                <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto mt-4">
                    <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Note: Head to your profile to see events registered by you."}</p>
                </div>


                {selectedEvents.length > 0 ? (
                    <>
                        <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">Selected Events to Register</h1>
                        <table className="max-w-9/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-opacity-30 text-center text-md border-black border-separate border-spacing-0 border-solid">
                            <thead className="border-0 text-lg font-medium">
                                <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                    <th className="px-2 py-1 rounded-tl-2xl border-black">Event</th>
                                    <th className="px-2 py-1 border-b-black">Members</th>
                                    <th className="px-2 py-1 border-b-black">Price</th>
                                    <th className="px-2 py-1 border-b-black">Total Cost</th>
                                    <th className="px-2 py-1 border-b-black rounded-tr-2xl">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {secureLocalStorage.getItem('pragathi-ua') === '0' ? (
                                    <tr className="bg-white">
                                        <td className={"border border-gray-200 px-2 py-1"} >{"Registration Fee"}</td>
                                        <td className="border border-gray-200 px-2 py-1">{1}</td>
                                        <td className={"border border-gray-200 px-2 py-1 text-end"} >{"₹ 60 /head"}</td>
                                        <td className={"border border-gray-200 px-2 py-1"} >{"₹ 60"}</td>
                                        <td className={"border border-gray-200 px-2 py-1"} >
                                            -
                                        </td>
                                    </tr>
                                ) : null}
                                {selectedEvents.map((eventD, index) => {
                                    return (
                                        <tr key={index} className="bg-white">
                                            <td className={"border border-gray-200 px-2 py-1 max-w-[160px] md:max-w-full" + (index === selectedEvents.length - 1 ? "border-separate rounded-bl-2xl" : "")} >{eventD["eventName"]}</td>
                                            <td className="border border-gray-200 px-2 py-1">{eventD["totalMembers"]}</td>
                                            <td className={"border border-gray-200 px-2 py-1"} >{"₹ " + eventD["eventPrice"]} {eventD["priceMeasureType"] === '0' ? "/head" : "/team"}</td>
                                            <td className={"border border-gray-200 px-2 py-1"} >{"₹ " + (eventD["priceMeasureType"] === '1' ? eventD["eventPrice"] : eventD["eventPrice"] * eventD["totalMembers"])}</td>
                                            <td className={"border border-gray-200 px-2 py-1" + (index === selectedEvents.length - 1 ? "border-separate rounded-br-2xl" : "")} >
                                                <div onClick={() => {
                                                    removeEvent(eventD["eventId"], (eventD["priceMeasureType"] === '1' ? eventD["eventPrice"] : eventD["eventPrice"] * eventD["totalMembers"]));
                                                }} className="bg-red-100 text-[#3d0f0f] flex flex-row rounded-lg py-1 px-3 justify-between items-center align-middle hover:bg-opacity-80 cursor-pointer h-fit mr-2">
                                                    <span className="material-icons">remove_circle</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto">
                            <div className="flex flex-col justify-between items-center p-4 bg-gray-50 rounded-xl w-full ml-auto mr-auto mb-2">
                                <p className="text-xl font-medium">{"Total Amount " + "₹ " + totalAmount}</p>
                                <p className="text-xs text-gray-500 text-end">Inclusive of GST</p>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-4">
                                <button onClick={() => {
                                    confirm("Are you sure you want to register to these events?") ? moveToTransaction() : null;
                                }} className="bg-green-100 text-[#0f3d0f] flex flex-row rounded-xl py-2 px-3 justify-between items-center align-middle hover:bg-opacity-80 cursor-pointer h-fit">
                                    <span className="material-icons">check_circle</span>
                                    <span>Confirm</span>
                                </button>
                                <button onClick={() => {
                                    setSelectedEvents([]);
                                    let temp = {};
                                    eventsData.forEach((eventD) => {
                                        temp[eventD["eventId"]] = false;
                                    });

                                    setIsSelected(temp);

                                    if (secureLocalStorage.getItem('pragathi-ua') === '0') {
                                        setTotalAmount(60);
                                    } else {
                                        setTotalAmount(0);
                                    }
                                }} className="bg-red-100 text-[#3d0f0f] flex flex-row rounded-xl py-2 px-3 justify-between items-center align-middle hover:bg-opacity-80 cursor-pointer h-fit">
                                    <span className="material-icons">cancel</span>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}

                <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">Pragati 2024 | Register to Events</h1>
                {/* Big Search Bar */}
                <div className="flex flex-row justify-center items-center gap-4">
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
                <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                    {filteredEventsData.length === 0 ? (
                        <div className='mx-auto'>
                            <p className="p-8 text-center text-lime-100"> ... </p>
                        </div>
                    ) : [
                        // <div key={-1} className="flex flex-row justify-center items-center gap-4">
                        //     <input
                        //         type="text"
                        //         placeholder="Search"
                        //         className="border border-gray-200 rounded-xl p-2 w-64"
                        //         value={searchText}
                        //         onChange={(e) => {
                        //             setSearchText(e.target.value);
                        //         }}
                        //     />
                        //     <div>
                        //         <span className="material-icons">search</span>
                        //         <span>Search</span>
                        //     </div>
                        // </div>,
                        filteredEventsData.map((eventD, index) => {
                            return (
                                <EventCard
                                    eventId={eventD["eventId"]}
                                    eventName={eventD["eventName"]}
                                    presenterName={eventD["presenterName"]}
                                    eventPrice={eventD["eventPrice"]}
                                    eventCategory={eventD["eventCategory"]}
                                    minSize={eventD["minSize"]}
                                    maxSize={eventD["maxSize"]}
                                    contactName={eventD["contactName"]}
                                    contactNumber={eventD["contactNumber"]}
                                    maxRegistrationCount={eventD["maxRegistrationCount"]}
                                    noOfRegistrations={eventD["noOfRegistrations"]}
                                    eventStatus={eventD["eventStatus"]}
                                    priceMeasureType={eventD["priceMeasureType"]}
                                    buildDialog={buildDialog}
                                    openModal={openModal}
                                    hasRegistered={eventD["isRegistered"]}
                                    key={index}
                                    registerToEvent={registerToEvent}
                                />
                            )
                        })
                    ]}
                </div>

                <DialogModal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    title={title}
                    message={message}
                    buttonLabel={buttonLabel}
                />
            </main>
        </>
    )

}