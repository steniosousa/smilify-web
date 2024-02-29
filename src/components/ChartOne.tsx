import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import moment from 'moment';
import { useEffect, useState } from 'react';
interface AppointmentProps {
  id: string,
  date: Date,
  customer: {
    name: string,
    id: string
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
  title: string;
  start: Date;
  end: Date
}
export default function ChartOne({ AppointmentsQueue }: { AppointmentsQueue: AppointmentProps[] }) {
  const [events, setEvents] = useState<EventsProps[]>([])
  const localizer = dayjsLocalizer(dayjs)
  var defaultMessages = {
    date: "Data",
    time: "Horário",
    event: "Paciente",
    allDay: "Dia Todo",
    week: "Semana",
    work_week: "Eventos",
    day: "Dia",
    month: "Mês",
    previous: "Anterior",
    next: "Próximo",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    today: "Hoje",
    agenda: "Agenda",
    noEventsInRange: "Não há eventos no período.",
    showMore: function showMore(total: any) {
      return "+" + total + " mais";
    }
  };
  const dayStyleGetter = (date: Date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = moment(date).isSame(new Date(), 'day');
    const holidays = [new Date(2024, 0, 1), new Date(2024, 4, 1)];

    let style = {};
    if (isWeekend) {
      style = { backgroundColor: 'black' };
    }
    if (holidays.some((holiday) => moment(holiday).isSame(date, 'day'))) {
      style = { backgroundColor: 'black' };
    }
    if (isToday) {
      style = { backgroundColor: '#3C50E0', color: 'white' };
    }
    return {
      style,
    };
  };

  useEffect(() => {
    const eventsArr: EventsProps[] = AppointmentsQueue.map((item) => {
      const dataOriginal = new Date(item.date);
      const data30MinDepois = new Date(dataOriginal);
      const after30min = new Date(data30MinDepois.setMinutes(data30MinDepois.getMinutes() + 30));
      return { title: item.customer.name, start: new Date(item.date), end: after30min }
    })
    setEvents(eventsArr)
  }, [AppointmentsQueue])
  function formatarData(label: any) {
    const data = new Date(label.label)
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const dia = data.getDate();
    const mes = meses[data.getMonth()];

    return `${dia} / ${mes} `;
  }

  function formatarHora(label: any) {
    const data = new Date(label.event.start)

    const hora = data.getHours();
    const minuto = data.getMinutes();
    const segundo = data.getSeconds();

    return `${hora}:${minuto}:${segundo} `;
  }




  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <Calendar
        dayPropGetter={dayStyleGetter}
        localizer={localizer}
        messages={defaultMessages}
        startAccessor="start"
        endAccessor="end"
        defaultView='agenda'
        views={['agenda']}
        components={{ agenda: { date: formatarData, time: formatarHora } }}
        className='bg-white dark:bg-black text-black dark:text-white text-center justify-center flex p-2 '
        style={{ minHeight: '500px', borderColor: 'transparent', borderWidth: 0 }}
        events={events}
      />
    </div>
  );
};
