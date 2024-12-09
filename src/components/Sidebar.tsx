'use client';
import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarPropsType = {
    fullName: string;
    avatar: string;
    email: string;
};

const Sidebar = ({ fullName, avatar, email }: SidebarPropsType) => {
    const pathname = usePathname();
    return (
        <aside className="sidebar">
            <Link href={'/'}>
                {/* logo for large devices */}
                <Image
                    src={'/assets/icons/logo-full-brand.svg'}
                    alt="logo"
                    width={160}
                    height={60}
                    className="hiddent h-auto lg:block"
                />

                {/* logo for small devices */}
                <Image
                    src={'/assets/icons/logo-brand.svg'}
                    alt="logo"
                    width={52}
                    height={52}
                    className="lg:hidden"
                />
            </Link>

            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map((item) => {
                        const active = pathname === item.url;
                        const { icon, name, url } = item;
                        return (
                            <Link href={url} key={name} className="lg:w-full ">
                                <li
                                    className={cn(
                                        'sidebar-nav-item',
                                        active && 'shad-active'
                                    )}
                                >
                                    <Image
                                        src={icon}
                                        alt={name}
                                        width={24}
                                        height={24}
                                        className={cn(
                                            'nav-icon',
                                            active && 'nav-icon-active'
                                        )}
                                    />
                                    <p className="hidden lg:block">{name}</p>
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            </nav>

            <Image
                src={'/assets/images/files-2.png'}
                alt="logo"
                width={506}
                height={418}
                className="w-full"
            />

            <div className="sidebar-user-info">
                <Image
                    src={avatar}
                    alt="avatar"
                    width={44}
                    height={44}
                    className="sidebar-user-avatar"
                />

                <div className="hidden lg:block">
                    <p className="subtitle-2 capitalize"> {fullName}</p>
                    <p className="caption"> {email}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
