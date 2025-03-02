import { Directory, File, Paths } from "expo-file-system/next";
import { applySnapshot, ModelSnapshotType } from "mobx-state-tree";
import SuperJSON from "superjson";
import { rootStore } from "./state";

export type AppData = ModelSnapshotType<any>;

export const dataDir = new Directory(Paths.join(Paths.document, "grow"));
export const dataFile = new File(dataDir, "db.json");
export const backupDir = new Directory(dataDir, "backups");

export function backupData(data: AppData) {
  const backupDir = new Directory(dataDir, "backups");

  if (!backupDir.exists) {
    backupDir.create();
  }

  const backupFile = new File(backupDir, `${Date.now()}.db.json`);

  backupFile.write(SuperJSON.stringify(data));
}

export function getBackups() {
  return backupDir
    .list()
    .filter((item) => {
      return item instanceof File;
    })
    .sort((a, b) => {
      return (
        Number(b.name.replace(".db.json", "")) -
        Number(a.name.replace(".db.json", ""))
      );
    }) as File[];
}

export function clearBackups() {
  backupDir.delete();
}

export function getData(): AppData | null {
  if (!dataFile.exists) return null;

  const data = dataFile.text();
  return SuperJSON.parse(data) as AppData;
}

export function saveData(data: AppData) {
  if (!dataDir.exists) dataDir.create();
  if (!dataFile.exists) dataFile.create();

  dataFile.write(SuperJSON.stringify(data));
}
