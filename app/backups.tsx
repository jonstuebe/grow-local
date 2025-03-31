import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { formatRelative, fromUnixTime } from "date-fns";
import * as BackgroundTask from "expo-background-task";
import { Stack, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { upperFirst } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { ActionSheetIOS, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  HeaderButton,
  ListContainer,
  PressableOpacity,
  RowButton,
  RowContainer,
  RowContent,
  RowLabel,
  RowSwitch,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SwipeableRowContainer,
  useRowSwitch,
  useTheme,
} from "react-native-orchard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { clearBackups } from "../data";
import { useBackups } from "../hooks/useBackups";
import { registerTasks, unregisterTasks } from "../tasks";

function BackupScheduleField() {
  const [status, setStatus] = useState<
    BackgroundTask.BackgroundTaskStatus | undefined
  >();
  const { getItem, setItem, removeItem } = useAsyncStorage("backupSchedule");
  const { switchProps, setSwitch } = useRowSwitch(false, async (enabled) => {
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
    <RowContainer>
      <RowContent>
        <RowLabel>Automatic Backups</RowLabel>
        <RowLabel color="secondary" variant="subtitle">
          {status === BackgroundTask.BackgroundTaskStatus.Available
            ? "Every Week"
            : "Unsupported on This Device"}
        </RowLabel>
      </RowContent>
      <RowTrailing>
        <RowSwitch
          {...switchProps}
          disabled={
            switchProps.value === false &&
            status === BackgroundTask.BackgroundTaskStatus.Restricted
          }
        />
      </RowTrailing>
    </RowContainer>
  );
}

export default function Backups() {
  const router = useRouter();
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { backups, restoreBackup, createBackup, deleteBackup, refetchBackups } =
    useBackups();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft:
            backups.length > 0
              ? () => (
                  <HeaderButton
                    title="Delete"
                    destructive
                    onPress={() => {
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
                    }}
                  />
                )
              : undefined,
          headerRight: () => (
            <HeaderButton title="Done" onPress={() => router.back()} />
          ),
        }}
      />
      {backups.length === 0 ? (
        <View
          style={{
            marginTop: spacing.lg,
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
                marginTop: spacing.lg,
                color: colors.gray,
                fontSize: typography.title3Regular.fontSize,
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
            marginTop: spacing.lg,
            paddingBottom: (insets.bottom > 0 ? insets.bottom : 16) + 64,
          }}
        >
          <ListContainer>
            <BackupScheduleField />
            <SectionContainer>
              <SectionContent>
                {backups.map((backup, idx) => {
                  return (
                    <SwipeableRowContainer
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
                            backgroundColor: colors.blue,
                            justifyContent: "center",
                            paddingHorizontal: spacing.lg,
                          }}
                        >
                          <Text
                            style={[
                              iOSUIKit.body,
                              {
                                color: colors.white,
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
                            backgroundColor: colors.red,
                            justifyContent: "center",
                            paddingHorizontal: spacing.lg,
                          }}
                        >
                          <Text
                            style={[
                              iOSUIKit.body,
                              {
                                color: colors.white,
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
                      <RowLabel>
                        {upperFirst(
                          formatRelative(
                            fromUnixTime(
                              Number(backup.name.replace(".db.json", "")) / 1000
                            ),
                            new Date()
                          )
                        )}
                      </RowLabel>
                      <RowTrailing>
                        <RowButton
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
                        </RowButton>
                      </RowTrailing>
                    </SwipeableRowContainer>
                  );
                })}
              </SectionContent>
            </SectionContainer>
          </ListContainer>
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
