// src/features/posts/components/ReplyList.jsx
import { useState } from "react";
import ReplyForm from "./ReplyForm";

function oneLineEmail(email = "unknown@user") {
    return email;
}

export default function ReplyThread({
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
                    <div className="fw-semibold">{oneLineEmail(names[node.userId])}</div>
                    <div className="text-muted small mb-1">{new Date(node.createdAt).toLocaleString()}</div>

                    {/*{!editing ? (*/}
                    {/*    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{node.content}</p>*/}
                    {/*) : (*/}
                    {/*    <div className="mt-2">*/}
                    {/*        <ReplyForm*/}
                    {/*            initialValue={node.content}*/}
                    {/*            submitLabel="Save"*/}
                    {/*            onSubmit={async (val) => {*/}
                    {/*                await onUpdate(node.id, val);*/}
                    {/*                setEditing(false);*/}
                    {/*            }}*/}
                    {/*            onCancel={() => setEditing(false)}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*)}*/}
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
                    {/*{canEdit && (*/}
                    {/*    <button*/}
                    {/*        className="btn btn-sm btn-secondary"*/}
                    {/*        onClick={() => setEditing((v) => !v)}*/}
                    {/*        title="Edit this comment"*/}
                    {/*    >*/}
                    {/*        Edit*/}
                    {/*    </button>*/}
                    {/*)}*/}
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
                    <ReplyThread
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
