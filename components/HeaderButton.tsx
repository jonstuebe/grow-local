import { Button } from "./Button";

export function HeaderButton({
  title,
  onPress,
  destructive,
  disabled,
}: {
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="plain"
      fontWeight="500"
      padding={false}
      destructive={destructive}
      onPress={onPress}
      disabled={disabled}
    >
      {title}
    </Button>
  );
}
