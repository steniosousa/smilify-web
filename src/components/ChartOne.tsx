import 'react-day-picker/dist/style.css';
import { useEffect, useState } from 'react';
import photo from '../images/icon/icon.png'
interface AppointmentProps {
  id: string,
  date: Date,
  customer: {
    name: string,
    id: string,
    email: string,
    photo: string
  },
  service: {
    name: string,
    cost: string,
    id: string
  },
  queue: string,
  status: string
}
interface EventsProps {
  name: string;
  start: Date;
  photo?: string,
  end: Date,
  email: string,
  serviceName: string,
  serviceCost: string
}
export default function ChartOne({ AppointmentsQueue }: { AppointmentsQueue: AppointmentProps[] }) {
  const [events, setEvents] = useState<EventsProps[]>([])

  useEffect(() => {
    const eventsArr: EventsProps[] = AppointmentsQueue.map((item) => {
      const dataOriginal = new Date(item.date);
      const data30MinDepois = new Date(dataOriginal);
      const after30min = new Date(data30MinDepois.setMinutes(data30MinDepois.getMinutes() + 30));
      return { name: item.customer.name, start: new Date(item.date), end: after30min, email: item.customer.email, serviceName: item.service.name, serviceCost: item.service.cost }
    })
    setEvents(eventsArr)
  }, [AppointmentsQueue])

  return (
    <div className=" col-span-12 rounded-sm border border-stroke shadow-default dark:border-strokedark  xl:col-span-8">
      <div className='ml-8 items-center flex flex-col'>
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-grey mt-4">AGENDA</h2>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
          {events.map((item: any) => {
            const dayInFrom = new Date(item.start).getDate()
            const monthInFrom = new Date(item.start).getMonth()
            const yearInFrom = new Date(item.start).getFullYear()
            const from = `${dayInFrom}/${monthInFrom}/${yearInFrom}`

            const dayInTo = new Date(item.end).getDate()
            const monthInTo = new Date(item.end).getMonth()
            const yearInTo = new Date(item.end).getFullYear()
            const to = `${dayInTo}/${monthInTo}/${yearInTo}`
            return (
              <li key={item.id} className='pb-3 sm:pb-4 border-b  m-4' >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={photo} alt="imagem perfil" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {item.name} - {from} à {to}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {item.email}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      ${item.serviceCost}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {item.serviceName}
                    </p>
                  </div>
                </div>

              </li>
            )
          })}
        </ul>

      </div>
    </div>
  );
};
