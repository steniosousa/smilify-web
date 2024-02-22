interface appointmentProps {
    date: any,
    customer: {
        name: string,
        id: string
    },
    queue: string,
}
export function CardDetailsPatientAndStatus({ appointment }: { appointment: appointmentProps }) {
    function formatDate(){
        let dateStart = `${new Date(appointment.date).getHours()}:${new Date(appointment.date).getMinutes()} hs`
        return dateStart
    }
    return (
        <div>
            <div className="flex flex-row items-center gap-4">
                <p className="text-sm">Paciente:</p>
                <h1 className="dark:text-white text-black text-sm"> {appointment.customer ? appointment.customer.name.toUpperCase().substring(0,7) : "Smilify"}</h1>
            </div>
            <div className="flex flex-row items-center gap-4 ">
                <p className="text-sm">Horário:</p>
                <h1 className="dark:text-white text-black text-sm min-w-full "> {appointment.date ? formatDate() : "Smilify"}</h1>
            </div>

        </div>
    )
}