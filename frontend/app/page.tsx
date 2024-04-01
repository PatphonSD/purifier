import Home from "./home";

export default async function RootPage() {
  const latestState = await (await fetch("http://192.168.1.38:3002" ,{cache : "no-store"})).text();
  return (
    <>
      <Home latestState={latestState} />
    </>
  );
}
