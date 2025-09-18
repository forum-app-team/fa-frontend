import { useState } from "react";
import ReplyForm from "./ReplyForm";

function userInfo(map, userId) {
    const u = map?.[userId];
    if (!u) return { displayName: "Unknown user" };
    if (typeof u === "string") {
        return { displayName: u, email: u };
    }
    const first = u.firstName ?? null;
    const last  = u.lastName ?? null;
    const displayName = (first || last)
        ? `${first ?? ""} ${last ?? ""}`.trim()
        : (u.username ?? u.email ?? "Unknown user");
    const avatarUrl =
        u.profileImageUrl ?? null;
    const email = u.email ?? null;
    return { displayName, avatarUrl, email, first, last };
}

function initialsOf(name, email) {
    if (name && name.trim()) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? "";
        const last  = parts.length > 1 ? parts.at(-1)[0] : "";
        const text = `${first}${last}`.toUpperCase();
        if (text) return text;
    }
    return (email?.[0] || "U").toUpperCase();
}

export default function ReplyList({
                                      nodes = [],
                                      names = {},
                                      meId,
                                      meRole,
                                      postOwnerId,
                                      canReply,
                                      onCreate,
                                      onUpdate,
                                      onDelete,
                                  }) {
    const isAdmin = (role) => role === "admin" || role === "super";

    return (
        <ul className="list-unstyled m-0 p-0">
            {nodes.map((n) => (
                <ReplyNode
                    key={n.id}
                    node={n}
                    names={names}
                    meId={meId}
                    meRole={meRole}
                    postOwnerId={postOwnerId}
                    canReply={canReply}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    isAdmin={isAdmin(meRole)}
                />
            ))}
        </ul>
    );
}

function ReplyNode({
                       node,
                       names,
                       meId,
                       meRole,
                       postOwnerId,
                       canReply,
                       onCreate,
                       onUpdate,
                       onDelete,
                       isAdmin,
                   }) {
    const [replying, setReplying] = useState(false);
    // const [editing, setEditing] = useState(false);

    // const canEdit = meId && meId === node.userId;
    const canDelete = !!(meId && (meId === node.userId || isAdmin || meId === postOwnerId));

    return (
        <li className="py-3">
            <div className="d-flex justify-content-between align-items-start  border-bottom">
                <div className="flex-grow-1 text-start me-3">
                    {/* Author */}
                    <div className="d-flex align-items-start gap-2 mb-1">
                        <div className="rounded-circle overflow-hidden bg-light border flex-shrink-0" style={{ width: 32, height: 32 }}>
                            {userInfo(names, node.userId).avatarUrl ? (
                                <img
                                    src={userInfo(names, node.userId).avatarUrl}  // S3 public URL is fine
                                    alt={userInfo(names, node.userId).displayName || "User avatar"}
                                    width="32" height="32"
                                    style={{ objectFit: "cover", width: 32, height: 32 }}
                                />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
                        <span className="small fw-semibold">
                          {initialsOf(userInfo(names, node.userId).displayName, userInfo(names, node.userId).email)}
                        </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <div className="fw-semibold">{userInfo(names, node.userId).displayName}</div>
                            <div className="text-muted small">{new Date(node.createdAt).toLocaleString()}</div>
                        </div>
                    </div>


                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{node.content}</p>
                </div>

                <div className="d-flex gap-2 align-self-start">
                    {canReply && (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setReplying((v) => !v)}
                            title="Reply to this comment"
                        >
                            Reply
                        </button>
                    )}

                    {canDelete && (
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                                if (!window.confirm("Delete this reply?")) return;
                                await onDelete(node.id);
                            }}
                            title="Delete this comment"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {replying && (
                <div className="mt-2">
                    <ReplyForm
                        submitLabel="Reply"
                        placeholder="Write a reply..."
                        onSubmit={async (val) => {
                            await onCreate(node.id, val);
                            setReplying(false);
                        }}
                        onCancel={() => setReplying(false)}
                    />
                </div>
            )}

            {node.children?.length ? (
                <div className="mt-3 ms-4 ps-3">
                    <ReplyList
                        nodes={node.children}
                        names={names}
                        meId={meId}
                        meRole={meRole}
                        postOwnerId={postOwnerId}
                        canReply={canReply}
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                </div>
            ) : null}
        </li>
    );
}
