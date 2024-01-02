import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import DialogModal from "./DialogModal";

export default function EventCard({
    eventId,
    eventName,
    presenterName,
    eventPrice,
    eventCategory,
    minSize,
    maxSize,
    contactName,
    contactNumber,
    maxRegistrationCount,
    noOfRegistrations,
    eventStatus,
    priceMeasureType,
    buildDialog,
    openModal,
    hasRegistered,
    registerToEvent
}) {
    // For The AlertDialogModal

    return <div className={"border flex flex-col rounded-xl backdrop-blur-xl bg-gray-50 w-72"} >
        {/* <div className="bg-gray-100 rounded-lg flex flex-row py-2 px-1 justify-between items-center hover:bg-opacity-80 cursor-pointer">
            <span className="material-icons">call</span>
            <p className="text-sm text-gray-500 py-1 px-1 text-center">{contactName} | {contactNumber}</p>
        </div> */}
        <div>
            <Image src={`/event/${eventId}.png`} width={300} height={300} className="rounded-t-xl max-h-100" alt={eventId + "_im"} />
        </div>
        <div className="flex flex-row items-center justify-between align-middle">
            <div className="px-3 py-1 my-2 flex flex-col space-y-1 justify-start items-start">
                <div className="font-medium text-xl text-center bg-green-100 text-[#212020] rounded-xl w-fit px-2">
                    <p>{"₹ " + eventPrice + " / " + (priceMeasureType === "0" ? "head" : "team")}</p>
                    <p className="text-xs text-gray-500">Inclusive of GST</p>
                </div>
                <div className="flex flex-row h-fit">
                    {eventCategory === '0' ? (
                        <div className="bg-yellow-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#544a15] align-middle">{"Management"}</div>
                    ) : (
                        <div className="bg-pink-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#461348] align-middle">{"Non-Management"}</div>
                    )}
                    <div onClick={
                        () => {
                            if (minSize !== maxSize) {
                                buildDialog("Details", `The team leader alone should register for the event and pay the amount. The team size should be between ${minSize} and ${maxSize}. Any doubts contact, ${contactName} | ${contactNumber}`, 'Okay')
                            } else {
                                buildDialog("Contact Detials", `${contactName} | ${contactNumber}`, 'Okay')
                            }
                            openModal()
                        }
                    } className="bg-red-100 text-[#430e0e] flex flex-row rounded-xl pt-0 pb-0 px-1 items-center hover:bg-opacity-80 cursor-pointer ml-1">
                        <span className="material-icons">info</span>
                    </div>
                </div>
            </div>
            {(hasRegistered === true) ? (
                <div className="bg-gray-100 text-[#143d0f] flex flex-row rounded-lg py-6 px-4 justify-between items-center align-middle hover:bg-opacity-80 cursor-not-allowed h-fit mr-2">
                    <span className="material-icons">verified</span>
                </div>
            ) : noOfRegistrations >= maxRegistrationCount ? (
                <div>
                    <div className="bg-red-100 text-[#3d0f0f] flex flex-row rounded-lg py-6 px-4 justify-between items-center align-middle hover:bg-opacity-80 cursor-not-allowed h-fit mr-2">
                        <span className="material-icons">block</span>
                    </div>
                </div>
            ) : (

                <div onClick={() => {
                    registerToEvent(eventId, eventName, eventPrice, priceMeasureType, minSize, maxSize);
                }} className="bg-blue-100 text-[#0f113d] flex flex-row rounded-lg py-6 px-4 justify-between items-center align-middle hover:bg-opacity-80 cursor-pointer h-fit mr-2">
                    <span className="material-icons">add_circle</span>
                </div>
            )}
        </div>
        <hr className="border-gray-300 w-full" />
        <div className="bg-green-100 text-[#0f3d0f] flex flex-row rounded-lg py-2 px-1 justify-between items-center hover:bg-opacity-80 cursor-pointer">
            <span className="material-icons">group</span>
            {hasRegistered === true ? (
                <p className="text-sm text-green-100 bg-[#0f3d0f] rounded-lg py-1 px-1">Registered</p>
            ) : (noOfRegistrations >= maxRegistrationCount) ? (
                <p className="text-sm text-red-100 bg-[#3d0f0f] rounded-lg py-1 px-1">Registrations Closed</p>
            ) : null}

            {minSize === maxSize ? (
                <p className="text-sm">{minSize + (minSize === 1 ? " member" : " members")}</p>
            ) : (
                <p className="text-sm">{minSize + " to " + maxSize + " members"}</p>
            )}
        </div>
    </div>;
}