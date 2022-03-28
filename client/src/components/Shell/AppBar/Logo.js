export default function Logo() {
    return (
        <div className="flex-shrink-0 flex items-center">
            <a href={'/guestHome'} className="flex-shrink-0 flex items-center">
                <img
                    className="block h-8
                     w-auto"
                    src="appbar-logo.png"
                    alt="RENTD"
                />
            </a>
        </div>
    )
}