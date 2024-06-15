import { FC } from "react";
import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type LoaderProps = {
  className?: string;
};

const Loader: FC<LoaderProps> = ({ className }) => (
  <AiOutlineLoading3Quarters className={cn("animate-spin", className)} />
);

Loader.displayName = "Loader";
export { Loader };
