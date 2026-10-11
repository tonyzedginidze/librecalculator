import { ui } from "@open-calculators/i18n/ui";
import { useEffect, useRef, useState } from "react";

// Videos are large, so they stream instead of shipping in the app. Point
// VITE_VIDEO_BASE_URL at the R2 public bucket/domain; until then, use the site.
const VIDEO_BASE: string = (
  import.meta.env.VITE_VIDEO_BASE_URL ?? "https://videos.librecalculator.com"
).replace(/\/$/, "");

type Chapter = { id: string; title: string; start: number };

const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function VideoPane(props: { id: string }) {
  const base = `${VIDEO_BASE}/${props.id}/en`;
  const video = useRef<HTMLVideoElement>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reload per calculator
  useEffect(() => {
    setFailed(false);
    setChapters([]);
    setNow(0);
    let live = true;
    fetch(`${base}.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((meta) => {
        if (live && Array.isArray(meta?.chapters)) setChapters(meta.chapters);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [props.id]);

  if (failed) {
    return (
      <div className="dk-pad dk-video-empty">
        <strong>{ui["ui.video.unavailable"]}</strong>
        <p>{ui["ui.video.unavailable.hint"]}</p>
        <button type="button" onClick={() => setFailed(false)}>
          {ui["ui.video.retry"]}
        </button>
      </div>
    );
  }

  const current = [...chapters]
    .reverse()
    .find((chapter) => chapter.start <= now + 0.25);

  return (
    <div className="dk-pad dk-video">
      <video
        key={props.id}
        ref={video}
        controls
        preload="metadata"
        playsInline
        poster={`${base}.jpg`}
        src={`${base}.mp4`}
        onError={() => setFailed(true)}
        onTimeUpdate={(event) => setNow(event.currentTarget.currentTime)}
      >
        <track kind="captions" />
      </video>
      {chapters.length > 0 ? (
        <ol className="dk-chapters">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                data-active={current?.id === chapter.id}
                onClick={() => {
                  if (!video.current) return;
                  video.current.currentTime = chapter.start;
                  void video.current.play();
                }}
              >
                <span>{chapter.title}</span>
                <time>{clock(chapter.start)}</time>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
