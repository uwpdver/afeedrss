import { mergeStyleSets, useTheme } from "@fluentui/react";

export const useThemeStyles = () => {
  const theme = useTheme();
  const { palette } = theme;
  return mergeStyleSets({
    contentLayer: [
      "border-l",
      {
        backgroundColor: palette.neutralLighter,
        borderColor: palette.neutralQuaternaryAlt,
      },
    ],
    articleText: [
      {
        color: palette.neutralPrimary,
      },
    ],
  });
};