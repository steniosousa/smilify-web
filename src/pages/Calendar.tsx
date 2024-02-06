import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import "moment/locale/pt-br";
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from '../service/api';

export default function Calendario() {
  const [modal, setModal] = useState(false)
  const [reason, setReason] = useState('Informe o motivo')
  const cancelButtonRef = useRef(null)
  const { state } = useLocation();
  const [events, setEvents] = useState<any>([]);
  const localizer = momentLocalizer(moment);
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [edit, setEdit] = useState<string>('')
  const [doctorName, setDoctorName] = useState('')
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


  async function getDatas() {
    try {
      if (!state) {
        const { data } = await Api.get('/vacation/find')
        const arrDatas = data.map((item: any) => {
          return { id: item.id, title: `${item.reason} de ${item.doctor.name}`, start: item.start, end: item.finish };
        })
        setEvents(arrDatas)
        setDoctorName(data[0] ? data[0].doctor.name : "doutor")
      } else {
        const { data } = await Api.get('/vacation/find', {
          headers: {
            id: state.id
          }
        })
        const arrDatas = data.map((item: any) => {
          return { id: item.id, title: `${item.reason} de ${state.name}`, start: item.start, end: item.finish };
        })
        setEvents(arrDatas)
      }

    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: error,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }


  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    const role = localStorage.getItem('role')
    if (role != "clinic") return
    const newEvent = { title: `Férias de ${state ? state.name : doctorName}`, start, end };
    let dateStart = `${start.getDate()}/${start.getMonth()}/${start.getFullYear()}`
    let dateEnd = `${end.getDate() - 1}/${end.getMonth()}/${end.getFullYear()}`

    setEvents([...events, newEvent]);
    setModal(!modal)
    setStart(dateStart)
    setEnd(dateEnd)

  };

  function closeModal() {
    setModal(!modal)
    setReason('')
    getDatas()
    setEdit('')
  }

  async function handleMakerVacation() {
    const dataAlredy = events.slice(-1)[0]
    const objSend = {
      userId: state.id,
      start: new Date(dataAlredy['start']) as Date,
      end: new Date(dataAlredy['end']) as Date,
      reason

    }
    if (reason == '' || !objSend.userId || !objSend.start || !objSend.end) {
      await Swal.fire({
        icon: 'info',
        title: "Preencha todos oscampos",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }
    try {
      await Api.post('/vacation/create', objSend)
      await Swal.fire({
        icon: 'success',
        title: "Marcação agendada",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      getDatas()
      setModal(!modal)
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: error.response.data,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  async function handleEditVacation({ id, start, end }: { id: string, start: Date, end: Date }) {
    const role = localStorage.getItem('role')
    if (role != "clinic") return
    let dateStart = `${new Date(start).getDate()}/${new Date(start).getMonth()}/${new Date(start).getFullYear()}`
    let dateEnd = `${new Date(end).getDate() - 1}/${new Date(end).getMonth()}/${new Date(end).getFullYear()}`

    setStart(dateStart)
    setEnd(dateEnd)
    setModal(!modal)
    setEdit(id)
  }

  async function handleDeleteVacation() {
    try {
      await Api.post('/vacation/', {
        id: edit
      })
      await Swal.fire({
        icon: 'success',
        title: "Deleção bem sucedida",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      getDatas()
      setModal(!modal)
      setEdit('')
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: error.response.data,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }
  useEffect(() => { getDatas() }, [])

  return (
    <div className='dark:bg-black bg-white dark:text-white'>
      <Calendar
        onDoubleClickEvent={(e) => handleEditVacation(e as any)}
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

      {modal ? (
        <Transition.Root show={modal} as={Fragment} >
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto position-relative ">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg  bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="dark:bg-black bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">

                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left dark:text-white">
                        {edit != '' ? (
                          <div className="sm:flex sm:items-center flex-col">
                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                              Editar marcação
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                              Marcação de {state ? state.name : doctorName} do dia {start} ao dia {end}?
                            </p>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-black gap-3">
                              <button
                                className="bg-meta-1 inline-flex items-center justify-center rounded-md bg-red-500 py-2 px-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                type="button"
                                onClick={() => handleDeleteVacation()}
                              >
                                Deletar
                              </button>
                              <button
                                type="button"
                                className="bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setModal(false)}
                                ref={cancelButtonRef}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="sm:flex sm:items-center flex-col">
                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                              Confirmar marcação
                            </Dialog.Title>
                            <label htmlFor="reason" className="block mb-2 text-sm font-medium  dark:text-white">Selecionar o motivo</label>
                            <select onChange={(i) => setReason(i.target.value)} id="reason" className="bg-gray-50 border dark:text-black border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option value='' selected={true} hidden>{reason}</option>
                              <option value="Férias" >Férias</option>
                              <option value="Atestado">Atestado</option>
                              <option value="Folga">Folga</option>
                              <option value="Falta">Falta</option>
                            </select>

                            {reason === 'Atestado' ? (
                              <input type='file' accept='pdf' />
                            ) : null}
                            <p className="text-sm text-gray-500">
                              Deseja confirmar marcação de {reason} a {state ? state.name : doctorName} do dia {start} ao dia {end}?
                            </p>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-black gap-3">
                              <button
                                className="inline-flex items-center justify-center rounded-md bg-meta-3 py-2 px-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                type="button"
                                onClick={() => handleMakerVacation()}
                              >
                                Marcar
                              </button>
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setModal(false)}
                                ref={cancelButtonRef}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                        <div >

                        </div>
                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

      ) : null
      }
    </div >
  );
}