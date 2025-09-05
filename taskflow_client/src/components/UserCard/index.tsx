/* eslint-disable @next/next/no-img-element */
import { User } from "@/state/api";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  // --- FIX STARTS HERE ---
  // Add a guard clause to handle cases where the user prop might be undefined.
  // This prevents the "Cannot read properties of undefined" error.
  if (!user) {
    return null; // Don't render anything if there's no user data.
  }
  // --- FIX ENDS HERE ---

  // 1. Check if the profilePictureUrl is a valid, absolute URL using optional chaining.
  const isValidUrl =
    user?.profilePictureUrl &&
    (user.profilePictureUrl.startsWith("http://") ||
      user.profilePictureUrl.startsWith("https://"));

  // 2. Prepare a fallback placeholder URL.
  const placeholderUrl = `https://placehold.co/32x32/EFEFEF/333333?text=${
    user?.username ? user.username[0].toUpperCase() : "A"
  }`;

  // 3. Use the valid URL or the placeholder.
  const imageUrl = isValidUrl ? user.profilePictureUrl : placeholderUrl;

  return (
    <div className="flex items-center gap-4 rounded border p-4 shadow">
      {/* Replaced Next.js Image with a standard img tag to resolve the error */}
      <img
        src={imageUrl}
        alt={user?.username ? `${user.username}'s profile picture` : "Profile picture"}
        width={32}
        height={32}
        className="rounded-full"
        // Add an onError handler to fall back to the placeholder
        // in case the valid URL still leads to a broken image.
        onError={(e) => {
          (e.target as HTMLImageElement).src = placeholderUrl;
        }}
      />
      <div>
        <h3 className="font-semibold">{user?.username}</h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserCard;

