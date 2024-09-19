"use client";

import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '@/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [step, setStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        }
        else {
            router.push("/home");
        }
    }

    const steps = [
        {title: "Scoring Debate", content: "P. DIDDLER"},
        {title: "References", content: "JATT"},
        {title: "Analytics", content: "GYAAAAT"},
    ];

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
                            className="block mx-auto"
                        />
                    </div>
                    <div className="text text-white text-[20px] text-center">
                        breaking it down
                    </div>
                </div>
                <div className="box 
                drawer transition-all
                lg:p-[30px] lg:w-[830px] h-3/4 lg:h-[643px] lg:rounded-[40px] flex-col 
                rounded-t-[40px] 
                px-[20px] pb-[45px] 
                pt-[30px] gap-[20px]">
                    <div className='rounded-[40px] opacity-80 black-opaque w-full h-full px-[30px] py-7 flex justify-start items-center text-white flex-col'>
                        <div className="card-text transition-all">
                            {steps[step].title}
                        </div>
                        <div className="content transition-all h-full w-full">
                            {steps[step].content}
                        </div>
                    </div>
                    <button
                    onClick={handleNext}
                    type="submit"
                    className="enter box starting-button !text-black white-opaque starting-text hover:scale-105 transition-all"
                    >
                        {step < 2 ? 'next' : 'finish'}
                    </button>
                </div>
            </div>
        </div>
    );
}
