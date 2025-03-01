import { MenuAction, NativeActionEvent } from "@react-native-menu/menu";
import { useState, useCallback, useMemo } from "react";

type OnPressAction = (event: NativeActionEvent) => void;

export function useTrailingMenu({
  actions,
  initialSelectedId,
  defaultLabel = "Select",
  disabled = false,
}: {
  actions: MenuAction[];
  initialSelectedId?: string;
  defaultLabel?: string;
  disabled?: boolean;
}): {
  label: string;
  actions: MenuAction[];
  disabled: boolean;
  onPressAction: OnPressAction;
  selectedId: string | undefined;
  reset: () => void;
} {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId
  );
  const onPressAction = useCallback<OnPressAction>(
    ({ nativeEvent: { event: id } }) => {
      if (id === selectedId) {
        setSelectedId(undefined);
      } else {
        setSelectedId(id);
      }
    },
    [selectedId]
  );

  const label = useMemo(() => {
    return (
      actions.find((action) => action.id === selectedId)?.title ?? defaultLabel
    );
  }, [actions, selectedId, defaultLabel]);

  const reset = useCallback(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  return {
    label,
    actions: actions.map((action) => ({
      ...action,
      state: action.id === selectedId ? "on" : "off",
    })),
    onPressAction,
    selectedId,
    reset,
    disabled,
  };
}
