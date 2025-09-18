import { useState, useEffect } from "react";
import { useGetProfileQuery } from "../store/users.slice";
import { useSelector } from "react-redux";

import { resendVerificationEmail } from "../users.api";

// Format ISO date string to readable format for display
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

// Avatar component: shows profile image if available, otherwise generates initials
const Avatar = ({ imageUrl, firstName, lastName }) => {
  const [imageError, setImageError] = useState(false);
  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();

  // Reset image error when imageUrl changes
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt="Profile"
        className="rounded-circle border object-fit-cover"
        style={{ width: 96, height: 96 }}
        onError={() => setImageError(true)}
      />
    );
  }
  // Fallback: colored circle with initials
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
      style={{
        width: 96,
        height: 96,
        background:
          "linear-gradient(135deg, var(--bs-primary), var(--bs-indigo))",
        fontSize: "2rem",
      }}
      aria-label="Generated avatar"
    >
      {initials || "?"}
    </div>
  );
};

// Skeleton placeholder for loading states
const Skeleton = ({ width = 120, height = 20, className = "" }) => (
  <div
    className={`bg-secondary bg-opacity-25 rounded placeholder-wave ${className}`}
    style={{ width, height }}
  />
);

import { getUserIdFromToken } from "../utils/authUtils";

// Main profile header component
// - Extracts userId from token
// - Fetches profile data
// - Shows avatar, name, and email verification badge
// - Handles loading and error states
const ProfileHeader = () => {
  const userId = getUserIdFromToken(); // Used for API call
  const { data, isLoading, error } = useGetProfileQuery(userId); // RTK Query for profile
  const profile = data?.profile || {};
  const emailVerified = useSelector((state) => state.auth.user?.emailVerified); // Redux state for email verification

  return (
    <section className="card shadow-sm">
      <div className="card-body d-flex gap-3">
        <div>
          {/* Show skeleton while loading, otherwise avatar */}
          {isLoading ? (
            <Skeleton
              width={96}
              height={96}
              className="placeholder rounded-circle"
            />
          ) : (
            <Avatar
              imageUrl={profile?.profileImageUrl}
              firstName={profile?.firstName}
              lastName={profile?.lastName}
            />
          )}
        </div>

        <div className="flex-grow-1">
          <div>
            {/* Show skeleton, error, or profile info */}
            {isLoading ? (
              <Skeleton width={180} height={28} />
            ) : error ? (
              <span className="text-danger fw-semibold" role="alert">
                Error loading profile
              </span>
            ) : (
              <>
                <h2 className="h4 mb-1">
                  {/* Capitalize first/last name, show verification badge */}
                  {profile.firstName
                    ? profile.firstName.charAt(0).toUpperCase() +
                      profile.firstName.slice(1)
                    : ""}{" "}
                  {profile.lastName
                    ? profile.lastName.charAt(0).toUpperCase() +
                      profile.lastName.slice(1)
                    : ""}
                  {emailVerified === false && (
                    <span
                      className="badge text-bg-warning align-middle"
                      aria-label="Email unverified"
                    >
                      Unverified
                    </span>
                  )}
                  {emailVerified === true && (
                    <span
                      className="badge text-bg-success align-middle"
                      aria-label="Email verified"
                    >
                      Verified
                    </span>
                  )}

      {emailVerified === false && (<button onClick={resendVerificationEmail} disabled={emailVerified}>
        Send Verification Email
      </button>)}

                </h2>
                {/* Show member since date below name and badge */}
                <div className="small text-muted mt-1">
                  Member since{" "}
                  {profile.dateJoined ? formatDate(profile.dateJoined) : "-"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
