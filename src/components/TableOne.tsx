import Swal from 'sweetalert2';
import Api from '../service/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface doctor {
  id: string,
  room: number,
  name: string,
  appointments: string[],
  doctorServices: string[],
  photo: string

}
export default function TableOne() {
  const [doctors, setDoctors] = useState([])
  const [results, setResults] = useState(0)
  const [count, setCount] = useState(0)
  const [cnqtdPagination, setcnqtdPagination] = useState<any[]>([])
  const navigate = useNavigate()
  let css = "cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"

  async function recoverUsers(page: number) {


    try {
      const { data } = await Api.get('/recover/dentist',
        {
          params: {
            page
          }
        })
      setDoctors(data.professionals)
      setCount(data.totalRecords)
      if (data.professionals.length != 5) {
        const x = 5 - data.professionals.length;
        const y = page * 5
        const z = y - x
        setResults(z)
      } else {
        setResults(data.professionals.length)

      }
      const Pagination = data.totalRecords % 5
      const createArr = Array.from({ length: Number(Pagination.toFixed(0)) }, (_, index) => index + 1);
      setcnqtdPagination(createArr);

    } catch (error: any) {
      if (error.response.status == 406) {
        await Swal.fire({
          icon: 'error',
          title: "Clínica não autorizada",
          html:"Efetue o pagamento para validar sua conta",
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          allowOutsideClick: false

        })
        return
      }
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
    recoverUsers(1)
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
              Foto
            </h5>
          </div>
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

        </div>
        {doctors.map((doctor: doctor) => {
          return (
            <div className="cursor-pointer grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5 p-4" key={doctor.id} onClick={() => navigate('/profile', { state: { id: doctor.id } })}>
              <div className="flex-shrink-0">
                <img src={doctor.photo} alt="Brand" className="w-16 h-16 rounded-full align-center ml-3" />
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{doctor.name}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{doctor.room}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">{doctor.appointments.length}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{doctor.doctorServices.length}</p>
              </div>


            </div>

          )
        })}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-black">
          <div className="flex flex-1 justify-between sm:hidden">
            <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
            <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div >
              <p className="text-sm text-gray-700 ">
                mostrando
                <span className="font-medium">  {results}  </span>
                de
                <span className="font-medium">  {count}   </span>
                resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </a>
                {cnqtdPagination.map((item) => {
                  return (
                    <div key={Math.random()} >
                      {item == Math.ceil(results / 5) ? (
                        <a onClick={() => recoverUsers(item)} className="dark:bg-white dark:text-black bg-black text-gray-900 cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold  ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{item}</a>
                      ) : (
                        <a onClick={() => recoverUsers(item)} className={css}>{item}</a>
                      )}
                    </div>
                  )
                })}

                <span className=" cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                <a className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

