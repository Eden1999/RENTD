export default function Logo() {
    return (
        <div className="flex-shrink-0 flex items-center">
            <a href={'#'} className="flex-shrink-0 flex items-center">
                <img
                    className="block h-8 w-auto rounded-full"
                    src="logo.png"
                    alt="RENTD"
                />
                <p className="text-gray-300 hover:text-white px-3 py-2 text-3xl font-medium"> RENTD </p>
            </a>
        </div>
    )
}