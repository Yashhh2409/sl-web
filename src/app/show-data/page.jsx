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
    const fetchImage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/recent-image?iccid=${iccid}`, {
          method: "GET",
          headers: {
           Authorization: `Basic ${btoa(`${iccid}:${password}`)}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data); // Debugging

        if (res.ok && data?.imageUrl) {
          setImageURL(data.imageUrl);
        } else {
          setError(data?.error || "Image not found or invalid response.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch image.");
      }
    };

    if (iccid && password) {
      fetchImage();
    }
  }, [iccid, password]);
  console.log("img url:", imageURL);
  

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-4 p-5">
        {/* Image Section */}
        <div className="w-[50%] flex items-center justify-center">
          <div className="border-2 border-blue-400 px-4 py-1 rounded-md text-blue-400">
            <h2 className="text-center mb-2">Recent Image for ICCID: {iccid}</h2>
            <div className="w-[200px] md:w-[300px] h-[120px] md:h-[300px]">
              {imageURL ? (
                <Image
                  src={imageURL}
                  width={400}
                  height={400}
                  alt="img"
                  className="w-full h-full object-fill"
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
          <button className="w-[250px] border-2 border-blue-400 px-4 py-1 rounded-full text-blue-400 cursor-pointer">
            Release Key
          </button>
          <button className="w-[250px] border-2 border-blue-400 px-4 py-1 rounded-full text-blue-400 cursor-pointer">
            Release Shackle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
