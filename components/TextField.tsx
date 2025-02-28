import { FC, PropsWithChildren, Ref, forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

import { theme } from "../theme";
export interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FieldContainer: FC<PropsWithChildren<{ error?: string }>> = ({
  error,
  children,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {children}
      </View>
      {error ? (
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.lg,
            alignItems: "flex-end",
          }}
        >
          <Text style={[iOSUIKit.body, { color: iOSColors.red }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

export const FieldLabel: FC<{ children: string }> = ({ children }) => {
  return <Text style={[iOSUIKit.body, { color: "white" }]}>{children}</Text>;
};

export const TextField = forwardRef(function TextField(
  { label, error, ...props }: TextFieldProps,
  ref: Ref<TextInput>
) {
  return (
    <FieldContainer error={error}>
      <FieldLabel>{label}</FieldLabel>

      <View
        style={{
          minHeight: 31,
          justifyContent: "center",
        }}
      >
        <TextInput
          ref={ref}
          style={[
            iOSUIKit.body,
            {
              color: theme.colors.gray100,
            },
          ]}
          {...props}
        />
      </View>
    </FieldContainer>
  );
});
