import { useEffect, useState } from "react";
import Api from "../service/api";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import check from '../images/symbols/check.png'
import remove from '../images/symbols/remove.png'
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
  queue: string
}

const CardOne = () => {
  const [appointment, setAppointment] = useState({} as appointmentProps)
  const [isLoading, setIsLoading] = useState(false);

  async function getAppointment() {
    setIsLoading(true)
    try {
      const { data } = await Api.get('/appointment/pick')
      setAppointment(data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  async function updateStatus() {
    setIsLoading(true)
    try {
      const { data } = await Api.post('/appointment/update/status', {
        status: "accept",
        appointmentId: appointment.id
      })
      await Swal.fire({
        icon: 'success',
        title: "Marcação alterada com sucesso",
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
      <div className="flex flex-row justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <img src={appointment ? check : remove} />
        </div>
        <div>
          <div className="flex flex-row items-center gap-4">
            <p>Paciente:</p>
            <h1 className="dark:text-white text-black text-lg"> {appointment.customer ? appointment.customer.name.toUpperCase() : "Smilify"}</h1>
          </div>
          <div className="flex flex-row items-center gap-4">
            <p>Status:</p>
            <h1 className="dark:text-white text-black text-lg"> {appointment.queue == "stay" ? "No local" : "Smilify"}</h1>
          </div>

        </div>

      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {appointment.service ? appointment.service.name : "Sem serviço"}
          </h4>
          <span className="text-sm font-medium">R$ {appointment.service ? appointment.service.cost : "00"}</span>
        </div>

        <button
          onClick={updateStatus}
          className="flex justify-center rounded bg-primary py-2 px-6 text-sm font-medium text-gray hover:shadow-1 items-center"
          type="button"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            'Solicitar entrada'
          )}
        </button>
      </div>
    </div>
  );
};

export default CardOne;
