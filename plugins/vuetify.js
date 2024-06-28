import "vuetify/styles";
// import "material-design-icons-iconfont/dist/material-design-icons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { createVuetify } from "vuetify";

const lightTheme = {
    dark: false,
    colors: {
        primary: "#5A5891",
        surfaceTint: "#5A5891",
        onPrimary: "#FFFFFF",
        primaryContainer: "#E3DFFF",
        onPrimaryContainer: "#16134A",
        secondary: "#5E5C71",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#E3E0F9",
        onSecondaryContainer: "#1A1A2C",
        tertiary: "#7A5368",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FFD8EA",
        onTertiaryContainer: "#2F1123",
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
        background: "#FCF8FF",
        onBackground: "#1C1B21",
        surface: "#FCF8FF",
        onSurface: "#1C1B21",
        surfaceVariant: "#E4E1EC",
        onSurfaceVariant: "#47464F",
        outline: "#787680",
        outlineVariant: "#C8C5D0",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#313036",
        inverseOnSurface: "#F3EFF7",
        inversePrimary: "#C3C0FF",
        primaryFixed: "#E3DFFF",
        onPrimaryFixed: "#16134A",
        primaryFixedDim: "#C3C0FF",
        onPrimaryFixedVariant: "#434078",
        secondaryFixed: "#E3E0F9",
        onSecondaryFixed: "#1A1A2C",
        secondaryFixedDim: "#C7C4DD",
        onSecondaryFixedVariant: "#464559",
        tertiaryFixed: "#FFD8EA",
        onTertiaryFixed: "#2F1123",
        tertiaryFixedDim: "#EAB9D1",
        onTertiaryFixedVariant: "#603B4F",
        surfaceDim: "#DCD8E0",
        surfaceBright: "#FCF8FF",
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: "#F6F2FA",
        surfaceContainer: "#F0ECF4",
        surfaceContainerHigh: "#EAE7EF",
        surfaceContainerHighest: "#E5E1E9"
    }
};

const darkTheme = {
    dark: true,
    colors: {
        primary: "#C3C0FF",
        surfaceTint: "#C3C0FF",
        onPrimary: "#2C2960",
        primaryContainer: "#434078",
        onPrimaryContainer: "#E3DFFF",
        secondary: "#C7C4DD",
        onSecondary: "#2F2E42",
        secondaryContainer: "#464559",
        onSecondaryContainer: "#E3E0F9",
        tertiary: "#EAB9D1",
        onTertiary: "#472639",
        tertiaryContainer: "#603B4F",
        onTertiaryContainer: "#FFD8EA",
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFDAD6",
        background: "#131318",
        onBackground: "#E5E1E9",
        surface: "#131318",
        onSurface: "#E5E1E9",
        surfaceVariant: "#47464F",
        onSurfaceVariant: "#C8C5D0",
        outline: "#928F9A",
        outlineVariant: "#47464F",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#E5E1E9",
        inverseOnSurface: "#313036",
        inversePrimary: "#5A5891",
        primaryFixed: "#E3DFFF",
        onPrimaryFixed: "#16134A",
        primaryFixedDim: "#C3C0FF",
        onPrimaryFixedVariant: "#434078",
        secondaryFixed: "#E3E0F9",
        onSecondaryFixed: "#1A1A2C",
        secondaryFixedDim: "#C7C4DD",
        onSecondaryFixedVariant: "#464559",
        tertiaryFixed: "#FFD8EA",
        onTertiaryFixed: "#2F1123",
        tertiaryFixedDim: "#EAB9D1",
        onTertiaryFixedVariant: "#603B4F",
        surfaceDim: "#131318",
        surfaceBright: "#39383F",
        surfaceContainerLowest: "#0E0E13",
        surfaceContainerLow: "#1C1B21",
        surfaceContainer: "#201F25",
        surfaceContainerHigh: "#2A292F",
        surfaceContainerHighest: "#35343A"
    }
};

export default createVuetify({
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: "light",
        themes: {
            light: lightTheme,
            dark: darkTheme
        }
    }
});
