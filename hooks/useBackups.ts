import { useCallback, useState } from "react";

import { useEffect } from "react";
import { getBackups } from "../data";
import { File } from "expo-file-system/next";
import SuperJSON from "superjson";
import { rootStore } from "../state";
import { applySnapshot } from "mobx-state-tree";

export function useBackups() {
  const [backups, setBackups] = useState<File[]>([]);

  useEffect(() => {
    setBackups(getBackups());
  }, []);

  const restoreBackup = useCallback((backup: File) => {
    const data = SuperJSON.parse(backup.text());
    applySnapshot(rootStore.items, data);
  }, []);

  return { backups, restoreBackup };
}
