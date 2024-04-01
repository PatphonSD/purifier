"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const socketUrl = window.location.hostname
const socket = io(socketUrl + ":3250");

type State = "on" | "off" | "auto";

export type DataTypes = {
  pm1: number | undefined;
  pm2_5: number | undefined;
  pm10: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
};

export function useSensorData(initialState: string) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [_data, setData] = useState<any>({
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
    temperatute: 0,
    humidity: 0,
  });
  const [_state, setState] = useState<State | any>(initialState);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onDataEvent(value: Socket) {
      setData(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("data", onDataEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("data", onDataEvent);
    };
  }, []);
  const triggerStateHandler = (keyword: "off" | "on" | "auto") => {
    setState(keyword);
    socket.emit("state", keyword);
  };

  const state = _state as State;
  const data = _data as DataTypes;

  return {
    isConnected,
    data,
    triggerState: triggerStateHandler,
    state,
    setState,
  };
}
