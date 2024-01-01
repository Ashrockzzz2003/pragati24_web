"use client";

import DialogModal from "@/components/DialogModal";
import { useEffect, useState } from "react";
import validator from 'validator';
import 'material-icons/iconfont/material-icons.css';
import { FORGOT_PASSWORD_VERIFY_URL } from "@/components/constants";
import secureLocalStorage from "react-secure-storage";
import { hashPassword } from "@/components/hashData";
import { useRouter } from "next/navigation";

export default function FPVerifyScreen() {
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

    const [registerEmail, setUserEmail] = useState('');
    const [userOtp, setUserOtp] = useState(new Array(6).fill(""));
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');

    const isValidPassword = (userPassword.length >= 8 && userConfirmPassword.length >= 8 && userPassword === userConfirmPassword);
    const isValidOtp = validator.isNumeric(userOtp.join('')) && (userOtp.join('')).length === 6;

    const [buttonState, setButtonState] = useState(true);

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const handleForgotPasswordVerify = async (e) => {
        e.preventDefault();

        if (!isValidPassword || !isValidOtp) {
            buildDialog('Invalid Details', 'Please enter a valid 6-digit OTP or a valid password(At Least Eight Characters).', 'Okay');
            openModal();
            return;
        }

        setButtonState(false);

        try {

            const ft = secureLocalStorage.getItem('pragathi-ft');

            const response = await fetch(FORGOT_PASSWORD_VERIFY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + ft,
                },
                body: JSON.stringify({
                    userOtp: hashPassword(userOtp.join('')),
                    newUserPassword: hashPassword(userPassword),
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                
                secureLocalStorage.clear();

                buildDialog('Password Reset Successful', 'Login to continue!', 'Okay');
                openModal();

                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);

                return;
            } else if (response.status === 400) {
                const data = await response.json();

                buildDialog('Oops', data["ERROR"] ?? "Try Again", 'Okay');
                openModal();
                return;
            } else {
                buildDialog('Error', 'Something went wrong, please try again later', 'Okay');
                openModal();
                return;
            }

        } catch (err) {
            console.log(err);
            buildDialog('Error', 'Something went wrong, please try again later', 'Okay');
            openModal();
        } finally {
            setButtonState(true);
        }
    }

    useEffect(() => {
        setUserEmail(secureLocalStorage.getItem('pragathi-ue'));
        setUserOtp(new Array(6).fill(""));
        setUserPassword('');
        setUserConfirmPassword('');
    }, []);

    return (
        <main className="flex h-screen flex-1 flex-col justify-center">
            <div className="border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50">
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

                <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                    <div className='flex flex-row justify-center'>
                        <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Verify OTP and Reset Password</h1>
                    </div>
                    <hr className='border-gray-300 w-full' />
                </div>

                <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                    <form className="space-y-6" onSubmit={handleForgotPasswordVerify}>
                        {/* OTP input */}
                        <div>
                            <label htmlFor="otp" className="block text-lg font-medium text-gray-700">
                                OTP
                            </label>
                            <p className="mt-1 text-sm text-gray-500">
                                {"Enter the OTP received through email in " + registerEmail}
                            </p>

                            <div className="flex flex-1 space-x-1 mt-4">
                                {/* 6 input boxes */}
                                {userOtp.map((data, index) => {
                                    return (
                                        <input
                                            key={index}
                                            type="text"
                                            name="otp"
                                            id="otp"
                                            maxLength={1}
                                            size={1}
                                            autoComplete="off"
                                            className="w-1/6 px-2 py-4 rounded-xl text-center border border-gray-300 focus:ring-0 text-lg font-semibold"
                                            value={data}
                                            onChange={(e) => {
                                                const otpCopy = [...userOtp];
                                                otpCopy[index] = e.target.value;
                                                setUserOtp(otpCopy);
                                                if (e.target.value.length === 1 && index !== userOtp.length - 1) {
                                                    e.target.nextSibling.focus();
                                                } else if (e.target.value.length === 0 && index !== 0) {
                                                    e.target.previousSibling.focus();
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-black">
                                    New Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder='Enter your Password'
                                    className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userPassword ? ' ring-red-500' : isValidPassword && userPassword ? ' ring-green-500' : ' ring-bGray')}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-black">
                                    Enter New Password Again
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder='Re-Enter your Password'
                                    className={"block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userConfirmPassword ? ' ring-red-500' : isValidPassword && userConfirmPassword ? ' ring-green-500' : ' ring-bGray')}
                                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <input
                                value="Reset Password"
                                type="submit"
                                disabled={(!isValidOtp || !isValidPassword) && buttonState}
                                className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />
                        </div>
                    </form>
                </div>
            </div>

            <DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
            />
        </main>
    );
}