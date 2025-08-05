"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [inputTXT, setInputTXT] = useState({
    iccid: "",
    password: "",
  });
  const [debouncedValue, setDebouncedValue] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputTXT({ ...inputTXT, [name]: value });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputTXT);
    }, 600);

    return () => clearTimeout(timeout);
  }, [inputTXT]);

  useEffect(() => {
    if (debouncedValue) {
      console.log("Input TXT:", debouncedValue);
    }
  }, [debouncedValue]);

  const handleGO = (e) => {
    e.preventDefault();
    router.push(`/show-data?iccid=${debouncedValue.iccid}&password=${debouncedValue.password}`);
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form onSubmit={handleGO} className="w-full md:w-[400px] flex flex-col gap-4 mx-[20%]">
        <input
          type="text"
          name="iccid"
          value={inputTXT.iccid}
          onChange={handleChange}
          placeholder="Enter ICCID"
          className="border-1 border-blue-400 px-4 rounded-full py-2 md:py-4 text-sm"
        />
        <input
          type="text"
          name="password"
          value={inputTXT.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="border-1 border-blue-400 px-4 rounded-full py-2 md:py-4 text-sm"
        />
        <button type="submit" className="bg-blue-400 self-center-safe rounded-full text-[14px] md:text-[18px] tracking-wider px-6 py-2 md:py-3 cursor-pointer outline-none focus-within:border-red-800 transition-colors duration-200 ">
          Go
        </button>
      </form>
    </div>
  );
};

export default Login;
