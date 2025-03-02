import { Directory, File, Paths } from "expo-file-system/next";
import { ModelSnapshotType } from "mobx-state-tree";
import SuperJSON from "superjson";

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
  if (!backupDir.exists) return [];

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
  if (backupDir.exists) {
    backupDir.delete();
  }
}

export function loadData(file: File) {
  if (!file.exists) return null;

  const data = file.text();
  return SuperJSON.parse(data) as AppData;
}

export function getData(): AppData | null {
  return loadData(dataFile);
}

export function saveData(data: AppData) {
  if (!dataDir.exists) dataDir.create();
  if (!dataFile.exists) dataFile.create();

  dataFile.write(SuperJSON.stringify(data));
}
