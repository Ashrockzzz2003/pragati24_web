"use client";

import DialogModal from "@/components/DialogModal";
import EventCard from "@/components/EventCard";
import { GET_EVENTS_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

    const [selectedEventIds, setSelectedEventIds] = useState([]);

    useEffect(() => {
        fetch(GET_EVENTS_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                setEventsData(data["data"]);
                setFilteredEventsData(data["data"]);
                setSelectedEvents([]);
            })
            .catch(err => {
                console.log(err);
                buildDialog('Error', 'Something went wrong!', 'OK');
            });
    }, []);

    useEffect(() => {
        if (eventsData.length) {
            setFilteredEventsData(eventsData.filter((eventD) => {
                return !selectedEventIds.includes(eventD["eventId"]);
            }));
        }
    }, [selectedEventIds, eventsData]);

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
            setSelectedEventIds(selectedEventIds.concat(eventId));
        } else {
            // prompt for team size
            let teamSize = prompt("Enter Number of members in your team", minSize);
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
                setSelectedEventIds(selectedEventIds.concat(eventId));
            } else {
                buildDialog('Error', 'Invalid Team Size', 'OK');
                openModal();
            }
        }
    };


    return (
        <main className="h-screen">
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

            {selectedEvents.length > 0 ? (
                <>
                    <h1 className="mb-8 pt-8 text-4xl text-lime-50 text-center">Selected Events to Register</h1>
                    <table className="max-w-11/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-opacity-30 text-center text-md border-black border-separate border-spacing-0 border-solid">
                        <thead className="border-0 text-lg font-medium">
                            <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                                <th className="px-2 py-1 rounded-tl-2xl border-black">Event</th>
                                <th className="px-2 py-1 border-b-black">Members</th>
                                <th className="px-2 py-1 border-b-black rounded-tr-2xl">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEvents.map((eventD, index) => {
                                return (
                                    <tr key={index} className="bg-white">
                                        <td className={"border border-gray-200 px-2 py-1" + (index === selectedEvents.length - 1 ? "border-separate rounded-bl-2xl" : "")} >{eventD["eventName"]}</td>
                                        <td className="border border-gray-200 px-2 py-1">{eventD["totalMembers"]}</td>
                                        <td className={"border border-gray-200 px-2 py-1" + (index === selectedEvents.length - 1 ? "border-separate rounded-br-2xl" : "")} >{"₹ " + (eventD["priceMeasureType"] === '1' ? eventD["eventPrice"] : eventD["eventPrice"]*eventD["totalMembers"])}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            ) : null}

            <h1 className="mb-8 pt-8 text-4xl text-lime-50 text-center">Pragathi 2024 | Register to Events</h1>
            <div className="relative mx-6 my-8 py-2 flex flex-wrap justify-center gap-4 items-center md:mx-16">
                {filteredEventsData.length === 0 ? (
                    <div className='mx-auto'>
                        <p className="p-8 text-center text-lime-100">Loading...</p>
                    </div>
                ) : (
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
                                hasRegistered={false}
                                key={index}
                                registerToEvent={registerToEvent}
                            />
                        )
                    })
                )}
            </div>

            <DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
            />
        </main>
    )

}