import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: false,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      console.log("No UID provided, resetting state.");
      return set({ currentUser: null, isLoading: false });
    }

    set({ isLoading: true }); 

    try {
      const docRef = doc(db, "usersCourses", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User found:", docSnap.data());

        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("User document does not exist.");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
