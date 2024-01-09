"use client";

import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';

export default function PaymentPending() {
    return (<div className="flex flex-col justify-center items-center bg-[#04002a] h-screen">
        <div className="text-[#04002a] items-center justify-center bg-white rounded-3xl px-8 py-8">
            <>
                <div className="flex items-center justify-center">
                    <i className="material-icons text-orange-500" style={{ "fontSize": "128px" }}>info</i>
                </div>
                <h1 className="mt-8 text-center justify-center text-4xl fonr-bold mb-4">Payment Pending</h1>
                <p className="text-gray-700 text-sm text-center">Please allow us up to 5 minutes to receive confirmation of your payment.</p>
                <p className="text-gray-700 text-sm text-center">You can check the status in the transactions page under your profile.</p>
            </>

            <Link href={"/"} className="flex justify-center">
                <button
                    className="rounded-2xl px-2 py-3"
                    style={{ backgroundColor: "#00223a", color: "white", marginTop: "1rem" }}>
                    Back to Home
                </button>
            </Link>
        </div>
    </div>);
}