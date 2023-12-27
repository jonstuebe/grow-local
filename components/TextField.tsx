import { FC, PropsWithChildren, Ref, forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { Div, Text, useTheme } from "react-native-magnus";
import { iOSColors } from "react-native-typography";

export interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FieldContainer: FC<PropsWithChildren<{ error?: string }>> = ({
  error,
  children,
}) => {
  return (
    <Div>
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
      {error ? (
        <Div px="lg" pb="lg" alignItems="flex-end">
          <Text fontSize="sm" color={iOSColors.red}>
            {error}
          </Text>
        </Div>
      ) : null}
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

export const TextField = forwardRef(function TextField(
  { label, error, ...props }: TextFieldProps,
  ref: Ref<TextInput>
) {
  const {
    theme: { fontFamily, fontSize },
  } = useTheme();

  return (
    <FieldContainer error={error}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        ref={ref}
        style={{
          color: "white",
          fontFamily: fontFamily?.normal,
          fontSize: fontSize?.lg,
        }}
        {...props}
      />
    </FieldContainer>
  );
});
