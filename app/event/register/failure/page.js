"use client";

import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';

export default function PaymentFailure() {
    return (
        <div className="flex flex-col justify-center items-center bg-[#04002a] h-screen">
            <div className="text-[#04002a] items-center justify-center bg-white rounded-3xl px-32 py-24">
                <>
                    <div className="flex items-center justify-center">
                        <i className="material-icons text-red-500" style={{"fontSize": "128px"}}>cancel</i>
                    </div>
                    <h2 className="mt-8 text-center justify-center">Payment Failed</h2>
                    <p className="text-gray-700 text-sm">Please try again later.</p>
                </>

                <Link href={"/"} className="flex justify-center">
                    <button
                        className="rounded-2xl px-2 py-3"
                        style={{ backgroundColor: "#00223a", color: "white", marginTop: "1rem" }}>
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
}