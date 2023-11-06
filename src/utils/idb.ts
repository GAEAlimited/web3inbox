import { openDB } from 'idb'

/*
 * Key value store of:
 * (string)           -> (string)
 * Subscription Topic -> Symkey
 */
export const SYMKEY_OBJ_STORE = 'symkey-store'

/*
 * Key value store of:
 * (string)  -> (string)
 * Client ID -> FCM Token
 */
export const ECHO_REGISTRATION_STORE = 'echo-registration-store'

const STORE_NAMES = [SYMKEY_OBJ_STORE, ECHO_REGISTRATION_STORE]

// Returns getter and setter for idb properties as it used as a key value store
export const getIndexedDbStore = async (
  storeName: string
): Promise<
  [(key: string) => Promise<any>, (key: string, value: string) => Promise<IDBValidKey>]
> => {
  const db = await openDB('w3i-push-db', 5, {
    upgrade(database) {
      STORE_NAMES.forEach(store => {
        const exists = database.objectStoreNames.contains(store)
        if (!exists) {
          database.createObjectStore(store)
        }
      })
    }
  })

  return [
    (key: string) => {
      return db.get(storeName, key)
    },
    (key: string, value: string) => {
      return db.put(storeName, value, key)
    }
  ]
}

export const getDbSymkeyStore = async () => {
  return getIndexedDbStore(SYMKEY_OBJ_STORE)
}

export const getDbEchoRegistrations = async () => {
  return getIndexedDbStore(ECHO_REGISTRATION_STORE)
}
