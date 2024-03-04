"use client";
import { VERIFY_TRANSACTIONS_URL } from '@/components/constants';
import 'material-icons/iconfont/material-icons.css';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentSuccess() {

    const { txnid } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetch(VERIFY_TRANSACTIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ txnid })
        }).then(res => {
            if (res.status === 200) {
                setTimeout(() => {
                    router.push("/event/register/success");
                }, 4000);
            } else if (res.status === 201) {
                setTimeout(() => {
                    router.push("/event/register/failure");
                }, 4000);
            } else {
                setTimeout(() => {
                    router.push("/event/register/pending");
                }, 4000);
            }
        }).catch(err => {
            console.log(err);
            router.push('/event/register/pending')
        });
    }, [router, txnid]);

    return (<div className="flex flex-col justify-center items-center bg-[#04002a] h-screen">
        <div className="text-[#04002a] items-center justify-center bg-white rounded-3xl px-8 py-8">
            <div className="border border-orange-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                <div className="animate-pulse flex space-x-4">
                    <i className="material-icons text-green-700 animate-pulse" style={{ "fontSize": "64px" }}>currency_rupee</i>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-orange-300 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-orange-300 rounded col-span-2"></div>
                                <div className="h-2 bg-orange-300 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-orange-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="mt-8 text-center justify-center text-2xl fonr-bold">Hold On while we verify your payment.</h1>
            <p className="text-gray-700 text-sm text-center">Your transaction id is <span className="font-bold">{txnid}</span></p>
            <p className="text-gray-700 text-sm text-center">Please do not close this page or go back.</p>
        </div>
    </div>);
}