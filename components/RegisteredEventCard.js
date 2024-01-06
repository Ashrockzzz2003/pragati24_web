import Image from "next/image";
import 'material-icons/iconfont/material-icons.css';
import { EVENT_RECEIPT_URL } from "./constants";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";

export default function RegisteredEventCard({
    eventId,
    totalAmount,
    priceMeasureType,
    eventPrice,
    eventCategory,
    totalMembers,
    contactName,
    contactNumber,
    buildDialog,
    openModal,
    transactionId,
    key
}) {
    const router = useRouter();

    const getEventRegistrationReceipt = async () => {
        try {
            const response = await fetch(EVENT_RECEIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secureLocalStorage.getItem("pragathi-t")}`,
                },
                body: JSON.stringify({
                    eventId: eventId
                })
            });

            if (response.status === 200) {
                const data = await response.json();

                /*
                "data": {
                    "transactionId": "TXN-1-1704214843907",
                    "transactionCreatedAt": "2024-01-03T11:48:30.000Z",
                    "transactionAmount": 359,
                    "splitUp": [
                        {
                            "eventName": "Registration Fee",
                            "totalMembers": "1",
                            "amount": "60"
                        },
                        {
                            "eventName": "Galactic Managers (Best Marketing manager)",
                            "totalMembers": "1",
                            "amount": "299"
                        }
                    ]
                }
                */

                const transactionId = data["data"].transactionId;
                const transactionCreatedAt = new Date(data["data"].transactionCreatedAt).toDateString();
                const transactionAmount = data["data"].transactionAmount;
                const splitUp = data["data"].splitUp;

                // recipt table
                const receipt = `
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between">
                        <p class="text-sm">Transaction ID</p>
                        <p class="text-sm">${transactionId}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p class="text-sm">Transaction Date</p>
                        <p class="text-sm">${transactionCreatedAt}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p class="text-sm">Transaction Amount</p>
                        <p class="text-sm">₹ ${transactionAmount}/-</p>
                    </div>

                    <hr class="border-gray-300 w-full mt-4 mb-4" />

                    <table class="table-auto w-full border mt-2 text-sm">
                        <thead>
                            <tr>
                                <th class="px-4 py-2">Event Name</th>
                                <th class="px-4 py-2">Total Members</th>
                                <th class="px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${splitUp.map((item, index) => {
                    return `<tr key=${index}>
                                        <td class="border px-2 py-2">${item.eventName}</td>
                                        <td class="border px-2 py-2">${item.totalMembers}</td>
                                        <td class="border px-2 py-2 text-end">₹ ${item.amount}/-</td>
                                    </tr>`
                }).join("")}
                            <tr key=100>
                                        <td class="border px-2 py-2">Total</td>
                                        <td class="border px-2 py-2 text-end" colSpan=2>
                                            <p>₹ ${transactionAmount}/-</p>
                                            <p class="text-xs text-gray-500 text-end">Inclusive of GST</p>
                                        </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `

                buildDialog("Event Registration Receipt", receipt, 'Okay', true);
                openModal();

            } else if (response.status === 401) {
                secureLocalStorage.clear();
                buildDialog("Session Expired", "Your session has expired. Please login again.", 'Okay')
                openModal();

                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else if (response.status === 400) {
                const data = await response.json();

                if (data["ERROR"]) {
                    buildDialog("Error", data["ERROR"], 'Okay')
                    openModal();
                } else {
                    buildDialog("Error", "Something went wrong", 'Okay')
                    openModal();
                }
            } else {
                buildDialog("Error", "Something went wrong", 'Okay')
                openModal();
            }

        } catch (error) {
            console.log(error)
            buildDialog("Error", "Something went wrong", 'Okay')
            openModal();
        } finally {

        }
    }

    return <div key={key} className={"border flex flex-col rounded-xl backdrop-blur-xl bg-gray-50 w-72"} >
        <div>
            <Image src={`/event/${eventId}.png`} width={300} height={300} className="rounded-t-xl max-h-100" alt={eventId + "_im"} />
        </div>
        <div className="flex flex-row items-center justify-between align-middle">
            <div className="px-4 py-1 my-2 flex flex-col space-y-1 justify-center items-center">
                <p className="font-medium text-xl text-center bg-green-100 text-[#212020] rounded-xl w-fit px-2 m-auto">{"₹ " + (priceMeasureType === '1' ? eventPrice : eventPrice * totalMembers)}</p>
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
            <div className="bg-gray-100 text-[#143d0f] flex flex-row rounded-lg py-6 px-4 justify-between items-center align-middle hover:bg-opacity-80 cursor-not-allowed h-fit mr-2">
                <span className="material-icons">verified</span>
            </div>
        </div>
        <hr className="border-gray-300 w-full" />
        <div className="bg-green-100 text-[#0f3d0f] flex flex-row rounded-lg py-2 px-1 justify-between items-center hover:bg-opacity-80 cursor-pointer">
            <span className="material-icons">group</span>
            <p className="text-sm text-green-100 bg-[#0f3d0f] rounded-lg py-1 px-1">Registered</p>

            <p className="text-sm">{totalMembers + (totalMembers === 1 ? " member" : " members")}</p>
        </div>
        <hr className="border-gray-300 w-full" />
        <button onClick={getEventRegistrationReceipt} className="font-sm text-gray-700 underline">View Receipt</button>
    </div>;
}