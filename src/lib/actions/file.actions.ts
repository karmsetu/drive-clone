'use server';

import { createAdminClient } from '../appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwrite/config';
import { ID, Models, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user.actions';

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ({
    file,
    ownerId,
    accountId,
    path,
}: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);
        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        }; // metadata

        const newFile = await databases
            .createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument
            )
            .catch(async (e) => {
                await storage.deleteFile(
                    appwriteConfig.bucketId,
                    bucketFile.$id
                );
                handleError(e, 'failed to create file document');
            });

        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        handleError(error, 'Failed to upload files');
    }
};

export const getFiles = async () => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw Error('user not found');
        }

        const queries = await createQueries(currentUser);
        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        );

        return parseStringify(files);
    } catch (error) {
        handleError(error, 'failed to get files');
    }
};

const createQueries = async (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal('owner', [currentUser.$id]),
            Query.contains('users', [currentUser.email]),
        ]),
    ];

    return queries;
};
