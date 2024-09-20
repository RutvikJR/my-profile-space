/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { supabaseClient } from "../config/supabaseConfig";
import { Tables } from "../types/supabase";

interface userStoreInterface {
  id: string | null;
  isInitializing: boolean;
  skills: Tables<"skills">[];
  experience: Tables<"experience">[];
  educations: Tables<"education">[];
  faqs: Tables<"faqs">[];
  services: Tables<"services">[];
  testimonials: Tables<"testimonials">[];
  projects: Tables<"projects">[];
  userSocials: Tables<"user_socials">[];
  userDetails: Tables<"user_details"> | null;
  userSettings: Tables<"user_setting"> | null;
  platformSocials: Tables<"platform_socials">[]; // Add this line
  setUserId: (userId: string) => void;
  initializeUser: () => Promise<void>;
  setSkills: (skills: Tables<"skills">[]) => void;
  loadSkills: () => Promise<void>;
  setExperience: (experience: Tables<"experience">[]) => void;
  loadExperiences: () => Promise<void>;
  setEducation: (educations: Tables<"education">[]) => void;
  loadEducations: () => Promise<void>;
  setFaqs: (faqs: Tables<"faqs">[]) => void;
  loadFaqs: () => Promise<void>;
  setServices: (services: Tables<"services">[]) => void;
  loadServices: () => Promise<void>;
  setTestimonials: (testimonials: Tables<"testimonials">[]) => void;
  loadTestimonials: () => Promise<void>;
  setProjects: (projects: Tables<"projects">[]) => void;
  loadProjects: () => Promise<void>;
  setUserSocials: (userSocials: Tables<"user_socials">[]) => void;
  loadUserSocials: () => Promise<void>;
  setPlatformSocials: (platformSocials: Tables<"platform_socials">[]) => void; // Add this line
  loadPlatformSocials: () => Promise<void>; // Add this line
  loadUserDetails: () => Promise<void>;
  setUserDetails: (userDetails: Tables<"user_details">) => void;
  loadUserSettings: () => Promise<void>;
  setUserSettings: (userSettings: Tables<"user_setting">) => void;
}

const userStore = create<userStoreInterface>((set) => ({
  id: null,
  isInitializing: true,
  skills: [],
  experience: [],
  educations: [],
  faqs: [],
  services: [],
  testimonials: [],
  projects: [],
  userSocials: [],
  userDetails: null,
  userSettings: null,
  platformSocials: [], // Add this line
  setUserId: (userId: string) => set(() => ({ id: userId })),
  initializeUser: async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    }
    if (data.user?.id) {
      set({ id: data.user.id, isInitializing: false });
    } else {
      set({ isInitializing: false });
    }
  },
  setFaqs: (faqs: Tables<"faqs">[]) => set({ faqs }),
  loadFaqs: async () => {
    const { data, error } = await supabaseClient
      .from("faqs")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log(`Error fetching FAQs: ${error}`);
    } else {
      userStore.getState().setFaqs(data);
    }
  },
  setServices: (services: Tables<"services">[]) => set({ services }),
  loadServices: async () => {
    const { data, error } = await supabaseClient
      .from("services")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching Services: " + error);
    } else {
      userStore.getState().setServices(data);
    }
  },
  setSkills: (skills: Tables<"skills">[]) => set({ skills }),
  loadSkills: async () => {
    const { data, error } = await supabaseClient
      .from("skills")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching skills: " + error);
    } else {
      userStore.getState().setSkills(data);
    }
  },
  setEducation: (educations: Tables<"education">[]) => set({ educations }),
  loadEducations: async () => {
    const { data, error } = await supabaseClient
      .from("education")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching education: " + error);
    } else {
      userStore.getState().setEducation(data);
    }
  },
  setExperience: (experience: Tables<"experience">[]) => set({ experience }),
  loadExperiences: async () => {
    const { data, error } = await supabaseClient
      .from("experience")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching experience: " + error);
    } else {
      userStore.getState().setExperience(data);
    }
  },
  setTestimonials: (testimonials: Tables<"testimonials">[]) =>
    set({ testimonials }),
  loadTestimonials: async () => {
    const { data, error } = await supabaseClient
      .from("testimonials")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching testimonials: " + error);
    } else {
      userStore.getState().setTestimonials(data);
    }
  },
  setProjects: (projects: Tables<"projects">[]) => set({ projects }),
  loadProjects: async () => {
    const { data, error } = await supabaseClient
      .from("projects")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log("Error fetching projects: " + error);
    } else {
      userStore.getState().setProjects(data);
    }
  },
  setUserSocials: (userSocials: Tables<"user_socials">[]) =>
    set({ userSocials }),
  loadUserSocials: async () => {
    const { data, error } = await supabaseClient
      .from("user_socials")
      .select()
      .eq("user_id", userStore.getState().id ?? "");

    if (error) {
      console.log(`Error fetching User Social Media Details: ${error}`);
    } else {
      userStore.getState().setUserSocials(data);
    }
  },
  setPlatformSocials: (platformSocials: Tables<"platform_socials">[]) =>
    set({ platformSocials }), // Add this line
  loadPlatformSocials: async () => {
    const { data, error } = await supabaseClient
      .from("platform_socials")
      .select("*");
    if (error) {
      console.log(`Error fetching Platform Socials: ${error}`);
    } else {
      userStore.getState().setPlatformSocials(data);
    }
  },
  setUserDetails: (userDetails: Tables<"user_details">) => set({ userDetails }),
  loadUserDetails: async () => {
    const { data, error } = await supabaseClient
      .from("user_details")
      .select()
      .eq("user_id", userStore.getState().id ?? "")
      .single();

    if (error) {
      console.log("Error fetching user details: " + error);
    } else {
      userStore.getState().setUserDetails(data);
    }
  },
  setUserSettings: (userSettings: Tables<"user_setting">) =>
    set({ userSettings }),
  loadUserSettings: async () => {
    const { data, error } = await supabaseClient
      .from("user_setting")
      .select()
      .eq("user_id", userStore.getState().id ?? "")
      .single();

    if (error) {
      console.log("Error fetching projects: " + error);
    } else {
      userStore.getState().setUserSettings(data);
    }
  },

  // add your other state properties here
}));


export default userStore;
