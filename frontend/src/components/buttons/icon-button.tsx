import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { buttonPalette, buttonStyles } from "@/components/buttons/button.styles";
import type { ButtonVariant } from "@/components/buttons/button.types";

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: Exclude<ButtonVariant, "danger"> | "danger";
  disabled?: boolean;
  size?: number;
};

export const IconButton = ({ icon, onPress, variant = "secondary", disabled = false, size = 18 }: IconButtonProps) => {
  const isDisabled = disabled;
  const iconColor = isDisabled
    ? buttonPalette.disabled.text
    : variant === "primary"
      ? buttonPalette.primary.text
      : variant === "danger"
        ? buttonPalette.danger.text
        : variant === "ghost"
          ? buttonPalette.ghost.text
          : buttonPalette.secondary.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        buttonStyles.surfaceBase,
        buttonStyles.iconOnly,
        buttonStyles[variant],
        pressed && !isDisabled && buttonStyles.pressed,
        isDisabled && buttonStyles.disabled
      ]}
    >
      <Ionicons name={icon} size={size} color={iconColor} />
    </Pressable>
  );
};
