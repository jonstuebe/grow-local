import { formatRelative, fromUnixTime } from "date-fns";
import { useRouter } from "expo-router";
import { upperFirst } from "lodash-es";
import { ActionSheetIOS } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "../components/Button";
import { List } from "../components/List";
import Row from "../components/List/Row";
import Section from "../components/List/Section";
import { useBackups } from "../hooks/useBackups";
import { useScreenHeader } from "../hooks/useScreenHeader";
import { theme } from "../theme";
import { clearBackups } from "../data";

export default function Backups() {
  const router = useRouter();
  const { backups, restoreBackup } = useBackups();

  useScreenHeader({
    headerLeftActions: [
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
              }
            }
          );
        },
      },
    ],
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
    <ScrollView style={{ flex: 1 }}>
      <List.Container
        style={{
          marginTop: theme.spacing.lg,
        }}
      >
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
                        fontSize: theme.fontSize.lg,
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
  );
}
