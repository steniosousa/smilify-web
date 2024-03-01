export function CardValueCenter({ value }: { value: number }) {
    return (
        <div className="w-full h-full  flex justify-center ">
            <h1 className="text-5xl mt-4 dark:text-white  ">{value}</h1>
        </div>
    )
}