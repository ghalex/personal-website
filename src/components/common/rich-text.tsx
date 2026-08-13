import { Fragment } from "react";

type RichTextProps = {
  text: string;
};

const renderBoldSegments = (text: string) =>
  text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );

/** Renders a string with `**bold**` segments and `[label](url)` links. */
export function RichText({ text }: RichTextProps) {
  return (
    <>
      {text.split(/(\[[^\]]*\]\([^)]+\))/).map((part, index) => {
        const link = /^\[([^\]]*)\]\(([^)]+)\)$/.exec(part);
        if (link)
          return (
            <a key={index} href={link[2]} className="link">
              {renderBoldSegments(link[1])}
            </a>
          );
        return <Fragment key={index}>{renderBoldSegments(part)}</Fragment>;
      })}
    </>
  );
}
