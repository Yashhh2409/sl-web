"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();
  const iccid = params.get("iccid");
  const password = params.get("password");

  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/recent-image?iccid=${iccid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${btoa(`${iccid}:${password}`)}`,
            },
          }
        );

        const data = await res.json();
        // console.log("API Response:", data);

        if (res.ok && data?.imageUrl) {
          setImageURL((prev) => {
            // Only update if image changed
            if (prev !== data.imageUrl) return data.imageUrl;
            return prev;
          });
          setError(null);
        } else {
          setError(data?.error || "Image not found or invalid response.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch image.");
      }
    };

    if (iccid && password) {
      fetchImage(); // initial fetch
      intervalId = setInterval(fetchImage, 5000); // re-fetch every 5s
    }

    return () => {
      clearInterval(intervalId); // cleanup on unmount
    };
  }, [iccid, password]);

  const handleEvent = async (eventType) => {
     console.log("Triggered event:", eventType); 
  if (!iccid) {
    console.error("ICCID is missing.");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: eventType, iccid }),
    });

    if (!res.ok) {
      console.error("Server error:", res.status, await res.text());
      return;
    }

    const result = await res.json();
    console.log("Event log response:", result);
  } catch (error) {
    console.error("Failed to send event:", error);
  }
};


  // console.log("img url:", imageURL);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-4 p-5">
        {/* Image Section */}
        <div className="w-[50%] flex items-center justify-center">
          <div className="px-4 py-1 rounded-md text-blue-400">
            <h2 className="text-center mb-2">
              <span className="font-bold tracking-wide">Recent Image for ICCID:</span> {iccid}
            </h2>
            <div className="w-[300px] md:w-[300px] h-[250px] md:h-[300px]">
              {imageURL ? (
                <Image
                  src={imageURL}
                  width={400}
                  height={400}
                  alt="img"
                  className="w-full h-full object-contain"
                />
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <p className="text-center">Loading Image...</p>
              )}
              <h1 className="text-center mt-4">Visitor's Image</h1>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-[50%] flex flex-col gap-4 items-center justify-center">
          <div className="w-[100px] h-[100px] px-4 py-1 rounded-md text-blue-400">
            <Image
              src={"/lock-svgrepo-com.svg"}
              width={100}
              height={100}
              alt="lock"
              className="w-full h-full"
            />
          </div>
          <button
            onClick={() => handleEvent("KEY_RELEASE_BTN_CLICKED")}
            className="w-[250px] border-2 border-blue-400 px-4 py-1 rounded-full text-blue-400 cursor-pointer hover:text-blue-700 hover:border-blue-600 transition-colors duration-200"
          >
            Release Key
          </button>
          <button
            onClick={() => handleEvent("SHACKLE_RELEASE_BTN_CLICKED")}
            className="w-[250px] border-2 border-blue-400 px-4 py-1 rounded-full text-blue-400 cursor-pointer hover:text-blue-700 hover:border-blue-600 transition-colors duration-200"
          >
            Release Shackle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
