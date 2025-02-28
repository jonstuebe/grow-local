import { Children, Fragment, ReactNode } from "react";
import { View } from "react-native";

import { theme } from "../theme";

export function FieldGroup({
  children,
  showDividers = true,
}: {
  children: ReactNode;
  showDividers?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.gray700,
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
      }}
    >
      {Children.map(children, (child, index) => {
        const isLastItem = index + 1 === Children.count(children);

        return (
          <Fragment key={index}>
            {child}
            {showDividers && !isLastItem ? (
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: theme.colors.gray600,
                  opacity: 0.5,
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
