import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "moment/locale/pt-br";
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from '../service/api';
import { DateRange, DayPicker } from 'react-day-picker';

export default function Calendario() {
  const [modal, setModal] = useState(false)
  const [reason, setReason] = useState('Informe o motivo')
  const cancelButtonRef = useRef(null)
  const { state } = useLocation();
  const [events, setEvents] = useState<any>([]);
  const [edit, setEdit] = useState<string>('')
  const [doctorName, setDoctorName] = useState('')
  const [dateStart, setDateStart] = useState()
  const [dateTo, setDateTo] = useState()

  const [range, setRange] = useState<DateRange | undefined>({});

  const minHeight = 6;

  let cellHeight = Math.min(
    Math.max(minHeight * 5.5)
  );

  async function handleMakerVacation() {
    if (!range || !range['from'] || !range['to']) {
      await Swal.fire({
        icon: 'info',
        title: "Informes as datas",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }
    const objSend = {
      userId: state.id,
      start: new Date(range['from']) as Date,
      end: new Date(range['to']) as Date,
      reason

    }
    if (reason == '' || !objSend.userId || !objSend.start || !objSend.end) {
      await Swal.fire({
        icon: 'info',
        title: "Preencha todos os campos",
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

  async function getDatas() {
    try {
      if (!state) {
        const { data } = await Api.get('/vacation/find')
        const arrDatas = data.map((item: any) => {
          return { id: item.id, reason: item.reason, from: item.start, to: item.to }
        })
        console.log(data)
        setEvents(arrDatas)
      } else {
        const { data } = await Api.get('/vacation/find', {
          headers: {
            id: state.id
          }
        })
        const arrDatas = data.map((item: any) => {
          return { id: item.id, reason: item.reason, from: item.start, to: item.finish, doctor: item.doctor.name }
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


  // const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
  //   const role = localStorage.getItem('role')
  //   if (role != "clinic") return
  //   const newEvent = { title: `Férias de ${state ? state.name : doctorName}`, start, end };
  //   let dateStart = `${start.getDate()}/${start.getMonth()}/${start.getFullYear()}`
  //   let dateEnd = `${end.getDate() - 1}/${end.getMonth()}/${end.getFullYear()}`

  //   setEvents([...events, newEvent]);
  //   setModal(!modal)
  //   setStart(dateStart)
  //   setEnd(dateEnd)

  // };

  function closeModal() {
    setModal(!modal)
    setReason('')
    getDatas()
    setEdit('')
  }



  async function handleEditVacation(id, start, end) {
    const role = localStorage.getItem('role')
    if (role != "clinic") return
    console.log(start, end)
    setDateStart(start)
    setDateTo(end)
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



  useEffect(() => {
    if (range && range['to']) {
      setModal(true)
    }
  }, [range])

  useEffect(() => { setRange({}), getDatas() }, [])
  const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    background:blue;
  }
  .my-selected:hover:not([disabled]) { 
    border-color: red;
    color: gray;
    background:gray;
  }
  .my-today { 
    font-weight: bold;
    color: blue;
  }.
`;
  return (
    <div className="min-w-screen min-h-screen flex  justify-center">
      <div >
        <style>{css}</style>
        <DayPicker
          defaultMonth={new Date()}
          modifiersClassNames={{
            selected: 'my-selected',
            today: 'my-today'
          }}
          modifiersStyles={{
            disabled: { fontSize: '75%', background: "blue", borderRadius: 0 }
          }}
          id="test"

          min={3}
          mode="range"
          onPrevClick={(item) => console.log(item)}
          selected={range}
          disabled={events}
          styles={{
            'table': {
              minWidth: "70vw",

            },
            "day": {
              height: '90px',
              minWidth: "100%",
            },
            'cell': {
              alignItems: 'center',
              height: 'auto',
              borderRadius: '4px',
              fontSize: cellHeight
            },


          }}
          onSelect={setRange}
          locale={ptBR}
        />
        <div className='ml-8'>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Eventos:</h2>
          <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            {events.map((item: any) => {
              const dayInFrom = new Date(item.from).getDate()
              const monthInFrom = new Date(item.from).getMonth()
              const yearInFrom = new Date(item.from).getFullYear()
              const from = `${dayInFrom}/${monthInFrom}/${yearInFrom}`

              const dayInTo = new Date(item.to).getDate()
              const monthInTo = new Date(item.to).getMonth()
              const yearInTo = new Date(item.to).getFullYear()
              const to = `${dayInTo}/${monthInTo}/${yearInTo}`
              return (
                <li className="flex items-center flex-row justify-between w-2/3">
                  <div className='flex flex-row align-center justify-center text-center'>
                    <svg className="w-3.5  me-2 text-primary  flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <p>
                      {item.reason} - {from} à {to}
                    </p>
                  </div>
                  <svg
                    onClick={() => handleEditVacation(item.id, from, to)}
                    className="fill-current cursor-pointer "
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.50312L17.8062 3.12812C17.0844 2.37187 15.8469 2.33749 15.0906 3.09374L14.9875 3.16249C14.8844 3.26562 14.7125 3.29999 14.5406 3.23124C14.4031 3.16249 14.2656 3.09374 14.0937 3.05937C13.9219 2.99062 13.8187 2.85312 13.8187 2.71562V2.54374C13.8187 1.47812 12.9594 0.618744 11.8937 0.618744H9.96875C9.45312 0.618744 8.97187 0.824994 8.62812 1.16874C8.25 1.54687 8.07812 2.02812 8.07812 2.50937V2.64687C8.07812 2.78437 7.975 2.92187 7.8375 2.99062C7.76875 3.02499 7.73437 3.02499 7.66562 3.05937C7.52812 3.12812 7.35625 3.09374 7.25312 2.99062L7.18437 2.88749C6.84062 2.50937 6.35937 2.30312 5.84375 2.30312C5.32812 2.30312 4.84687 2.47499 4.46875 2.85312L3.09375 4.19374C2.3375 4.91562 2.30312 6.15312 3.05937 6.90937L3.12812 7.01249C3.23125 7.11562 3.26562 7.28749 3.19687 7.39062C3.12812 7.52812 3.09375 7.63124 3.025 7.76874C2.95625 7.90624 2.85312 7.97499 2.68125 7.97499H2.57812C2.0625 7.97499 1.58125 8.14687 1.20312 8.52499C0.824996 8.86874 0.618746 9.34999 0.618746 9.86562L0.584371 11.7906C0.549996 12.8562 1.40937 13.7156 2.475 13.75H2.57812C2.75 13.75 2.8875 13.8531 2.92187 13.9906C2.99062 14.0937 3.05937 14.1969 3.09375 14.3344C3.12812 14.4719 3.09375 14.6094 2.99062 14.7125L2.92187 14.7812C2.54375 15.125 2.3375 15.6062 2.3375 16.1219C2.3375 16.6375 2.50937 17.1187 2.8875 17.4969L4.22812 18.8719C4.95 19.6281 6.1875 19.6625 6.94375 18.9062L7.04687 18.8375C7.15 18.7344 7.32187 18.7 7.49375 18.7687C7.63125 18.8375 7.76875 18.9062 7.94062 18.9406C8.1125 19.0094 8.21562 19.1469 8.21562 19.2844V19.4219C8.21562 20.4875 9.075 21.3469 10.1406 21.3469H12.0656C13.1312 21.3469 13.9906 20.4875 13.9906 19.4219V19.2844C13.9906 19.1469 14.0937 19.0094 14.2312 18.9406C14.3 18.9062 14.3344 18.9062 14.4031 18.8719C14.575 18.8031 14.7125 18.8375 14.8156 18.9406L14.8844 19.0437C15.2281 19.4219 15.7094 19.6281 16.225 19.6281C16.7406 19.6281 17.2219 19.4562 17.6 19.0781L18.975 17.7375C19.7312 17.0156 19.7656 15.7781 19.0094 15.0219L18.9406 14.9187C18.8375 14.8156 18.8031 14.6437 18.8719 14.5406C18.9406 14.4031 18.975 14.3 19.0437 14.1625C19.1125 14.025 19.25 13.9562 19.3875 13.9562H19.4906H19.525C20.5562 13.9562 21.4156 13.1312 21.45 12.0656L21.4844 10.1406C21.4156 9.72812 21.2094 9.21249 20.8656 8.86874ZM19.8344 12.1C19.8344 12.3062 19.6625 12.4781 19.4562 12.4781H19.3531H19.3187C18.5281 12.4781 17.8062 12.9594 17.5312 13.6469C17.4969 13.75 17.4281 13.8531 17.3937 13.9562C17.0844 14.6437 17.2219 15.5031 17.7719 16.0531L17.8406 16.1562C17.9781 16.2937 17.9781 16.5344 17.8406 16.6719L16.4656 18.0125C16.3625 18.1156 16.2594 18.1156 16.1906 18.1156C16.1219 18.1156 16.0187 18.1156 15.9156 18.0125L15.8469 17.9094C15.2969 17.325 14.4719 17.1531 13.7156 17.4969L13.5781 17.5656C12.8219 17.875 12.3406 18.5625 12.3406 19.3531V19.4906C12.3406 19.6969 12.1687 19.8687 11.9625 19.8687H10.0375C9.83125 19.8687 9.65937 19.6969 9.65937 19.4906V19.3531C9.65937 18.5625 9.17812 17.8406 8.42187 17.5656C8.31875 17.5312 8.18125 17.4625 8.07812 17.4281C7.80312 17.2906 7.52812 17.2562 7.25312 17.2562C6.77187 17.2562 6.29062 17.4281 5.9125 17.8062L5.84375 17.8406C5.70625 17.9781 5.46562 17.9781 5.32812 17.8406L3.9875 16.4656C3.88437 16.3625 3.88437 16.2594 3.88437 16.1906C3.88437 16.1219 3.88437 16.0187 3.9875 15.9156L4.05625 15.8469C4.64062 15.2969 4.8125 14.4375 4.50312 13.75C4.46875 13.6469 4.43437 13.5437 4.36562 13.4406C4.09062 12.7187 3.40312 12.2031 2.6125 12.2031H2.50937C2.30312 12.2031 2.13125 12.0312 2.13125 11.825L2.16562 9.89999C2.16562 9.76249 2.23437 9.69374 2.26875 9.62499C2.30312 9.59062 2.40625 9.52187 2.54375 9.52187H2.64687C3.4375 9.55624 4.15937 9.07499 4.46875 8.35312C4.50312 8.24999 4.57187 8.14687 4.60625 8.04374C4.91562 7.35624 4.77812 6.49687 4.22812 5.94687L4.15937 5.84374C4.02187 5.70624 4.02187 5.46562 4.15937 5.32812L5.53437 3.98749C5.6375 3.88437 5.74062 3.88437 5.80937 3.88437C5.87812 3.88437 5.98125 3.88437 6.08437 3.98749L6.15312 4.09062C6.70312 4.67499 7.52812 4.84687 8.28437 4.53749L8.42187 4.46874C9.17812 4.15937 9.65937 3.47187 9.65937 2.68124V2.54374C9.65937 2.40624 9.72812 2.33749 9.7625 2.26874C9.79687 2.19999 9.9 2.16562 10.0375 2.16562H11.9625C12.1687 2.16562 12.3406 2.33749 12.3406 2.54374V2.68124C12.3406 3.47187 12.8219 4.19374 13.5781 4.46874C13.6812 4.50312 13.8187 4.57187 13.9219 4.60624C14.6437 4.94999 15.5031 4.81249 16.0875 4.26249L16.1906 4.19374C16.3281 4.05624 16.5687 4.05624 16.7062 4.19374L18.0469 5.56874C18.15 5.67187 18.15 5.77499 18.15 5.84374C18.15 5.91249 18.1156 6.01562 18.0469 6.11874L17.9781 6.18749C17.3594 6.70312 17.1875 7.56249 17.4625 8.24999C17.4969 8.35312 17.5312 8.45624 17.6 8.55937C17.875 9.28124 18.5625 9.79687 19.3531 9.79687H19.4562C19.5937 9.79687 19.6625 9.86562 19.7312 9.89999C19.8 9.93437 19.8344 10.0375 19.8344 10.175V12.1Z"
                      fill=""
                    />
                    <path
                      d="M11 6.32498C8.42189 6.32498 6.32501 8.42186 6.32501 11C6.32501 13.5781 8.42189 15.675 11 15.675C13.5781 15.675 15.675 13.5781 15.675 11C15.675 8.42186 13.5781 6.32498 11 6.32498ZM11 14.1281C9.28126 14.1281 7.87189 12.7187 7.87189 11C7.87189 9.28123 9.28126 7.87186 11 7.87186C12.7188 7.87186 14.1281 9.28123 14.1281 11C14.1281 12.7187 12.7188 14.1281 11 14.1281Z"
                      fill=""
                    />
                  </svg>
                </li>
              )
            })}

          </ul>

        </div>

        <div className='w-full h-full'>
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
                                  Marcação de {state ? state.name : doctorName} do dia {dateStart} ao dia {dateTo}?
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
                                    className="bg-gray-50 dark:text-white text-white mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
                                  <option value='DEFAULT' defaultValue={'DEFAULT'} hidden>{reason}</option>
                                  <option value="Férias" >Férias</option>
                                  <option value="Atestado">Atestado</option>
                                  <option value="Folga">Folga</option>
                                  <option value="Falta">Falta</option>
                                </select>

                                {reason === 'Atestado' ? (
                                  <input type='file' accept='pdf' />
                                ) : null}
                                <p className="text-sm text-gray-500">
                                  Deseja confirmar marcação de  a do dia {range ? ` ${range["from"]?.getDate()}/${range["from"]?.getMonth()}  ` : ""} ao dia {range ? ` ${range["to"]?.getDate()}/${range["to"]?.getMonth()}  ` : ""}?
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
                                    className="mt-3  dark:text-black inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
      </div>


    </div>
  );
}