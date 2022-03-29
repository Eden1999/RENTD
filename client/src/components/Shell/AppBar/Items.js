import { useNavigate } from "react-router"

export default function Items(props) {
    const navigate = useNavigate()
    return (
        <div className="hidden sm:block sm:ml-6 self-center">
            <div className="flex space-x-1">
                {props.navigation.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => {navigate(item.href)}}
                        className={
                            item.current ? 'bg-zinc-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }
                        aria-current={item.current ? 'page' : undefined}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
