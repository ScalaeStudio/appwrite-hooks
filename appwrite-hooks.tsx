import { Account, AppwriteException, Client, Databases, Models, RealtimeResponseEvent } from "appwrite";
import { useEffect, useState } from "react";

/*
    Get the given collection, live-updated.
*/
export function useCollection(
    appwriteClient: Client,
    databaseAppwriteClient: Databases,
    databaseId: string,
    collectionId: string,
    queries?: string[] | undefined,
) {

    const [ documents, setDocuments ] = useState<Models.DocumentList<Models.Document>>({
        total: 0, documents: [],
    })
    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ error, setError ] = useState<AppwriteException | null>(null)

    /*
        Fetch the collection.
    */
    const syncCollection = () => {
        databaseAppwriteClient.listDocuments(
            databaseId,
            collectionId,
            queries,
        )
        .then((documents: Models.DocumentList<Models.Document>) => {
            setDocuments(documents)
            setLoaded(true)
        })
        .catch(setError)
    }

    useEffect(() => {
        syncCollection()
        // Subscribe to live changes
        const unsubscribe = appwriteClient.subscribe(
            `databases.${databaseId}.collections.${collectionId}.documents`,
            () => syncCollection(),
        )
        return () => {
            unsubscribe()
        }
    }, [JSON.stringify(queries)])

    return { documents, loaded, error }

}

/*
    Get the current logged user, live-updated.
*/
export function useUser(
    appwriteClient: Client,
    accountAppwriteClient: Account
) {
    const [ account, setAccount ] = useState<Models.User<Models.Preferences> | null>(null)
    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ error, setError ] = useState<AppwriteException | null>(null)
    let unsubscribe: () => void = () => {}

    const syncUser = () => {
        accountAppwriteClient.get()
        .then((account: Models.User<Models.Preferences>) => {
            setAccount(account)
            setLoaded(true)
        })
        .catch(setError)
    }

    useEffect(() => {
        syncUser()
        unsubscribe = appwriteClient.subscribe(`account`, () => syncUser())

        return () => {
            unsubscribe()
        }
    }, [])

    return { account, loaded, error }
}

/*
    Get the given document, live-updated.
*/
export function useDocument(
    appwriteClient: Client,
    databaseAppwriteClient: Databases,
    databaseId: string,
    collectionId: string,
    documentId: string,
) {

    const [ document, setDocument ] = useState<Models.Document | null>(null)
    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ error, setError ] = useState<AppwriteException | null>(null)

    /*
        Fetch the collection.
    */
    const syncDocument = () => {
        databaseAppwriteClient.getDocument(
            databaseId,
            collectionId,
            documentId,
        )
        .then((document: Models.Document) => {
            setDocument(document)
            setLoaded(true)
        })
        .catch(setError)
    }

    useEffect(() => {
        if (!documentId) return () => {};
        syncDocument()
        // Subscribe to live changes
        const unsubscribe = appwriteClient.subscribe(
            `databases.${databaseId}.collections.${collectionId}.documents.${documentId}`,
            (event: RealtimeResponseEvent<Models.Document>) => setDocument(event.payload),
        )
        return () => {
            unsubscribe()
        }
    }, [documentId])

    return { document, loaded, error }

}