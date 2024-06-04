import { create } from "zustand";
import { supabaseClient } from "../config/supabaseConfig";
import { Tables } from "../types/supabase";

interface userStoreInterface {
  id: string | null;
  isInitializing: boolean;
  skills: Tables<"skills">[];
  experience: Tables<"experience">[];
  education: Tables<"education">[];
  faqs: Tables<"faqs">[];
  testimonials: Tables<"testimonials">[];
  user_detail: Tables<"user_detail"> | null;
  setUserId: (userId: string) => void;
  initializeUser: () => Promise<void>;
}

const userStore = create<userStoreInterface>((set) => ({
  id: null,
  isInitializing: true,
  skills: [],
  experience: [],
  education: [],
  faqs: [],
  testimonials: [],
  user_detail: null,
  setUserId: (userId: string) => set((state) => ({ id: userId })),
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
  // add your other state properties here
}));

userStore.getState().initializeUser();

export default userStore;
