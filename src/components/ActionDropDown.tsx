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
import { useEffect, useState } from 'react';
import { AlertDialogHeader } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    deleteFile,
    renameFile,
    updateFileUsers,
} from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails } from './ActionsModelContent';
import { ShareInput } from './ActionsModelContent';
import { getCurrentUser } from '@/lib/actions/user.actions';

const ActionDropDown = ({ file }: { file: Models.Document }) => {
    const path = usePathname();
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // Check ownership on component mount
        const fetchOwnershipStatus = async () => {
            const user = await getCurrentUser();
            setIsOwner(user.$id === file.owner.$id);
        };
        fetchOwnershipStatus();
    }, [file.owner.$id]);

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
            share: () => updateFileUsers({ fileId: file.$id, emails, path }),
            delete: () =>
                deleteFile({
                    fileId: file.$id,
                    bucketFileId: file.bucketFileId,
                    path,
                }),
        };

        success = await actions[action.value as keyof typeof actions]();
        if (success) closeAllModels();

        setIsLoading(false);
    };

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);

        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path,
        });

        if (success) setEmails(updatedEmails);
        closeAllModels();
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
                        {value === 'details' && <FileDetails file={file} />}
                        {value === 'share' && (
                            <ShareInput
                                file={file}
                                onInputChange={setEmails}
                                onRemove={handleRemoveUser}
                                isOwner={isOwner}
                            />
                        )}

                        {value === 'delete' && (
                            <p className="deleted-confirmation">
                                Are you sure you want to delete
                                <span className="delete-file-name">
                                    {file.name}
                                </span>
                            </p>
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
