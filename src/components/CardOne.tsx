import { useEffect, useState } from "react";
import Api from "../service/api";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import check from '../images/symbols/check.png'
import remove from '../images/symbols/remove.png'
import stay from '../images/symbols/stay-at-home.png'
import Swal from "sweetalert2";

interface appointmentProps {
  id: string,
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

const CardOne = () => {
  const [appointment, setAppointment] = useState({} as appointmentProps)
  const [isLoading, setIsLoading] = useState(false);
  const [titleButton, setTittleButton] = useState('Sem consulta')
  const [status, setStatus] = useState('')
  const [title, setTitle] = useState('')
  const [queue, setQueue] = useState('')
  const [icons, setIcon] = useState()

  async function getAppointment() {
    setIsLoading(true)
    try {
      const { data } = await Api.get('/appointment/pick')
      setAppointment(data)
      if (data.status == "create") {
        setIcon(stay)
        setTittleButton("Solicitar entrada")
        setQueue('stay')
        setStatus('accept')
        setTitle("Paciente solicitado")
      }
      else if (data.status == "accept") {
        setIcon(check)
        setTittleButton("Finalizar consulta")
        setQueue('quit')
        setStatus('finished')
        setTitle("Consulta finalizada")
      } else {
        setIcon(remove)
        setIsLoading(false)
        setTittleButton("Sem consulta")
        return
      }
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
    setIsLoading(false)
  }

  async function updateStatus() {
    setIsLoading(true)

    const confirm = await Swal.fire({
      icon: 'question',
      title: `${titleButton}?`,
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })
    if (!confirm.isConfirmed) {
      setIsLoading(false)

      return
    }
    try {
      const { data } = await Api.post('/appointment/update/status', {
        status,
        queue,
        appointmentId: appointment.id
      })
      await Swal.fire({
        icon: 'success',
        title,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      setAppointment(data)
      getAppointment()
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
    setIsLoading(false)
  }
  useEffect(() => { getAppointment() }, [])
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-row gap-4">
        <div className="flex h-11.5 w-11.5 items-center justify-center  ">
          <img src={icons} />
        </div>
        <div>
          <div className="flex flex-row items-center gap-4">
            <p className="text-sm">Paciente:</p>
            <h1 className="dark:text-white text-black text-sm"> {appointment.customer ? appointment.customer.name.toUpperCase() : "Smilify"}</h1>
          </div>
          <div className="flex flex-row items-center gap-4 ">
            <p className="text-sm">Status:</p>
            <h1 className="dark:text-white text-black text-sm min-w-full "> {appointment.queue == "stay" ? "Presente no local" : "Smilify"}</h1>
          </div>

        </div>

      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className=" font-bold text-black dark:text-white text-sm">
            {appointment.service ? appointment.service.name : "Sem serviço"}
          </p>
          <span className="text-sm font-medium">R$ {appointment.service ? appointment.service.cost : "00"}</span>
        </div>

      </div>
      <button
        onClick={updateStatus}
        className="flex justify-center rounded min-w-full bg-primary py-2 px-6 mt-4 text-sm font-medium text-gray hover:shadow-1 items-center"
        type="button"
      >
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          <p>{titleButton}</p>
        )}
      </button>
    </div>
  );
};

export default CardOne;
