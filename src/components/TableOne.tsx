import Swal from 'sweetalert2';
import userImage from '../images/user/user-01.png';
import Api from '../service/api';
import { useEffect, useState } from 'react';

interface doctor {
  room: number,
  name: string,
  _count: {
    appointments: number,
    doctorServices: number
  }

}
export default function TableOne() {
  const userId = localStorage.getItem("webToken");
  const [doctors, setDoctors] = useState([])

  async function recoverUsers() {
    try {
      const { data } = await Api.get('/recover/dentist', {
        headers: {
          Authorization: userId
        }
      })
      setDoctors(data[0].doctors)
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
    recoverUsers()
  }, [])

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Todos os usuários
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Usuário
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Consultório
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              agendamentos
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              serviços
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Conversion
            </h5>
          </div>
        </div>
        {doctors.map((doctor: doctor) => {
          return (
            <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  <img src={userImage} alt="Brand" />
                </div>
                <p className="hidden text-black dark:text-white sm:block">{doctor.name}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{doctor.room}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">{doctor._count.appointments}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{doctor._count.doctorServices}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-meta-5">4.8%</p>
              </div>
            </div>

          )
        })}


      </div>
    </div>
  );
};

