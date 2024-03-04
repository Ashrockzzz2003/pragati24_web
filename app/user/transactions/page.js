"use client";

import DialogModal from "@/components/DialogModal";
import NavBar from "@/components/NavBar";
import { USER_TRANSACTIONS_URL } from "@/components/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Link from "next/link";


export default function TransactionsScreen() {
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

    const [transactionData, setTransactionData] = useState([]);

    useEffect(() => {
        fetch(USER_TRANSACTIONS_URL, {
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
                const tData = data["data"];
                setTransactionData(tData);
            })
            .catch(err => {
                console.log(err);
                buildDialog('Session Expired', 'Please login again!', 'OK');
                openModal();
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            })
    }, [router]);


    return <>
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

            <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto mt-4">
                <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Click on Verify Now to verify your transactions if the option is shown."}</p>
            </div>

            <h1 className="mb-8 pt-8 text-2xl text-lime-50 text-center">My Transactions</h1>
            {transactionData.length !== 0 ? (
                <table className="max-w-9/12 ml-auto mr-auto my-4 rounded-2xl backdrop-blur-2xl bg-opacity-30 text-center text-md border-black border-separate border-spacing-0 border-solid">
                    <thead className="border-0 text-lg font-medium">
                        <tr className="bg-black text-white bg-opacity-90 backdrop-blur-xl">
                            <th className="px-2 py-1 rounded-tl-2xl border-black">Transaction ID</th>
                            <th className="px-2 py-1 border-b-black">Date</th>
                            <th className="px-2 py-1 border-b-black">Amount</th>
                            <th className="px-2 py-1 border-b-black rounded-tr-2xl">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionData.map((transaction, index) => (
                            <tr key={index} className="bg-white">
                                <td className={"border border-gray-200 px-2 py-2" + (index === transactionData.length - 1 ? "border-separate rounded-bl-2xl" : "")}>{transaction.txnid}</td>
                                <td className="border border-gray-200 px-2 py-2"><div>
                                    <p className="text-center">{new Date(transaction.createdAt).toDateString()}</p>
                                    <p className="text-xs text-gray-500 text-center">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                                </div></td>
                                <td className="border border-gray-200 px-2 py-2">{"₹ " + transaction.amount + " /-"}</td>
                                <td className={"border border-gray-200 px-2 py-2" + (index === transactionData.length - 1 ? "border-separate rounded-br-2xl" : "")}>
                                    {transaction.transactionStatus === '1' ? (
                                        <span className="text-[#153b13] bg-[#8bff85] p-2 rounded-xl my-4">Success</span>
                                    ) : transaction.transactionStatus === '2' ? (
                                        <span className="text-[#3c1414] bg-[#ffcbcb] p-2 rounded-xl my-4">Failed</span>
                                    ) : (
                                        <Link href={`/event/register/verify/${transaction.txnid}`}><span className="text-[#383812] bg-[#fdff85] p-2 rounded-xl my-4">Verify Now</span></Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className='mx-auto'>
                    <p className="p-8 text-center text-lime-100"> ... </p>
                </div>
            )}
        </main>

        <DialogModal
            isOpen={isOpen}
            closeModal={closeModal}
            title={title}
            message={message}
            buttonLabel={buttonLabel}
        />
    </>
}