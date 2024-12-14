'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionsDropdownItems } from '@/constants';
import { constructDownloadUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Models } from 'node-appwrite';
import { useState } from 'react';
import { AlertDialogHeader } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { renameFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';

const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const path = usePathname();
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);

    const closeAllModels = () => {
        setIsModelOpen(false);
        setIsDropdownOpen(false);

        setAction(null);
        setName(file.name);
    };

    const handleAction = async () => {
        if (!action) return;

        setIsLoading(true);

        let success = false;

        const actions = {
            rename: () =>
                renameFile({
                    fileId: file.$id,
                    name,
                    extension: file.extension,
                    path,
                }),
            share: () => console.log('share'),
            delete: () => console.log('share'),
        };

        success = await actions[action.value as keyof typeof actions]();
        if (success) closeAllModels();
    };

    const renderDialogContent = () => {
        if (!action) return null;

        const { label, value } = action;
        return (
            <>
                <DialogContent className="shad-dialog-button">
                    <DialogHeader className="flex flex-col gap-3">
                        <DialogTitle className="text-center text-light-100">
                            {label}
                        </DialogTitle>

                        {value === 'rename' && (
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}
                    </DialogHeader>
                    {['rename', 'delete', 'share'].includes(value) && (
                        <DialogFooter className="flex flex-col gap-3 md:flex-row">
                            <Button
                                onClick={closeAllModels}
                                className="modal-cancel-button"
                            >
                                cancel
                            </Button>
                            <Button
                                onClick={handleAction}
                                className="modal-submit-button"
                            >
                                <p className="capitalize">{value}</p>

                                {isLoading && (
                                    <Image
                                        src={'assets/icons/loader.svg'}
                                        alt="loader"
                                        width={24}
                                        height={24}
                                        className="animate-spin"
                                    />
                                )}
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </>
        );
    };

    return (
        <>
            <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                >
                    <DropdownMenuTrigger className="shad-no-focus">
                        <Image
                            src={`/assets/icons/dots.svg`}
                            alt="dots"
                            width={34}
                            height={34}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="max-w-[200px] truncate">
                            {file.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {actionsDropdownItems.map((actionItem) => (
                            <DropdownMenuItem
                                key={actionItem.value}
                                className="shad-dropdown-item"
                                onClick={() => {
                                    setAction(actionItem);
                                    if (
                                        [
                                            'rename',
                                            'share',
                                            'delete',
                                            'details',
                                        ].includes(actionItem.value)
                                    ) {
                                        setIsModelOpen(true);
                                    }
                                }}
                            >
                                {actionItem.value === 'download' ? (
                                    <Link
                                        href={constructDownloadUrl(
                                            file.bucketFileId
                                        )}
                                        download={file.name}
                                        className="flex items-center gap-2"
                                    >
                                        <Image
                                            src={actionItem.icon}
                                            alt={actionItem.label}
                                            width={30}
                                            height={30}
                                        />{' '}
                                        {actionItem.label}
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={actionItem.icon}
                                            alt={actionItem.label}
                                            width={30}
                                            height={30}
                                        />{' '}
                                        {actionItem.label}
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {renderDialogContent()}
            </Dialog>
        </>
    );
};

export default ActionDropDown;
