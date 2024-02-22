import { ReactNode } from "react";

interface IconProps {
    icon: ReactNode
}

export function CardIcon({ icon }: { icon: IconProps }) {
    return (
        <div className="flex h-11.5 w-11.5 items-center justify-center  ">
            <img src={`${icon}`} alt="Descrição da imagem" />
        </div>

    )
}