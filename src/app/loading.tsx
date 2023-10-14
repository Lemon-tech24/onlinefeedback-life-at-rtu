import { VscLoading } from "react-icons/vsc";
export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-2xl">
      <div className="text-5xl text-blue-800 animate-spin">
        <VscLoading />
      </div>
      <div>Loading</div>
    </div>
  );
}
