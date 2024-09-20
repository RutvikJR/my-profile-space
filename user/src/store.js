import { create } from "zustand";
import { supabaseClient } from "./config/supabaseConfig.js";

const userStore = create((set, get) => ({
  // State properties
  id: null,
  skills: [],
  services: [],
  education: [],
  experience: [],
  faqs: [],
  testimonials: [],
  projects: [],
  userSocials: [],
  platformSocials: [],
  userSettings: [],
  userDetails: [],
  theme: null,

  // Setters
  setUserId: (userId) => set({ id: userId }),
  setSkills: (skills) => set({ skills }),
  setServices: (services) => set({ services }),
  setEducation: (education) => set({ education }),
  setExperience: (experience) => set({ experience }),
  setFaqs: (faqs) => set({ faqs }),
  setTestimonials: (testimonials) => set({ testimonials }),
  setProjects: (projects) => set({ projects }),
  setUserSocials: (userSocials) => set({ userSocials }),
  setPlatformSocials: (platformSocials) => set({ platformSocials }),
  setUserSettings: (userSettings) => set({ userSettings }),
  setUserDetails: (userDetails) => set({ userDetails }),
  setTheme: (theme) => set({ theme }),

  // Load functions with user_id validation
  loadSkills: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadSkills.");

    const { data, error } = await supabaseClient
      .from("skills")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Skills: ${error.message}`);
    } else {
      set({ skills: data });
    }
  },

  loadServices: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadServices.");

    const { data, error } = await supabaseClient
      .from("services")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Services: ${error.message}`);
    } else {
      set({ services: data });
    }
  },

  loadEducation: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadEducation.");

    const { data, error } = await supabaseClient
      .from("education")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Education: ${error.message}`);
    } else {
      set({ education: data });
    }
  },

  loadExperience: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadExperience.");

    const { data, error } = await supabaseClient
      .from("experience")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Experience: ${error.message}`);
    } else {
      set({ experience: data });
    }
  },

  loadFaqs: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadFaqs.");

    const { data, error } = await supabaseClient
      .from("faqs")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching FAQs: ${error.message}`);
    } else {
      set({ faqs: data });
    }
  },

  loadTestimonials: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadTestimonials.");

    const { data, error } = await supabaseClient
      .from("testimonials")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Testimonials: ${error.message}`);
    } else {
      set({ testimonials: data });
    }
  },

  loadProjects: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadProjects.");

    const { data, error } = await supabaseClient
      .from("projects")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching Projects: ${error.message}`);
    } else {
      set({ projects: data });
    }
  },

  loadUserSocials: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadUserSocials.");

    const { data, error } = await supabaseClient
      .from("user_socials")
      .select(`id, url, social_id, platform_socials(fa_class, li_class, name)`)
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching User Socials: ${error.message}`);
    } else {
      set({ userSocials: data });
    }
  },

  loadPlatformSocials: async () => {
    const { data, error } = await supabaseClient
      .from("platform_socials")
      .select();
    if (error) {
      console.error(`Error fetching Platform Socials: ${error.message}`);
    } else {
      set({ platformSocials: data });
    }
  },

  loadUserSettings: async () => {
    const { data, error } = await supabaseClient.from("user_setting").select();
    if (error) {
      console.error(`Error fetching User Settings: ${error.message}`);
    } else {
      set({ userSettings: data });
    }
  },

  loadUserDetails: async () => {
    const userId = get().id;
    if (!userId)
      return console.warn("User ID is undefined, skipping loadUserDetails.");

    const { data, error } = await supabaseClient
      .from("user_details")
      .select()
      .eq("user_id", userId);
    if (error) {
      console.error(`Error fetching User Details: ${error.message}`);
    } else {
      set({ userDetails: data });
    }
  },

  // Load all data function
  loadAllData: async (userId) => {
    if (!userId) {
      console.error("User ID is undefined, aborting data load.");
      return;
    }

    set({ id: userId });

    await Promise.all([
      get().loadSkills(),
      get().loadServices(),
      get().loadEducation(),
      get().loadExperience(),
      get().loadFaqs(),
      get().loadTestimonials(),
      get().loadProjects(),
      get().loadUserSocials(),
      get().loadPlatformSocials(),
      get().loadUserSettings(),
      get().loadUserDetails(),
    ]);

    // Set the theme after loading user settings
    get().setThemeFromUserSettings();
  },

  // Function to set theme from userSettings based on the current user ID
  setThemeFromUserSettings: () => {
    const userId = get().id;
    const userSettings = get().userSettings;

    if (!userId) {
      console.warn("User ID is undefined, skipping theme setting.");
      return;
    }

    if (!userSettings || userSettings.length === 0) {
      console.warn(
        "User settings are empty or undefined. Skipping theme setting."
      );
      return;
    }

    // Find the user setting that matches the current user ID
    const currentUserSetting = userSettings.find(
      (setting) => setting.user_id === userId
    );

    if (!currentUserSetting || !currentUserSetting.theme_color) {
      console.warn(
        "Theme color is not found for the current user in user settings. Skipping theme setting."
      );
      return;
    }

    // Set the theme in the store
    set({ theme: currentUserSetting.theme_color });
  },
}));

export default userStore;
