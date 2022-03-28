import { Disclosure } from '@headlessui/react'
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import Items from "./Items";
import MobileMenuItems from "./MobileMenuItems";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../store/AppContext";

const navigationByRole = {
    host: [
        { name: 'My Spaces', href: 'my-spaces', current: false },
    ],
    guest: [
        { name: 'History', href: '#', current: false },
        { name: 'Favorites', href: '#', current: false },
    ]
}

export default function ShellAppBar() {
    const [{user}] = useContext(AppContext);
    const [navigationItems, setNavigationItems] = useState([]);

    useEffect(() => {
        if(user.is_host) {
            setNavigationItems(navigationByRole.host);
        } else {
            setNavigationItems(navigationByRole.guest);
        }
    }, [user])

    return (
        <Disclosure as="nav" className="bg-zinc-700">
            {({ open }) => (
            <>
                <div className="mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                           <MobileMenuButton open={open} />
                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <Logo />
                            <Items navigation={navigationItems} />
                        </div>
                        <ProfileMenu />
                    </div>
                </div>
                <MobileMenuItems navigation={navigationItems} />
            </>
            )}
        </Disclosure>
    )
}