import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
    return (
        <div className="file-details-thumbnail">
            <Thumbnail
                type={file.type}
                extension={file.extension}
                url={file.url}
            />

            <div className="flex-col flex ">
                <p className="subtitle-2 mb-1">{file.name}</p>
                <FormattedDateTime date={file.$createdAt} className="caption" />
            </div>
        </div>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex">
            <p className="file-details-label text-left">{label}</p>
            <p className="file-details-value text-left">{value}</p>
        </div>
    );
};

export const FileDetails = ({ file }: { file: Models.Document }) => {
    return (
        <>
            <ImageThumbnail file={file} />

            <div className="space-y-4 px-2 pt-2">
                <DetailRow label={'format:'} value={file.extension} />
                <DetailRow label={'size:'} value={convertFileSize(file.size)} />
                <DetailRow label={'owner:'} value={file.owner.fullName} />
                <DetailRow
                    label={'last edit:'}
                    value={formatDateTime(file.$updatedAt)}
                />
            </div>
        </>
    );
};
