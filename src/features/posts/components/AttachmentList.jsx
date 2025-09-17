import { useEffect, useState } from "react";
import { retrieveFile } from "@/features/files/api/files.api";

export default function AttachmentList({ attachments = [] }) {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const out = [];
            for (const att of attachments) {
                try {
                    const { downloadUrl } = await retrieveFile(att.objectKey);
                    out.push(downloadUrl);
                } catch {
                    out.push(null);
                }
            }
            if (!cancelled) setUrls(out);
        })();
        return () => { cancelled = true; };
    }, [JSON.stringify(attachments)]);

    if (!attachments.length) return null;

    const openUrl = (url) => {
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <ul className="list-unstyled m-0 p-0">
            {attachments.map((att, i) => (
                <li key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div className="flex-grow-1 text-start text-truncate me-3">
                        <div className="fw-semibold text-truncate">{att.filename || att.objectKey}</div>
                        <div className="small text-muted">
                            {att.contentType} • {att.sizeBytes ? (att.sizeBytes / 1024 / 1024).toFixed(2) : "?"} MB
                        </div>
                    </div>
                    <div className="ms-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => openUrl(urls[i])}
                            disabled={!urls[i]}
                            aria-disabled={!urls[i]}
                        >
                            Download
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}