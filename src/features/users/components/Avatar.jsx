import { forwardRef, useMemo, useState } from "react";
import { Image, Placeholder, OverlayTrigger, Tooltip } from "react-bootstrap";

const cx = (...cls) => cls.filter(Boolean).join(" ");

const Avatar = forwardRef((
  {
    imageUrl,
    firstName,
    lastName,
    alt,
    size = 96,
    rounded = true,
    showTooltip = true,
    className,
  },
  ref
) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const fullName = useMemo(
    () => [firstName, lastName].filter(Boolean).join(" ").trim(),
    [firstName, lastName]
  );

  const initials = useMemo(() => {
    const f = (firstName?.[0] ?? "").toUpperCase();
    const l = (lastName?.[0] ?? "").toUpperCase();
    return (f + l) || "?";
  }, [firstName, lastName]);

  const dim = { width: size, height: size };
  const radiusClass = rounded ? "rounded-circle" : "rounded-3";
  const fontSize = Math.max(12, Math.floor(size * 0.4));

  const content = (() => {
    if (imageUrl && !errored) {
      return (
        <>
          {!loaded && (
            <Placeholder
              as="div"
              animation="wave"
              className={cx(
                "d-flex align-items-center justify-content-center",
                radiusClass,
                "bg-body-secondary"
              )}
              style={{ ...dim }}
            >
              <Placeholder xs={12} />
            </Placeholder>
          )}
          <Image
            src={imageUrl}
            alt={alt || fullName || "User avatar"}
            roundedCircle={rounded}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={cx(
              "border object-fit-cover position-absolute",
              !loaded && "invisible"
            )}
            style={{ ...dim }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </>
      );
    }

    return (
      <div
        className={cx(
          "d-flex align-items-center justify-content-center fw-semibold text-white border",
          radiusClass
        )}
        style={{
          ...dim,
          background:
            "linear-gradient(135deg, var(--bs-primary), var(--bs-indigo))",
          fontSize,
        }}
        role="img"
        aria-label={alt || fullName ? `Avatar: ${fullName}` : "Generated avatar"}
      >
        {initials}
      </div>
    );
  })();

  const wrapper = (
    <div
      ref={ref}
      className={cx("position-relative overflow-hidden", className)}
      style={dim}
    >
      {content}
    </div>
  );

  return showTooltip && fullName ? (
    <OverlayTrigger placement="top" overlay={<Tooltip>{fullName}</Tooltip>}>
      <span className="d-inline-block">{wrapper}</span>
    </OverlayTrigger>
  ) : (
    wrapper
  );
});

Avatar.defaultProps = {
  imageUrl: null,
  firstName: "",
  lastName: "",
  alt: undefined,
  size: 96,
  rounded: true,
  showTooltip: true,
  className: "",
};

export default Avatar;
