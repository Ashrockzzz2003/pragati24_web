"use client";

import DialogModal from "@/components/DialogModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import validator from 'validator';
import 'material-icons/iconfont/material-icons.css';
import { EDIT_PROFILE_URL } from "@/components/constants";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function EditProfileScreen() {
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

    const [userEmail, setUserEmail] = useState('');
    const [userFullName, setUserFullName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userRollNumber, setUserRollNumber] = useState('');

    const isValidName = validator.isAlpha(userFullName.replace(/\s/g, ''));
    const isValidPhone = validator.isMobilePhone(userPhone, 'en-IN');

    const [buttonState, setButtonState] = useState(true);

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    useEffect(() => {
        if (!secureLocalStorage.getItem('pragathi-ue') || !secureLocalStorage.getItem('pragathi-fn') || !secureLocalStorage.getItem('pragathi-ph')) {
            buildDialog('Session Expired', 'Please login again', 'Okay');
            openModal();
            router.push('/auth/login');
            return;
        }

        setUserEmail(secureLocalStorage.getItem('pragathi-ue'));
        setUserFullName(secureLocalStorage.getItem('pragathi-fn'));
        setUserPhone(secureLocalStorage.getItem('pragathi-ph'));
        setUserRollNumber(secureLocalStorage.getItem('pragathi-urn'));
    }, [router]);

    const handleEditProfile = async (e) => {
        e.preventDefault();

        if (!isValidName || !isValidPhone || !isValidRollNumber) {
            buildDialog('Invalid Name or Mobile Number', 'Please enter a valid Name/MobileNumber to continue', 'Okay');
            openModal();
            return;
        }

        setButtonState(false);

        try {

            const response = await fetch(EDIT_PROFILE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secureLocalStorage.getItem('pragathi-t')}`
                },
                body: JSON.stringify({
                    userFullName: userFullName,
                    userPhone: userPhone,
                    userRollNumber: userRollNumber
                })
            });

            if (response.status === 200) {
                const data = await response.json();

                secureLocalStorage.setItem('pragathi-fn', userFullName);
                secureLocalStorage.setItem('pragathi-ph', userPhone);

                router.push('/user');

                return;
            } else if (response.status === 400) {
                const data = await response.json();

                buildDialog('Invalid Details', data["ERROR"] ?? "Try Again", 'Okay');
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

    return (
        <>
        <NavBar />
        <main className="flex h-[90vh] flex-1 flex-col justify-center">
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
                        <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Edit Profile</h1>
                    </div>
                    <hr className='border-gray-300 w-full' />
                </div>

                <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                    <form className="space-y-6" onSubmit={handleEditProfile}>
                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Email ID
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    disabled
                                    defaultValue={userEmail}
                                    placeholder='Enter your Email ID'
                                    onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 shadow-sm ring-1 ring-inset ring-bGray text-gray-400 italic sm:text-md sm:leading-6 !outline-none"}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Roll Number
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    autoComplete="rollno"
                                    defaultValue={userRollNumber}
                                    disabled
                                    className={"block text-lg w-full rounded-md py-2 px-2 shadow-sm ring-1 ring-inset ring-bGray text-gray-400 italic sm:text-md sm:leading-6 !outline-none"}                                    
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    autoComplete="name"
                                    placeholder='Enter your full name'
                                    defaultValue={userFullName}
                                    onChange={(e) => setUserFullName(e.target.value.toString())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidName && userFullName ? ' ring-red-500' : isValidName && userFullName ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Mobile Number
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    autoComplete="name"
                                    placeholder='Enter your Mobile Number'
                                    defaultValue={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidPhone && userPhone ? ' ring-red-500' : isValidPhone && userPhone ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <input
                                value="Update my Profile"
                                type="submit"
                                disabled={(!isValidName || !isValidPhone) && buttonState}
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
        </>
    );
}