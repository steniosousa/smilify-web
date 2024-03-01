import { useContext } from 'react';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import MapOne from '../../components/MapOne.tsx';
import TableOne from '../../components/TableOne.tsx';
import AuthContext from '../../contexto/AuthContext.tsx';
import { CardRoot } from '../../components/microComponents/card/CardRoot.tsx';
import { CardActions } from '../../components/microComponents/card/CardActions.tsx';
import { useEffect, useState } from "react";
import check from '../../images/symbols/check.png'
import remove from '../../images/symbols/remove.png'
import stay from '../../images/symbols/stay-at-home.png'
import Swal from "sweetalert2";
import Api from '../../service/api.ts';
import { CardDetailsPatientAndStatus } from '../../components/microComponents/card/CardDetailsPatientAndStatus.tsx';
import { CardServiceAndValue } from '../../components/microComponents/card/CardServiceAndValue.tsx';
import { CardIcon } from '../../components/microComponents/card/CardIcon.tsx';
import { CardTitle } from '../../components/microComponents/card/CardTitle.tsx';
import { CardValueCenter } from '../../components/microComponents/card/CardValueCenter.tsx';

interface ConsulttProps {
  date: any,
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
interface appointmentQueueProps {
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

const ECommerce = () => {
  const { user }: any = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [titleButton, setTittleButton] = useState('Sem consulta')
  const [status, setStatus] = useState('')


  const [totalConsults, setTotalConsult] = useState(0)
  const [accomplishedConsults, setAccomplishedConsults] = useState(0)
  const [canceledConsults, setCanceledConsults] = useState(0)

  const [icons, setIcon] = useState(remove)
  const [AppointmentsQueue, setAppointmentQueue] = useState<appointmentQueueProps[]>([])

  const [currentConsutl, setCurrentConsult] = useState({} as ConsulttProps)


  async function getCurrentConsult() {
    setIsLoading(true)
    try {
      const { data } = await Api.get('/consult/current')
      setCurrentConsult(data)
      if (data.status == "enter") {
        setStatus("inService")
        setIcon(stay)
        setTittleButton("Solicitar entrada")
      } else if (data.status == "inService") {
        setStatus("success")
        setIcon(check)
        setTittleButton("Finalizar consulta ")
      } else {
        setIcon(remove)
        setTittleButton("Sem consulta ")
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
    if (!currentConsutl) {
      setIsLoading(false)
      await Swal.fire({
        icon: 'info',
        title: "Não ha solicitação vigente",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }

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
    let objInUpdate = {} as { status: string, consultId: string, finish?: string }
    objInUpdate["status"] = status
    objInUpdate["consultId"] = currentConsutl.id

    if (currentConsutl.status == "inService") {
      objInUpdate["finish"] = "success"
    }


    try {
      await Api.post('/consult/update', objInUpdate)
      getCurrentConsult()
      getAmountConsultation()
      await Swal.fire({
        icon: 'success',
        title: "OK",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
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

  async function getQueue() {
    if (user.role != "dentist") return
    try {
      const { data } = await Api.get("/appointment/queue")
      setAppointmentQueue(data)
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

  async function getAmountConsultation() {
    try {
      const { data } = await Api.get("/consult/amount")
      setTotalConsult(data['total'])
      setAccomplishedConsults(data['accomplished'])
      setCanceledConsults(data['cancelled'])
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
  useEffect(() => { getCurrentConsult(), getQueue(), getAmountConsultation() }, [])

  function ViewDentist() {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardRoot>
          <div className='flex flex-row gap-4 '>
            <CardIcon icon={icons} />
            <CardDetailsPatientAndStatus appointment={currentConsutl} />
          </div>
          <CardServiceAndValue appointment={currentConsutl} />
          <CardActions onSubmite={updateStatus} isLoading={isLoading} titleButton={titleButton} />
        </CardRoot>

        <CardRoot>
          <CardTitle title='Nº DE CONSULTAS' />
          <CardValueCenter value={totalConsults} />
        </CardRoot>
        <CardRoot>
          <CardTitle title='CONSULTAS FALHAS' />
          <CardValueCenter value={canceledConsults} />
        </CardRoot><CardRoot>
          <CardTitle title='CONSULTAS REALIZADAS' />
          <CardValueCenter value={accomplishedConsults} />
        </CardRoot>

      </div>

    )
  }

  function ViewClinic() {
    return (
      <></>
    )
  }
  return (
    <>
      {user.role == "dentist" ? (
        ViewDentist()
      ) : user.role != "dentist" ? (
        ViewClinic()
      ) : null}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne AppointmentsQueue={AppointmentsQueue} />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
