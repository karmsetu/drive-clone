'use client';
import Image from 'next/image';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { useDebounce } from 'use-debounce';

const Search = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query') || '';
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Models.Document[]>([]);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const path = usePathname();
    const [debouncedQuery] = useDebounce(query, 300);

    useEffect(() => {
        if (!searchQuery) {
            setQuery('');
        }
    }, [searchQuery]);

    useEffect(() => {
        const fetchFiles = async () => {
            if (debouncedQuery.length === 0) {
                setResults([]);
                setOpen(false);

                return router.push(path.replace(searchParams.toString(), ''));
            }

            const files = await getFiles({
                searchText: debouncedQuery,
                types: [],
            });
            setResults(files.documents);
        };
        fetchFiles();
        setOpen(true);
    }, [debouncedQuery]);

    const handleClickItem = (file: Models.Document) => {
        setOpen(false);
        setResults([]);

        router.push(
            `/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`
        );
    };

    return (
        <>
            <div className="search">
                <div className="search-input-wrapper">
                    <Image
                        src={'/assets/icons/search.svg'}
                        alt={'search'}
                        width={24}
                        height={24}
                    />

                    <Input
                        value={query}
                        placeholder="Search..."
                        className="search-input"
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {open && (
                        <ul className="search-result">
                            {results.length > 0 ? (
                                results.map((file) => (
                                    <li
                                        className="flex items-center justify-between"
                                        key={file.$id}
                                        onClick={() => handleClickItem(file)}
                                    >
                                        <div className="felx cursor-pointer items-center gap-4">
                                            <Thumbnail
                                                type={file.type}
                                                url={file.url}
                                                className="size-9 min-w-9"
                                                extension={file.extension}
                                            />

                                            <p className="subtitle-2 line-clamp-1 text-light-100">
                                                {file.name}
                                            </p>
                                        </div>

                                        <FormattedDateTime
                                            date={file.$createdAt}
                                            className="caption line-clamp-1 text-light-200"
                                        />
                                    </li>
                                ))
                            ) : (
                                <p className="empty-result">No files</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Search;
