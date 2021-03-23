import Dexie from 'dexie'

export interface MemoRecord {
    datetime: string
    title: string
    text: string
}

// db名
const database = new Dexie('markdown-editor')

database.version(1).stores({memos: '&datetime'})

// Dexie.Table<T, U>
// T：保存するデータの型
// U：キーの型
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async (title: string, text: string): Promise<void> => {
    const datetime = new Date().toISOString()
    await memos.put({ datetime, title, text })
}
