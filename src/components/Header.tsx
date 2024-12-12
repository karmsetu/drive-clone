import Image from 'next/image';
import Search from './Search';
import FileUploader from './FileUploader';
import { Button } from './ui/button';
import { signOutUser } from '@/lib/actions/user.actions';

const Header = ({
    accountId,
    userId,
}: {
    accountId: string;
    userId: string;
}) => {
    return (
        <header className="header">
            <Search />
            <div className="header-wrapper">
                <FileUploader accountId={accountId} ownerId={userId} />
                <form
                    action={async () => {
                        'use server';
                        await signOutUser();
                    }}
                >
                    <Button type="submit" className="sign-out-button">
                        <Image
                            src={'/assets/icons/logout.svg'}
                            alt="logo"
                            width={24}
                            height={24}
                            className="w-6"
                        />
                    </Button>
                </form>
            </div>
        </header>
    );
};

export default Header;
