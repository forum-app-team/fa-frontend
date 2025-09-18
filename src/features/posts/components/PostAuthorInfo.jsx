import { Link } from "react-router-dom";
import { useGetProfileQuery } from "@/features/users/store/users.slice";
import { API_CONFIG } from "@/config/api.config";
import { PATHS } from "@/app/config/paths";

const PostAuthorInfo = ({ userId }) => {
    const { data, isLoading, isError } = useGetProfileQuery(userId, {
        skip: !userId,
    });

    const profile = data?.profile;
    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
    const initials = (profile?.firstName?.[0] || profile?.email?.[0] || "U").toUpperCase();


    const imageUrl = profile?.profileImageUrl || null;

    return (
        <section className="d-flex align-items-center gap-1">
            <div style={{ width: 24, height: 24 }} className="rounded-circle overflow-hidden bg-light border" >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={fullName || profile?.email || "User avatar"}
                        width="48"
                        height="48"
                        style={{ objectFit: "cover", width: 24, height: 24 }}
                    />
                ) : (
                    <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
                        <span className="fw-semibold">{initials}</span>
                    </div>
                )}
            </div>

            <div className="d-flex flex-column">
                <span className="fw-semibold">{fullName || profile?.email || "Unknown user"}</span>
                {isError && <span className="small text-danger">Couldn't load author</span>}
            </div>

            {isLoading && !profile && (
                <div className="placeholder-glow flex-grow-1">
                    <span className="placeholder col-2"></span>
                </div>
            )}
        </section>
    );
};

export default PostAuthorInfo;