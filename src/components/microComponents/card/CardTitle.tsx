export function CardTitle({ title }: { title: string }) {
    return (
        <div className="px-4 sm:px-0 mb-4 text-center">
            <h3 className="text-base border-b   font-semibold leading-7 text-gray-900">{title}</h3>
        </div>
    )
}