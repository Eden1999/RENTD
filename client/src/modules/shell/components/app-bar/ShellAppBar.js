import { Disclosure } from '@headlessui/react'
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import Items from "./Items";
import MobileMenuItems from "./MobileMenuItems";

const navigation = [
    { name: 'History', href: '#', current: false },
    { name: 'Favorites', href: '#', current: false },
]

export default function ShellAppBar() {
    return (
        <Disclosure as="nav" className="bg-zinc-800">
            {({ open }) => (
            <>
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                           <MobileMenuButton open={open} />
                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <Logo />
                            <Items navigation={navigation} />
                        </div>
                        <ProfileMenu />
                    </div>
                </div>
                <MobileMenuItems navigation={navigation} />
            </>
            )}
        </Disclosure>
    )
}