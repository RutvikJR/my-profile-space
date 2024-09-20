export const themeConfig = {
  FullScreenMenu: "Full Screen Menu",
  StandardMenu: "Standard Menu",
  BottomHeader: "Bottom Header",
};

export const introBackgroundConfig = {
  default: "default",
  image: "image",
  video: "video",
};

export const appliedConfig = {
  // apply theme from : FullScreenMenu | StandardMenu | BottomHeader
  appliedTheme: themeConfig.StandardMenu,

  // apply Intro from : default | image | video
  appliedIntro: introBackgroundConfig.default,
};

export const scrollDuration = 1000;
