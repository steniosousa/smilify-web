export function CardLine({ name, email }: { name: string, email: string }) {
    return (
        <div className="flex min-w-0 gap-x-4 mb-2">
            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{email}</p>
            </div>
        </div>
    )
}