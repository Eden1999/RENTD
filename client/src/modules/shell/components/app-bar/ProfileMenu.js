import {Menu, Transition} from "@headlessui/react";
import { Fragment, useContext } from 'react';
import { AppContext } from "../../../../store/AppContext";
import { useNavigate } from 'react-router-dom';
import { signOut } from "../../../../helpers/helpFunctions";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const menuItems = [
    { name: 'Your Profile', href: '/profile', active: false},
    { name: 'Settings', href: '#', active: false },
    { name: 'Sign Out', href: '/login', active: false, onClick : (dispatch) => {signOut(dispatch)} },
]


export default function ProfileMenu() {
    const [ , dispatch] = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="ml-3 relative">
                <div>
                    <Menu.Button
                        className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="h-8 w-8 rounded-full"
                            src="https://scontent.ftlv18-1.fna.fbcdn.net/v/t1.6435-9/125353907_3305195439609150_6275363081649698443_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=xP6LJv3gj9oAX9Vq4Cr&_nc_ht=scontent.ftlv18-1.fna&oh=00_AT82kEQOSKw3gIhdLMfyKW4P5j3B9-kuULboTZDu-NyJJQ&oe=624DA8BA"
                            alt=""
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className="bg-zinc-700 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {menuItems.map((item) => (
                            <Menu.Item
                                key={item.name}>
                                {({active}) => (
                                    <div 
                                        onClick={() => {
                                            item.onClick && item.onClick(dispatch);
                                            navigate(item.href);
                                        }}
                                        className={classNames(active ? 'bg-zinc-600' : '', 'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white')}
                                    >
                                        {item.name}
                                    </div>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}