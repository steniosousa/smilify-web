interface appointmentProps {
    service: {
        name: string,
        cost: string,
        id: string
    },

}
export function CardServiceAndValue({ appointment }: { appointment: appointmentProps }) {
    return (
        <div className="mt-4 flex items-end justify-between">
            <div>
                <p className=" font-bold text-black dark:text-white text-sm">
                    {appointment.service ? appointment.service.name : "Sem serviço"}
                </p>
                <span className="text-sm font-medium">R$ {appointment.service ? appointment.service.cost : "00"}</span>
            </div>
        </div>
    )
}