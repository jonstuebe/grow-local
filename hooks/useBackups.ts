import { File } from "expo-file-system/next";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import SuperJSON from "superjson";

import { backupData, getBackups } from "../data";
import { rootStore } from "../state";

export function useBackups() {
  const [backups, setBackups] = useState<File[]>([]);

  const refetchBackups = useCallback(() => {
    setBackups(getBackups());
  }, []);

  useEffect(() => {
    refetchBackups();
  }, []);

  const createBackup = useCallback(() => {
    try {
      backupData(getSnapshot(rootStore).items);
      refetchBackups();
      Toast.show({
        autoHide: true,
        position: "bottom",
        type: "success",
        text1: "Backup Successful",
      });
    } catch {
      Toast.show({
        autoHide: true,
        position: "bottom",
        type: "error",
        text1: "Backup Failed",
      });
    }
  }, [refetchBackups]);

  const deleteBackup = useCallback(
    (file: File) => {
      if (file.exists) {
        file.delete();
        refetchBackups();
      }
    },
    [refetchBackups]
  );

  const restoreBackup = useCallback((backup: File) => {
    const data = SuperJSON.parse(backup.text());
    applySnapshot(rootStore.items, data);
  }, []);

  return {
    backups,
    restoreBackup,
    createBackup,
    refetchBackups,
    deleteBackup,
  };
}
