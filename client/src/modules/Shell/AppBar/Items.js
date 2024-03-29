import { useNavigate } from "react-router"

export default function Items(props) {
    const navigate = useNavigate();

    return (
        <div className="hidden sm:block sm:ml-6 self-center">
            <div className="flex space-x-1">
                {props.navigation.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => {
                            props.setCurrentItem(item);
                            navigate(item.href);
                        }}
                        className={
                            item == props.currentItem ? 'text-white bg-secondary hover:text-white hover:cursor-pointer px-3 py-2 rounded-md text-sm font-bold' :
                                'text-white hover:bg-secondary hover:bg-opacity-40 hover:cursor-pointer px-3 py-2 rounded-md text-sm font-medium'
                        }
                        aria-current={item == props.currentItem ? 'page' : undefined}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    )
}
