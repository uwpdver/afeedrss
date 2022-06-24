import { IPalette } from "@fluentui/theme";

export const getComponentsStyle = (palette: Partial<IPalette>) => {
  const inputStyles = [
    "rounded",
    {
      borderColor: palette.neutralQuaternaryAlt,
      borderBottomColor: palette.neutralSecondaryAlt,
      selectors: {
        ":hover": {
          borderColor: palette.neutralQuaternaryAlt,
          borderBottomColor: palette.neutralSecondaryAlt,
          backgroundColor: palette.neutralLighter,
        },
        ":focus": {
          backgroundColor: palette.white,
          outline: 0,
        },
      },
    },
  ];
  return {
    Modal: {
      styles: {
        main: [
          "rounded-lg",
          {
            backgroundColor: palette.neutralLighter,
          },
        ],
      },
    },
    Callout: {
      styles: {
        root: ["rounded-xl"],
      },
    },
    TextField: {
      styles: {
        fieldGroup: inputStyles,
      },
    },
    SearchBox: {
      styles: {
        root: inputStyles,
      },
    },
    DefaultButton: {
      styles: {
        root: [
          {
            borderRadius: "4px",
            borderColor: palette.neutralQuaternaryAlt,
            borderBottomColor: palette.neutralTertiaryAlt,
          },
        ],
        rootPressed: [
          {
            borderColor: palette.neutralQuaternaryAlt,
            color: palette.neutralTertiary,
          },
        ],
        rootFocused: [
          {
            outline: 0,
          },
        ],
      },
    },
    IconButton: {
      styles: {
        root: [
          {
            borderRadius: "4px",
          },
        ],
      },
    },
    PrimaryButton: {
      styles: {
        rootPressed: [
          {
            color: palette.white,
          },
        ],
      },
    },
    CommandBar: {
      styles: {
        root: [
          {
            background: "none",
            selectors: {
              "& .ms-Button--commandBar": {
                backgroundColor: "transparent",
              },
            },
          },
        ],
      },
    },
    OverflowSet: {
      styles: {
        item: {
          "& button": {
            borderRadius: 0,
          },
          "&:not(:first-child) button": {
            borderLeft: 0,
          },
          "&:first-child > button": {
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4,
          },
          "&:last-child > button": {
            borderBottomRightRadius: 4,
            borderTopRightRadius: 4,
          },
        },
      },
    },
    DetailsList: {
      styles: {
        root: [{}],
        headerWrapper: [
          {
            selectors: {
              "&>div": {
                backgroundColor: "transparent",
                borderColor: palette.neutralQuaternaryAlt,
              },
            },
          },
        ],
        contentWrapper: [
          {
            selectors: {
              "& .ms-DetailsRow": [
                {
                  backgroundColor: "transparent",
                  borderColor: palette.neutralQuaternaryAlt,
                },
              ],
            },
          },
        ],
      },
    },
    Dropdown: {
      styles: {
        title: [
          "rounded",
          {
            borderColor: palette.neutralQuaternaryAlt,
            borderBottomColor: palette.neutralTertiaryAlt,
            selectors: {
              ":hover": {
                borderColor: palette.neutralQuaternaryAlt,
                borderBottomColor: palette.neutralTertiaryAlt,
              },
              ":focus": {
                outline: 0,
              },
            },
          },
        ],
        dropdownItem: ["rounded"],
      },
    },
    ChoiceGroup: {
      styles: {
        root: [
          {
            selectors: {
              ".ms-ChoiceField.ms-ChoiceField--icon": {
                backgroundColor: palette.neutralLight,
                borderRadius: "5px",
              },
              "& label.ms-ChoiceField--icon": [
                {
                  borderRadius: "5px",
                },
              ],
            },
          },
        ],
      },
    },
    Separator: {
      styles: {
        root: {
          selectors: {
            "&::before": {
              backgroundColor: palette.neutralQuaternary,
            },
          },
        },
      },
    },
    Nav: {
      styles: {
        root: [
          {
            selectors: {
              "& .ms-Nav-compositeLink.is-selected .ms-Nav-link": {
                backgroundColor: palette.neutralQuaternaryAlt,
              },
              "& .ms-Nav-compositeLink.is-selected .ms-Nav-link::after": {
                backgroundColor: palette.themePrimary,
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "50%",
                borderRadius: "2px",
                border: 0,
                zIndex: 1,
              },
              "& .ms-Nav-link": {
                borderRadius: "6px",
              },
              "& .ms-Nav-compositeLink:hover .ms-Nav-link": {
                backgroundColor: palette.neutralQuaternaryAlt,
              },
              "& .ms-Nav-compositeLink.is-selected .ms-Nav-chevronButton": {
                backgroundColor: "transparent",
              },
              "& .ms-Nav-compositeLink.is-selected .ms-Nav-chevronButton::after":
                {
                  border: 0,
                },
            },
          },
        ],
        navItem: [
          {
            marginBottom: 4,
          },
        ],
        link: [
          {
            height: 40,
            lineHeight: 40,
          },
        ],
      },
    },
  };
};
