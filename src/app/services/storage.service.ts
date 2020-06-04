import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  async store(storageKey: string, value: any) {
    await Storage.set({
      key: storageKey,
      value: JSON.stringify(value)
    });
  }

  async get(storageKey: string) {
    const res = await Storage.get({ key: storageKey });

    if (res.value) {
      return JSON.parse(res.value);
    }

    return false;
  }

  async removeItem(storageKey: string) {
    await Storage.remove({ key: storageKey });
  }

  async clear() {
    await Storage.clear();
  }
}
