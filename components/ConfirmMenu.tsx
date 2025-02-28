import { MenuView } from "@react-native-menu/menu";
import { ReactNode } from "react";

export function ConfirmMenu({
  children,
  title,
  onConfirm,
  confirmTitle = "Delete",
  confirmDestructive = true,
  cancelTitle = "Cancel",
}: {
  children: ReactNode;
  title?: string;
  onConfirm: () => void;
  confirmTitle?: string;
  confirmDestructive?: boolean;
  cancelTitle?: string;
}) {
  return (
    <MenuView
      title={title}
      onPressAction={({ nativeEvent: { event: id } }) => {
        if (id === "destructive") {
          onConfirm();
        }
      }}
      actions={[
        {
          id: "destructive",
          title: confirmTitle,
          attributes: {
            destructive: confirmDestructive,
          },
        },
        {
          id: "cancel",
          title: cancelTitle,
        },
      ]}
    >
      {children}
    </MenuView>
  );
}
