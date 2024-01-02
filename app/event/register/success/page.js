import Link from "next/link";
import 'material-icons/iconfont/material-icons.css';

export default function PaymentSuccess() {
    return (<div className="flex flex-col justify-center items-center bg-[#04002a] h-screen">
        <div className="text-[#04002a] items-center justify-center bg-white rounded-3xl px-32 py-24">
            <>
                <div className="flex items-center justify-center">
                    <i className="material-icons text-green-500" style={{"fontSize": "128px"}}>verified</i>
                </div>
                <h1 className="mt-8 text-center justify-center text-4xl fonr-bold">Payment Successful!</h1>
                <p className="text-gray-700 text-sm">Please allow up to 15 minutes to receive confirmation of your payment! </p>
            </>

            <Link href={"/"} className="flex justify-center">
                <button
                    className="rounded px-6 py-4"
                    style={{ backgroundColor: "#00223a", color: "white", marginTop: "1rem" }}>
                    Back to Home
                </button>
            </Link>
        </div>
    </div>);
}