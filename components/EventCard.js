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

    return <div className="border flex flex-col rounded-xl backdrop-blur-xl bg-gray-50 w-72">
        <div>
            <Image src={`/event/${eventId}.png`} width={300} height={300} className="rounded-t-xl max-h-100" alt={eventId + "_im"} />
        </div>
        <div className="flex flex-row items-center justify-between align-middle">
            <div className="px-4 py-1 my-2 flex flex-col space-y-1 justify-center items-center">
                <p className="font-medium text-xl text-center bg-green-100 text-[#212020] rounded-xl w-fit px-2 m-auto">{"₹ " + eventPrice + " / " + (priceMeasureType === "0" ? "head" : "team")}</p>
                <div className="flex flex-row h-fit">
                    {eventCategory === '0' ? (
                        <div className="bg-yellow-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#544a15] align-middle">{"Management"}</div>
                    ) : (
                        <div className="bg-pink-100 rounded-xl pt-1 pb-1 px-2 w-fit text-[#461348] align-middle">{"Non-Management"}</div>
                    )}
                    <div onClick={
                        () => {
                            buildDialog("Contact Detials", `${contactName} | ${contactNumber}`, 'Okay')
                            openModal()
                        }
                    } className="bg-red-100 text-[#430e0e] flex flex-row rounded-xl pt-0 pb-0 px-1 items-center hover:bg-opacity-80 cursor-pointer ml-1">
                        <span className="material-icons">info</span>
                    </div>
                </div>
            </div>
            {hasRegistered === true ? (
                <div className="bg-gray-100 text-[#143d0f] flex flex-row rounded-lg py-6 px-4 justify-between items-center align-middle hover:bg-opacity-80 cursor-pointer h-fit mr-2">
                    <span className="material-icons">verified</span>
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
            {minSize === maxSize ? (
                <p className="text-sm">{minSize + (minSize === 1 ? " member" : " members")}</p>
            ) : (
                <p className="text-sm">{minSize + " to " + maxSize + " members"}</p>
            )}
        </div>
    </div>;
}