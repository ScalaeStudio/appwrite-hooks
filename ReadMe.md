# Appwrite React hooks

Realtime stores synced with Appwrite collections and user.

## Installation

```sh
yarn add https://github.com/ScalaeStudio/appwrite-hooks
```

## Usage

```ts

import { useUser, useCollection } from 'appwrite-hooks'
import { Client, Databases, Account } from 'appwrite'

// Ideally do that in a separate module
const appwriteClient = new Client()
const appwriteDatabase = new Databases(appwriteClient)
const appwriteAccount = new Account(appwriteClient)
client
    .setEndpoint('http://your-appwrite-instance/v1')
    .setProject('your-project')

function YourComponent() {
    const { account, loaded, error } = useUser(appwriteClient, appwriteAccount)
    const { documents, loaded, error } = useCollection(
        appwriteClient,
        appwriteDatabase,
        "database-id",
        "collection-id",
    )
    const { document, loaded, error } = useDocument(
        appwriteClient,
        appwriteDatabase,
        "database-id",
        "collection-id",
        "document-id",
    );

    return (<>...</>)
}

```
