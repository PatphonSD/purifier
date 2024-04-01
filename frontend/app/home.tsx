"use client";
import { DataTypes, useSensorData } from "./useSensorData"; // Import your custom hook
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, Droplet, Info, Power, PowerOff, Thermometer } from "lucide-react";

const modeMean = {
  on: "ทำงาน",
  off: "ปิด",
  auto: "อัตโนมัติ",
};

const aqiAsWord = (value : DataTypes["pm2_5"]) => {
  if (!value) return {
    word : "Don't know",
    classColor : ""
  }
  if(value <= 50) return {
    word : "Good",
    classColor : "bg-lime-300"
  }
  if (value <= 100) return {
    word : "Warning",
    classColor : "bg-yellow-300"
  }
  if (value <= 200) return {
    word : "Danger",
    classColor : "bg-red-300"
  }
  if (value >= 201) return {
    word : "Dead",
    classColor : "bg-violet-300"
  }
}

const Home = ({ latestState }: { latestState: string }) => {
  const { isConnected, data, triggerState, state } = useSensorData(latestState); // Get data from hook
  const { pm1, pm2_5, pm10, temperature, humidity } = data;
  return (
    <div className={cn("w-full transition-all duration-1000 border-0 p-4 gap-6 flex flex-col justify-between h-full" , aqiAsWord(pm2_5)?.classColor)}>
      <div className="space-y-4">
        <div className="flex flex-row items-center">
          <div className="grid gap-1.5">
            <CardTitle>Smart Purifier</CardTitle>
            <CardDescription>Taelsiriwittaya School</CardDescription>
          </div>
          <Button className="ml-auto shrink-0 rounded-full" size="icon" variant="outline">
            <Info />
          </Button>
        </div>
        <div className="flex h-auto justify-between flex-col gap-6">
          <div className="space-y-6">
            <div>
              <p className="text-xl text-primary/75">PM2.5 is {pm2_5} ug/m3</p>
              <p className="text-8xl font-medium text-primary/90">{aqiAsWord(pm2_5)?.word}</p>
            </div>
            <div className="flex flex-row w-full justify-around bg-primary-foreground/75 rounded-3xl py-6 gap-4">
              <div className="flex flex-col justify-between items-center gap-1.5">
                <Thermometer className="text-green-500" />
                <h3 className="text-4xl font-medium tracking-tighter">
                  {temperature?.toFixed(0) || "0"}
                </h3>
                <p className="text-sm font-medium tracking-wide shrink-0">°C</p>
              </div>
              <div className="flex flex-col justify-between items-center gap-1.5">
                <Droplet className="text-green-500" />
                <h3 className="text-4xl font-medium tracking-tighter">
                  {humidity?.toFixed(0)}
                </h3>
                <p className="text-sm font-medium tracking-wide shrink-0">%</p>
              </div>
            </div>
            <div className="flex flex-row w-full justify-evenly bg-primary-foreground/75 rounded-3xl py-6 gap-4">
              <div className="flex flex-col justify-between items-center gap-1.5">
                <p>PM1</p>
                <h3 className="text-4xl font-medium tracking-tighter">
                  {pm1?.toFixed(0) || "0"}
                </h3>
                <p className="text-sm font-medium tracking-wide shrink-0">
                  ug/m3
                </p>
              </div>
              <div className="flex flex-col justify-between items-center gap-1.5">
                <p>PM2.5</p>
                <h3 className="text-4xl font-medium tracking-tighter">
                  {pm2_5?.toFixed(0)}
                </h3>
                <p className="text-sm font-medium tracking-wide shrink-0">
                  ug/m3
                </p>
              </div>
              <div className="flex flex-col justify-between items-center gap-1.5">
                <p>PM10</p>
                <h3 className="text-4xl font-medium tracking-tighter">
                  {pm10?.toFixed(0)}
                </h3>
                <p className="text-sm font-medium tracking-wide shrink-0">
                  ug/m3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/95 text-white flex gap-6 justify-between p-2 rounded-full">
        <div
          onClick={() => triggerState("on")}
          className={cn(
            "p-4 transition-all rounded-full w-full flex justify-center",
            state == "on" ? "bg-lime-500 w-auto" : "bg-muted-foreground/20 w-full"
          )}
        >
          <Power />
        </div>

        <div
          onClick={() => triggerState("auto")}
          className={cn(
            "p-4 transition-all rounded-full w-full flex justify-center",
            state == "auto"
              ? "bg-blue-500 w-auto"
              : "bg-muted-foreground/20 w-full"
          )}
        >
          <Bot />
        </div>
        <div
          onClick={() => triggerState("off")}
          className={cn(
            "p-4 transition-all rounded-full flex justify-center",
            state == "off"
              ? "bg-red-500 w-auto"
              : "bg-muted-foreground/20 w-full"
          )}
        >
          <PowerOff />
        </div>
      </div>
    </div>
  );
};

export default Home;

function ChevronDownIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronUpIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function PowerIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" x2="12" y1="2" y2="12" />
    </svg>
  );
}
