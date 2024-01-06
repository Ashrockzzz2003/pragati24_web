import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function Home() {

  return (
    <>
      <NavBar />
      <main className="h-[87vh]">
        <h1 className="mb-6 pt-8 text-2xl text-lime-50 text-center">Pragati 2024</h1>
        <div className="flex flex-col bg-gray-50 bg-opacity-70 rounded-xl p-4 w-fit ml-auto mr-auto my-4">
          <p className="text-sm font-medium text-gray-700 max-w-[256px] text-center">{"Note: The brochure is loading. Please wait a few seconds!"}</p>
        </div>
        <iframe className="w-[90%] h-[78%] m-auto rounded-2xl overflow-visible" src="https://drive.google.com/file/d/1SANYrGrQqfs7WAOUIKKjMOZmOyVD1vSM/preview" allow="autoplay"></iframe>
      </main>
      <Footer />
    </>
  )
}
