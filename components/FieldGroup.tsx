import { Children, Fragment, ReactNode } from "react";
import { Div } from "react-native-magnus";

export function FieldGroup({
  children,
  showDividers = true,
}: {
  children: ReactNode;
  showDividers?: boolean;
}) {
  return (
    <Div bg="gray700" rounded="md" overflow="hidden">
      {Children.map(children, (child, index) => {
        const isLastItem = index + 1 === Children.count(children);

        return (
          <Fragment key={index}>
            {child}
            {showDividers && !isLastItem ? (
              <Div h={1} w="100%" bg="gray600" />
            ) : null}
          </Fragment>
        );
      })}
    </Div>
  );
}
