import { TextInputProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Div, Text, useTheme } from "react-native-magnus";

export interface TextFieldProps extends TextInputProps {
  label: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  const {
    theme: { fontFamily, fontSize },
  } = useTheme();

  return (
    <Div
      bg="gray700"
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      py="lg"
      px="lg"
    >
      <Text color="white" fontSize="lg">
        {label}
      </Text>
      <TextInput
        style={{
          color: "white",
          fontFamily: fontFamily?.normal,
          fontSize: fontSize?.lg,
        }}
        {...props}
      />
    </Div>
  );
}
