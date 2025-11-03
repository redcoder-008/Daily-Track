import Dexie, { Table } from 'dexie';

// Define interfaces for offline data
export interface OfflineTask {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
  user_id?: string;
}

export interface OfflineExpense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
  created_at: string;
  synced: boolean;
  user_id?: string;
}

export interface OfflineIncome {
  id?: number;
  title: string;
  amount: number;
  source: string;
  income_date: string;
  created_at: string;
  synced: boolean;
  user_id?: string;
}

export interface OfflineNote {
  id?: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
  user_id?: string;
}

export interface OfflineGoal {
  id?: number;
  text: string;
  completed: boolean;
  goal_date: string;
  created_at: string;
  synced: boolean;
  user_id?: string;
}

export interface OfflineBill {
  id?: number;
  title: string;
  file_path: string;
  file_type?: string;
  amount?: number;
  bill_date?: string;
  tags?: string[];
  created_at: string;
  synced: boolean;
  user_id?: string;
}

// Define the database
export class OfflineDatabase extends Dexie {
  tasks!: Table<OfflineTask>;
  expenses!: Table<OfflineExpense>;
  income!: Table<OfflineIncome>;
  notes!: Table<OfflineNote>;
  goals!: Table<OfflineGoal>;
  bills!: Table<OfflineBill>;

  constructor() {
    super('DailyTrackOfflineDB');
    
    this.version(1).stores({
      tasks: '++id, title, completed, due_date, created_at, synced, user_id',
      expenses: '++id, title, amount, category, expense_date, created_at, synced, user_id',
      income: '++id, title, amount, source, income_date, created_at, synced, user_id',
      notes: '++id, title, content, created_at, updated_at, synced, user_id',
      bills: '++id, title, file_path, amount, bill_date, created_at, synced, user_id'
    });
    
    this.version(2).stores({
      tasks: '++id, title, completed, due_date, created_at, synced, user_id, [title+created_at]',
      expenses: '++id, title, amount, category, expense_date, created_at, synced, user_id',
      income: '++id, title, amount, source, income_date, created_at, synced, user_id',
      notes: '++id, title, content, created_at, updated_at, synced, user_id',
      goals: '++id, text, completed, goal_date, created_at, synced, user_id',
      bills: '++id, title, file_path, amount, bill_date, created_at, synced, user_id'
    });
  }
}

export const db = new OfflineDatabase();

// Utility functions for offline operations
export const offlineUtils = {
  // Check if app is online
  isOnline: () => navigator.onLine,

  // Save data with offline fallback
  async saveWithOfflineSupport<T extends { synced: boolean; user_id?: string }>(
    table: Table<T>,
    data: Omit<T, 'id' | 'synced'>,
    onlineAction: () => Promise<void>
  ) {
    try {
      if (this.isOnline()) {
        await onlineAction();
        // If online save succeeds, mark as synced
        await table.add({ ...data, synced: true } as T);
      } else {
        // Save locally and mark as unsynced
        await table.add({ ...data, synced: false } as T);
      }
    } catch (error) {
      // If online fails, save locally
      await table.add({ ...data, synced: false } as T);
      throw error;
    }
  },

  // Get all unsynced items
  async getUnsyncedItems<T extends { synced: boolean }>(table: Table<T>) {
    return await table.where('synced').equals(0).toArray();
  },

  // Mark item as synced
  async markAsSynced<T>(table: Table<T>, id: number) {
    await table.update(id, { synced: 1 } as any);
  }
};