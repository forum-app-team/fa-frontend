import { useGetProfileQuery } from "../store/users.slice";
import { useSelector } from "react-redux";

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

const Avatar = ({ imageUrl, firstName, lastName }) => {
  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Profile"
        className="rounded-circle border object-fit-cover"
        style={{ width: 96, height: 96 }}
      />
    );
  }
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

const Skeleton = ({ width = 120, height = 20, className = "" }) => (
  <div
    className={`bg-secondary bg-opacity-25 rounded placeholder-wave ${className}`}
    style={{ width, height }}
  />
);

import { jwtDecode } from "jwt-decode";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.user_id || decoded.id || null;
  } catch {
    return null;
  }
};

const ProfileHeader = () => {
  const userId = getUserIdFromToken();
  const { data, isLoading, error } = useGetProfileQuery(userId);
  const profile = data?.profile;
  const emailVerified = useSelector((state) => state.auth.user?.emailVerified);

  return (
    <section className="card shadow-sm">
      <div className="card-body d-flex gap-3">
        <div>
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
            {isLoading ? (
              <Skeleton width={180} height={28} />
            ) : error ? (
              <span className="text-danger fw-semibold">
                Error loading profile
              </span>
            ) : (
              <>
                <h2 className="h4 mb-1">
                  {profile.firstName?.charAt(0).toUpperCase() +
                    profile.firstName?.slice(1)}{" "}
                  {profile.lastName?.charAt(0).toUpperCase() +
                    profile.lastName?.slice(1)}{" "}
                  {emailVerified === false && (
                    <span className="badge text-bg-warning align-middle">
                      Unverified
                    </span>
                  )}
                  {emailVerified === true && (
                    <span className="badge text-bg-success align-middle">
                      Verified
                    </span>
                  )}
                </h2>
                {/* Move member since below name and badge */}
                <div className="small text-muted mt-1">
                  Member since {formatDate(profile.dateJoined)}
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
