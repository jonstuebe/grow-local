import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { formatRelative, fromUnixTime } from "date-fns";
import * as BackgroundTask from "expo-background-task";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { upperFirst } from "lodash-es";
import { ActionSheetIOS, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { List } from "../components/List";
import Row from "../components/List/Row";
import Section from "../components/List/Section";
import { PressableOpacity } from "../components/PressableOpacity";
import { clearBackups } from "../data";
import { useBackups } from "../hooks/useBackups";
import { useScreenHeader } from "../hooks/useScreenHeader";
import { useSwitch } from "../hooks/useSwitch";
import { registerTasks, unregisterTasks } from "../tasks";
import { theme } from "../theme";

function BackupScheduleField() {
  const [status, setStatus] = useState<
    BackgroundTask.BackgroundTaskStatus | undefined
  >();
  const { getItem, setItem, removeItem } = useAsyncStorage("backupSchedule");
  const { switchProps, setSwitch } = useSwitch(false, async (enabled) => {
    try {
      if (enabled) {
        await registerTasks();
        await setItem("true");
      } else {
        await unregisterTasks();
        await removeItem();
      }
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getItem().then((enabled) => {
      const newValue = enabled === "true" ? true : false;
      if (switchProps.value !== newValue) {
        setSwitch(newValue);
      }
    });
  }, [switchProps.value]);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = useCallback(async () => {
    setStatus(await BackgroundTask.getStatusAsync());
  }, []);

  return (
    <Row.Container>
      <Row.Content>
        <Row.Label>Automatic Backups</Row.Label>
        <Row.Label color="secondary" variant="subtitle">
          {status === BackgroundTask.BackgroundTaskStatus.Available
            ? "Every Week"
            : "Unsupported on This Device"}
        </Row.Label>
      </Row.Content>
      <Row.Trailing>
        <Row.Switch
          {...switchProps}
          disabled={
            switchProps.value === false &&
            status === BackgroundTask.BackgroundTaskStatus.Restricted
          }
        />
      </Row.Trailing>
    </Row.Container>
  );
}

export default function Backups() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { backups, restoreBackup, createBackup, deleteBackup, refetchBackups } =
    useBackups();

  useScreenHeader({
    headerLeftActions:
      backups.length > 0
        ? [
            {
              label: "Delete",
              color: theme.colors.red,
              onPress: () => {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: ["Cancel", "Clear"],
                    title: "Are you sure?",
                    message: "This action cannot be undone.",
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: 1,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 1) {
                      clearBackups();
                      refetchBackups();
                    }
                  }
                );
              },
            },
          ]
        : undefined,
    headerRightActions: [
      {
        label: "Done",
        onPress: () => {
          router.back();
        },
      },
    ],
  });

  return (
    <>
      {backups.length === 0 ? (
        <View
          style={{
            marginTop: theme.spacing.lg,
            paddingHorizontal: 16,
          }}
        >
          <BackupScheduleField />
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: theme.spacing.lg,
                color: theme.colors.gray200,
                fontSize: theme.fontSize["2xl"],
              }}
            >
              No Backups Found
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          style={{
            flex: 1,
            position: "relative",
          }}
          contentContainerStyle={{
            marginTop: theme.spacing.lg,
            paddingBottom: (insets.bottom > 0 ? insets.bottom : 16) + 64,
          }}
        >
          <List.Container>
            <BackupScheduleField />
            <Section.Container>
              <Section.Content>
                {backups.map((backup, idx) => {
                  return (
                    <Row.SwipeableContainer
                      overshootRight={false}
                      overshootLeft={false}
                      renderLeftActions={(prog, drag, actions) => (
                        <PressableOpacity
                          onPress={async () => {
                            actions.close();
                            await Sharing.shareAsync(backup.uri, {
                              dialogTitle: "Share Backup",
                              UTI: "public.json",
                              mimeType: "application/json",
                            });
                          }}
                          style={{
                            backgroundColor: theme.colors.blue,
                            justifyContent: "center",
                            paddingHorizontal: theme.spacing.lg,
                          }}
                        >
                          <Text
                            style={[
                              iOSUIKit.body,
                              {
                                color: theme.colors.white,
                                fontWeight: "500",
                              },
                            ]}
                          >
                            Share
                          </Text>
                        </PressableOpacity>
                      )}
                      renderRightActions={(prog, drag, actions) => (
                        <PressableOpacity
                          onPress={() => {
                            actions.close();
                            deleteBackup(backup);
                          }}
                          style={{
                            backgroundColor: theme.colors.red,
                            justifyContent: "center",
                            paddingHorizontal: theme.spacing.lg,
                          }}
                        >
                          <Text
                            style={[
                              iOSUIKit.body,
                              {
                                color: theme.colors.white,
                                fontWeight: "500",
                              },
                            ]}
                          >
                            Delete
                          </Text>
                        </PressableOpacity>
                      )}
                      key={idx}
                    >
                      <Row.Label>
                        {upperFirst(
                          formatRelative(
                            fromUnixTime(
                              Number(backup.name.replace(".db.json", "")) / 1000
                            ),
                            new Date()
                          )
                        )}
                      </Row.Label>
                      <Row.Trailing>
                        <Row.Button
                          onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions(
                              {
                                options: ["Cancel", "Restore"],
                                title: "Restore from backup?",
                                message: "All existing data will be lost.",
                                cancelButtonIndex: 0,
                                destructiveButtonIndex: 1,
                              },
                              (buttonIndex) => {
                                if (buttonIndex === 1) {
                                  restoreBackup(backup);
                                  router.back();
                                }
                              }
                            );
                          }}
                        >
                          Restore
                        </Row.Button>
                      </Row.Trailing>
                    </Row.SwipeableContainer>
                  );
                })}
              </Section.Content>
            </Section.Container>
          </List.Container>
        </ScrollView>
      )}
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: insets.bottom > 0 ? insets.bottom : 16,
          left: 0,
          paddingHorizontal: 16,
        }}
      >
        <Button
          leftSymbol="square.and.arrow.down"
          variant="tinted"
          onPress={createBackup}
        >
          New Backup
        </Button>
      </View>
    </>
  );
}
