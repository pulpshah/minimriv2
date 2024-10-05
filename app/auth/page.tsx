"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { db } from "@/firebaseConfig";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleInputFocus = () => setDrawerOpen(true);
  const handleInputBlur = () => setDrawerOpen(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "emails"), {
        email: email,
        timestamp: Timestamp.now(),
      });
      console.log("Email saved with ID: ", docRef.id);
      setEmail("");
      router.push("/showcase");
    } catch (e) {
      setError("Error saving email. Please try again.");
      console.error("Error adding email: ", e);
    }
  };

  return (
    <div className="screen-container h-full min-h[100svh] bg-[url('/bg/startingBg.webp')] bg-cover bg-center">
      <div className="drawer-screen lg:justify-center h-full gap-[12px]">
        <div className="pulp box flex-col gap-[10px] pb-[7px]">
          <div className="logo-container">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={41}
              className="block mx-auto invert"
            />
          </div>
          <div className="text text-white text-[20px] text-center">
            breaking it down
          </div>
        </div>
        <form
          className={`box drawer transition-all lg:h-fit lg:py-[40px] lg:w-[420px] lg:rounded-[20px] flex-col rounded-t-[40px] px-[20px] pb-[20px] pt-[30px] duration-200 gap-[20px] ${
            drawerOpen ? "h-3/4" : "h-[195px]"
          }`}
        >
          <div className="auth-text">enter your email</div>
          <input
            onFocus={handleInputFocus}
            onChange={handleEmailChange}
            type="email"
            value={email}
            className="input text-white black-opaque transition-all p-5 focus:outline-none focus:ring-2 focus:ring-white text-xl"
          />
          <div
            className={`disclaimer lg:!flex transition-all poppins-regular ${
              drawerOpen ? "!flex" : "!hidden"
            }`}
          >
            by entering you agree to receive emails from us.
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`!text-black enter lg:!flex box starting-button white-opaque starting-text hover:scale-105 transition-all ${
              drawerOpen ? "!flex" : "!hidden"
            }`}
          >
            enter
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
