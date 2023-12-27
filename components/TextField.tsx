import { FC, PropsWithChildren } from "react";
import { TextInputProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Div, Text, useTheme } from "react-native-magnus";

export interface TextFieldProps extends TextInputProps {
  label: string;
}

export const FieldContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Div
      bg="gray700"
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      py="lg"
      px="lg"
    >
      {children}
    </Div>
  );
};

export const FieldLabel: FC<{ children: string }> = ({ children }) => {
  return (
    <Text color="white" fontSize="lg" fontWeight="500">
      {children}
    </Text>
  );
};

export function TextField({ label, ...props }: TextFieldProps) {
  const {
    theme: { fontFamily, fontSize },
  } = useTheme();

  return (
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        style={{
          color: "white",
          fontFamily: fontFamily?.normal,
          fontSize: fontSize?.lg,
        }}
        {...props}
      />
    </FieldContainer>
  );
}
