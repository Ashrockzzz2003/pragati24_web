"use client";

import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const viewer = useRef(null);
  const [vw, setVW] = useState();

  useEffect(() => {
    console.log("loading pdftron");
    if (vw) return;
    import('@pdftron/webviewer').then(() => {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: "/files/Pragati'24_brochure.pdf",
          enableAnnotations: false,
          enableOptimizedWorkers: true,
        },
        viewer.current,
      ).then((instance) => {
        const { docViewer } = instance;
        setVW(instance);
      });
    });
  }, [vw]);

  return (
    <>
      <NavBar />
      <main className="h-[87vh]">
        <h1 className="mb-6 pt-8 text-4xl text-lime-50 text-center">Pragati 2024</h1>
        <div className="w-[90%] h-[78%] m-auto rounded-2xl overflow-visible viewer" ref={viewer}></div>
        {/* <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
          <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Note: The brochure is loading. Please wait a few seconds!"}</p>
        </div> */}
        {/* <iframe className="w-[90%] h-[78%] m-auto rounded-2xl overflow-visible" src="https://drive.google.com/file/d/1SANYrGrQqfs7WAOUIKKjMOZmOyVD1vSM/preview" allow="autoplay"></iframe> */}
      </main>
      {/* <Footer /> */}
    </>
  )
}
