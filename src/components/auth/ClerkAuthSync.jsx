"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "@/store/authSlice";
import axios from "axios";

export default function ClerkAuthSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const currentClerkId =
        authUser?.user?.user?.clerkId ||
        authUser?.user?.clerkId ||
        authUser?.clerkId;
      const currentEmail =
        authUser?.user?.user?.email ||
        authUser?.user?.email ||
        authUser?.email;

      // Only sync if not already synced for this Clerk user
      const isAlreadySynced =
        currentClerkId === user.id ||
        (currentEmail && email && currentEmail.toLowerCase() === email.toLowerCase());

      if (!isAlreadySynced && !syncingRef.current) {
        syncingRef.current = true;

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://taal-backend-yjs9.onrender.com/api/v1";

        const syncWithMongoDB = async () => {
          try {
            const name =
              user.fullName ||
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              email?.split("@")[0] ||
              "User";
            const phone = user.primaryPhoneNumber?.phoneNumber;
            const profilePic = user.imageUrl;

            // Fetch clerk session token
            let clerkToken = null;
            try {
              clerkToken = await getToken();
            } catch (tErr) {
              console.warn("Could not get clerk session token:", tErr);
            }

            const response = await axios.post(
              `${apiUrl}/user/sync-clerk-user`,
              {
                clerkId: user.id,
                email,
                name,
                phone,
                profilePic,
              },
              {
                headers: clerkToken
                  ? { Authorization: `Bearer ${clerkToken}` }
                  : {},
              }
            );

            if (response.data?.success && response.data?.data) {
              const { user: mongoUser, token } = response.data.data;
              dispatch(
                loginUser({
                  ...mongoUser,
                  token,
                })
              );
            }
          } catch (err) {
            console.error("Error synchronizing Clerk user with MongoDB:", err);
          } finally {
            syncingRef.current = false;
          }
        };

        syncWithMongoDB();
      }
    } else if (!isSignedIn && authUser?.isAuthenticated) {
      // User signed out in Clerk, sync local state
      dispatch(logoutUser());
    }
  }, [isLoaded, isSignedIn, user, authUser, dispatch, getToken]);

  return null;
}
