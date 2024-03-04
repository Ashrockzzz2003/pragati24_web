"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import 'material-icons/iconfont/material-icons.css';
import { useEffect } from "react";
import Image from "next/image";
// import Footer from "@/components/Footer";

export default function Home() {

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: 'ease-in-out',
      delay: 100,
    });
  }, []);

  return (
    <>
      <NavBar />
      <main>
        <div className="relative isolate px-6 lg:px-8 flex justify-center items-center m-auto">
          <div
            className="absolute inset-x-0 px-20 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[40deg] bg-gradient-to-tr from-[#a8abce] to-[#a9afde] opacity-10"
            />
          </div>

          <div className="mx-auto max-w-2xl pt-32 overflow-hidden" data-aos="fade-in">
            <div className="flex justify-center text-center">
              <Link href={"https://www.amrita.edu/school/business/coimbatore/about/"} target='_blank'>
                <div className='relative rounded-full px-2 py-2 mt-0 mb-4 md:px-3 md:py-2 md:my-8 text-xs md:text-sm leading-6 text-gray-200 ring-1 ring-gray-300/10 hover:ring-gray-50/20 items-center align-middle flex flex-row'>
                  {"Amrita School of Business, Coimbatore"}
                  <span className="material-icons ml-2">open_in_new</span>
                </div>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-lime-50">
                Pragati 2024
              </h1>
              <p className="text-xs md:text-base leading-8 text-gray-400 mt-1 md:mt-3 mb-4">
                {"Multiple Universes, One Extravaganza."}
              </p>
              <Link href="/event/register" className="text-lg w-fit ml-auto mr-auto font-semibold text-gray-900 items-center align-middle flex flex-row  border border-gray-400 px-2 py-1 rounded-lg bg-gray-100 mb-16">
                <span className="material-icons mr-2">app_registration</span>
                Register for Events
              </Link>
            </div>
            <Image alt="pragathi main" src="/campus.png" className="rounded-xl ml-auto mr-auto" width={720} height={720} />
          </div>
        </div>
      </main >
      {/* <Footer /> */}
    </>
  )
}
