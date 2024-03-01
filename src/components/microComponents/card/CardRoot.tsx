import { ReactNode } from "react";

interface RootProps {
    children: ReactNode
}

export function CardRoot({ children }: RootProps) {
    return (
        <div className="rounded-t-lg border border-stroke  bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            {children}
        </div>
    );
}