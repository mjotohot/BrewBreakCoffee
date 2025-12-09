const avatarColors = [
  "#E91E63",
  "#9C27B0",
  "#2196F3",
  "#FF9800",
  "#4CAF50",
  "#F44336",
  "#00BCD4",
  "#FFC107",
];

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "??";
  const names = name
    .trim()
    .split(" ")
    .filter((n) => n.length > 0);
  if (names.length === 0) return "??";
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
};

export const getAvatarColor = (index) => {
  return avatarColors[index % avatarColors.length];
};
