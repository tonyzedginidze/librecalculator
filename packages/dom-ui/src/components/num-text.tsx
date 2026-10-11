const NUMBER = /([-−+]?\d[\d,]*(?:\.\d+)?%?)/;

/** Text with its numerals set in the mono face, so figures line up and stand out. */
export function NumText(props: { text: string }) {
  let offset = 0;
  return (
    <>
      {props.text.split(NUMBER).map((part, index) => {
        const key = `${offset}-${part.length}`;
        offset += part.length;
        return index % 2 === 1 ? (
          <span className="oc-num" key={key}>
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
}
