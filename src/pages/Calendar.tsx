import {  useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "moment/locale/pt-br";
import { useLocation } from 'react-router-dom';

export default function Calendario() {
  const { state } = useLocation();
  const [events, setEvents] = useState<any>([]);
  const localizer = momentLocalizer(moment);
  var defaultMessages = {
    date: "Data",
    time: "Hora",
    event: "Evento",
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

  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    const newEvent = { title: `Férias de ${state.name}`, start, end };
    const verify = events.some((item: { start: Date }) =>
      new Date(item.start).getTime() == new Date(start).getTime())
    if (!verify) {
      setEvents([...events, newEvent]);
    } else {
      const filter = events.filter((event: { start: Date }) => new Date(start).getTime() != new Date(event.start).getTime())
      setEvents(filter);
    }

  };

  return (
    <div className='bg-white'>
      <Calendar
        allDayAccessor={'start'}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        messages={defaultMessages}
        defaultView='month'
        views={['month', 'agenda']}
        style={{ height: '100vh' }}
        
      />
    </div>
  );
}