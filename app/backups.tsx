import { formatRelative, fromUnixTime } from "date-fns";
import { useRouter } from "expo-router";
import { upperFirst } from "lodash-es";
import {
  ActionSheetIOS,
  StyleProp,
  Switch,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { List } from "../components/List";
import Row from "../components/List/Row";
import Section from "../components/List/Section";
import { clearBackups } from "../data";
import { useBackups } from "../hooks/useBackups";
import { useScreenHeader } from "../hooks/useScreenHeader";
import { theme } from "../theme";
import { useSwitch } from "../hooks/useSwitch";

// function AutoBackups({ style }: { style?: StyleProp<ViewStyle> }) {
//   const switchProps = useSwitch();

//   return (
//     <Row.Container style={style}>
//       <Row.Content>
//         <Row.Label>Auto Backups</Row.Label>
//         <Row.Label color="secondary" variant="subtitle">
//           every 24 hours
//         </Row.Label>
//       </Row.Content>
//       <Row.Trailing>
//         <Switch {...switchProps} />
//       </Row.Trailing>
//     </Row.Container>
//   );
// }

export default function Backups() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { backups, restoreBackup, createBackup, refetchBackups } = useBackups();

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
        <>
          {/* <AutoBackups
            style={{
              marginTop: theme.spacing.lg,
              marginHorizontal: 16,
            }}
          /> */}
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
        </>
      ) : (
        <ScrollView
          style={{ flex: 1, position: "relative" }}
          contentContainerStyle={{
            marginTop: theme.spacing.lg,
          }}
        >
          <List.Container>
            {/* <AutoBackups /> */}
            <Section.Container>
              <Section.Content>
                {backups.map((backup, idx) => {
                  return (
                    <Row.Container key={idx}>
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
                        <Button
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
                          variant="plain"
                          style={{
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                          }}
                          textStyle={{
                            fontWeight: "500",
                            fontSize: theme.fontSize.xl,
                          }}
                        >
                          Restore
                        </Button>
                      </Row.Trailing>
                    </Row.Container>
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
        <Button onPress={createBackup}>New Backup</Button>
      </View>
    </>
  );
}
