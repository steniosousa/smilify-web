
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
interface ActionsProps {
    onSubmite: () => void,
    titleButton: string,
    isLoading: boolean
}
export function CardActions({ onSubmite, titleButton, isLoading }: ActionsProps) {
    return (
        <button
            onClick={onSubmite}
            className="flex justify-center rounded min-w-full dark:bg-green bg-primary py-2 px-6 mt-4 text-sm font-medium text-gray hover:shadow-1 items-center"
            type="button"
        >
            {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
                <p className='dark:text-white '>{titleButton}</p>
            )}
        </button>
    )
}