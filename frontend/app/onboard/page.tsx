import { Loader } from "@/components/common/loader";

export default function OnboardPage() {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="flex items-center space-x-2">
        <span>Loading your emails</span>
        <Loader />
      </div>
    </main>
  );
}
