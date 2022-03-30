import { Disclosure } from '@headlessui/react'
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import Items from "./Items";
import MobileMenuItems from "./MobileMenuItems";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../../store/AppContext";
import {useNavigate} from "react-router";

const navigationByRole = {
    host: [
        { name: 'My Spaces', href: 'my-spaces' },
    ],
    guest: [
        { name: 'Home', href: '/homepage' },
        { name: 'History', href: '/history' },
        { name: 'Favorites', href: '/favorites' },
    ]
}

export default function ShellAppBar() {
    const [{user}] = useContext(AppContext);
    const [navigationItems, setNavigationItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        if(user.is_host) {
            setNavigationItems(navigationByRole.host);
            setCurrentItem(navigationByRole.host[0]);
        } else if(user.is_host === false) {
            setNavigationItems(navigationByRole.guest);
            setCurrentItem(navigationByRole.guest[0]);
        } else {
            setNavigationItems([]);
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
                            <div className={'hover:cursor-pointer'}
                                onClick={() => {
                                    setCurrentItem(navigationItems[0]);
                                    navigate(navigationItems[0].href);
                                }}
                            >
                                <Logo />
                            </div>
                            <Items navigation={navigationItems}
                                   currentItem={currentItem}
                                   setCurrentItem={setCurrentItem}
                            />
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