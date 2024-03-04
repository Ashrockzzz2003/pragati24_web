"use client";

import DialogModal from "@/components/DialogModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import validator from 'validator';
import 'material-icons/iconfont/material-icons.css';
import { REGISTER_URL } from "@/components/constants";
import secureLocalStorage from "react-secure-storage";
import { hashPassword } from "@/components/hashData";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function RegisterScreen() {
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
    const [userRollNumber, setUserRollNumber] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [collegeCity, setCollegeCity] = useState('');
    const [academicYear, setAcademicYear] = useState(0);
    const [degree, setDegree] = useState('');
    const [needAccomodation, setNeedAccomodation] = useState("0");
    const [numberOfDays, setNumberOfDays] = useState("2");
    const [theDay, setTheDay] = useState("0");

    const isValidPassword = (userPassword.length >= 8 && userConfirmPassword.length >= 8 && userPassword === userConfirmPassword);
    const isValidRollNumber = userRollNumber.length > 0;
    const isValidName = validator.isAlpha(userFullName.replace(/\s/g, ''));
    const isValidEmail = validator.isEmail(userEmail);
    const isValidPhone = validator.isMobilePhone(userPhone, 'en-IN');
    const isValidCollegeName = collegeName.length > 0;
    const isValidCollegeCity = collegeCity.length > 0;
    const isValidAcademicYear = validator.isNumeric(academicYear.toString()) && academicYear > 0;
    const isValidDegree = degree.length > 0;
    const isValidNeedAccomodation = (needAccomodation === "0") || (needAccomodation === "1" && numberOfDays === "1" && theDay === "0") || (needAccomodation === "1" && numberOfDays === "1" && theDay === "1") || (needAccomodation === "1" && numberOfDays === "2");

    const [isLoading, setIsLoading] = useState(false);

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!isValidEmail || !isValidPassword || !isValidName || !isValidPhone || !isValidRollNumber) {
            buildDialog('Invalid Email or Password or Name or Mobile Number', 'Please enter a valid EmailID/Password/Name/MobileNumber to continue', 'Okay');
            openModal();
            return;
        }

        if (!isValidCollegeName || !isValidCollegeCity || !isValidAcademicYear || !isValidDegree) {
            buildDialog('Invalid College Name or College City or Academic Year or Degree', 'Please enter valid details to continue', 'Okay');
            openModal();
            return;
        }

        if (!isValidNeedAccomodation) {
            buildDialog('Invalid Accomodation Details', 'Please enter valid accomodation details to continue', 'Okay');
            openModal();
            return;
        }

        if (needAccomodation === "1" && !confirm("Accomodation will be provided only if you register for events. Continue?")) {
            return;
        }

        setIsLoading(true);
        
        try {

            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: userEmail.trim(),
                    userFullName: userFullName.trim(),
                    userPassword: hashPassword(userPassword),
                    userPhone: userPhone.trim(),
                    userRollNumber: userRollNumber.trim(),
                    collegeName: collegeName.trim(),
                    collegeCity: collegeCity.trim(),
                    academicYear: academicYear,
                    degree: degree.trim(),
                    needAccomodation: needAccomodation,
                    numberOfDays: numberOfDays,
                    theDay: theDay
                })
            });

            if (response.status === 200) {
                const data = await response.json();

                secureLocalStorage.clear();

                secureLocalStorage.setItem('pragathi-rt', data["token"]);
                secureLocalStorage.setItem('pragathi-ue', userEmail);

                router.push('/auth/register/verify');

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
            setIsLoading(false);
        }
    }

    useEffect(() => {
        secureLocalStorage.clear();
        setUserEmail('');
        setUserPassword('');
        setUserFullName('');
        setUserPhone('');
        setUserRollNumber('');
        setUserConfirmPassword('');
        setCollegeName('');
        setCollegeCity('');
        setAcademicYear(0);
        setDegree('');
    }, []);

    return <>
        <NavBar />
        <main className="flex flex-1 flex-col justify-center mt-32 md:mt-4">
            <div className="border border-gray-300 rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-gray-50">


                <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                    <div className='flex flex-row justify-center'>
                        <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Register</h1>
                    </div>
                    <hr className='border-gray-300 w-full' />
                </div>

                <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Email ID
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder='Enter your Email ID'
                                    onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidEmail && userEmail ? ' ring-red-500' : isValidEmail && userEmail ? ' ring-green-500' : ' ring-bGray')}
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
                                    onChange={(e) => setUserRollNumber(e.target.value.toString().toUpperCase())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none uppercase" +
                                        (!isValidRollNumber && userRollNumber ? ' ring-red-500' : isValidRollNumber && userRollNumber ? ' ring-green-500' : ' ring-bGray')}
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
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidPhone && userPhone ? ' ring-red-500' : isValidPhone && userPhone ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-black">
                                    Password
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
                                    Enter Password Again
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
                            <label className="block text-md font-medium leading-6 text-black">
                                College Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    autoComplete="name"
                                    placeholder='Enter your college Name'
                                    onChange={(e) => setCollegeName(e.target.value.toString())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidCollegeName && collegeName ? ' ring-red-500' : isValidCollegeName && collegeName ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                College City
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    autoComplete="name"
                                    placeholder='(eg.) Coimbatore'
                                    onChange={(e) => setCollegeCity(e.target.value.toString())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidCollegeCity && collegeCity ? ' ring-red-500' : isValidCollegeCity && collegeCity ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Academic Year
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    autoComplete="name"
                                    placeholder='(eg.) 2 for second year.'
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidAcademicYear && academicYear ? ' ring-red-500' : isValidAcademicYear && academicYear ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Degree
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    autoComplete="name"
                                    placeholder='Enter your degree in college (eg. MBA)'
                                    onChange={(e) => setDegree(e.target.value.toString())}
                                    className={"block text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidDegree && degree ? ' ring-red-500' : isValidDegree && degree ? ' ring-green-500' : ' ring-bGray')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Need Accomodation?
                            </label>
                            <div className="mt-2">
                                {/* Select Input Yes/No */}
                                <select
                                    className="block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"
                                    onChange={(e) => {
                                        if (e.target.value === "0") {
                                            setNumberOfDays("2");
                                            setTheDay("0");
                                        }
                                        setNeedAccomodation(e.target.value);
                                    }}
                                    required
                                >
                                    <option value={"0"}>No</option>
                                    <option value={"1"}>Yes</option>
                                </select>
                            </div>
                        </div>

                        {needAccomodation === "1" ?
                            // No of Days
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Number of Days
                                </label>
                                <div className="mt-2">
                                    {/* Select Input Yes/No */}
                                    <select
                                        className="block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"
                                        onChange={(e) => {
                                            setNumberOfDays(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value={"2"}>2</option>
                                        <option value={"1"}>1</option>
                                    </select>
                                </div>
                            </div>

                            : null}

                        {needAccomodation === "1" && numberOfDays === "1" ?
                            // Day One?
                            [
                                <div key={0}>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Which Day?
                                    </label>
                                    <div className="mt-2">
                                        {/* Select Input Yes/No */}
                                        <select
                                            className="block text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset ring-bGray placeholder:text-gray-400 sm:text-md sm:leading-6 !outline-none"
                                            onChange={(e) => setTheDay(e.target.value)}
                                            required
                                        >
                                            <option value={"0"}>Feb 16th, 2024</option>
                                            <option value={"1"}>Feb 17th, 2024</option>
                                        </select>
                                    </div>
                                </div>
                            ] : null}


                        {needAccomodation === "1" && numberOfDays === "2" ?
                            <div className="bg-gray-100 p-2 rounded-xl">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 16th, 2024</p>
                                <p>Feb 17th, 2024</p>
                            </div> : needAccomodation === "1" && numberOfDays === "1" && theDay === "0" ? <div className="bg-gray-200 p-2 rounded-xl">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 16th, 2024</p>
                            </div> : needAccomodation === "1" && numberOfDays === "1" && theDay === "1" ? <div className="bg-gray-200 p-2 rounded-xl">
                                <p className="text-md font-bold mb-2">Accomodation Info</p>
                                <p>Feb 17th, 2024</p>
                            </div> : null
                        }


                        <p className="mt-10 text-center text-md text-gray-500">
                            {"Already have an account? "}
                            <Link className="font-medium leading-6 text-blue-600 hover:underline" href="/auth/login">Login</Link>
                        </p>

                        <div>
                            {isLoading == false ? (<input
                                value="Register"
                                type="submit"
                                disabled={(!isValidEmail || !isValidPassword || !isValidName || !isValidPhone || !isValidRollNumber || !isValidCollegeName || !isValidCollegeCity || !isValidAcademicYear || !isValidDegree || !isValidNeedAccomodation)}
                                className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />) : (<input
                                    type="submit"
                                    value="Loading..."
                                    disabled={true}
                                    className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"} />)}
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
    </>;
}
