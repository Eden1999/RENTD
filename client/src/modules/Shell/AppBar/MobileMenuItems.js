import {Disclosure} from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MobileMenuItems(props) {
    return (
        <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
                {props.navigation.map((item) => (
                    <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                            item.current ? 'bg-secondary text-white' : 'text-white hover:bg-secondary hover:bg-opacity-40',
                            'block px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                    >
                        {item.name}
                    </Disclosure.Button>
                ))}
            </div>
        </Disclosure.Panel>
    )
}
