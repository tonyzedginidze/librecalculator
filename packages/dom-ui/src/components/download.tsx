import { formatMessage } from "@open-calculators/i18n/locales";
import { ui } from "@open-calculators/i18n/ui";
import { type ReactNode, useEffect, useState } from "react";
import { repositoryUrl } from "../catalog";
import {
  type DesktopOs,
  type DownloadOption,
  detectPlatform,
  downloadOptions,
  fetchLatestRelease,
  megabytes,
  type Platform,
  type Release,
  recommended,
  refineArch,
  releasesUrl,
} from "../download";

const systems: readonly DesktopOs[] = ["mac", "windows", "linux"];

/** Simple Icons (CC0) for Apple and Tux, Material Design Icons for Windows. */
const osPaths: Record<DesktopOs, string> = {
  mac: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04c-2.04.027-3.91 1.183-4.961 3.014c-2.117 3.675-.546 9.103 1.519 12.09c1.013 1.454 2.208 3.09 3.792 3.039c1.52-.065 2.09-.987 3.935-.987c1.831 0 2.35.987 3.96.948c1.637-.026 2.676-1.48 3.676-2.948c1.156-1.688 1.636-3.325 1.662-3.415c-.039-.013-3.182-1.221-3.22-4.857c-.026-3.04 2.48-4.494 2.597-4.559c-1.429-2.09-3.623-2.324-4.39-2.376c-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83c-1.207.052-2.662.805-3.532 1.818c-.78.896-1.454 2.338-1.273 3.714c1.338.104 2.715-.688 3.559-1.701",
  windows:
    "M3 12V6.75l6-1.32v6.48zm17-9v8.75l-10 .15V5.21zM3 13l6 .09v6.81l-6-1.15zm17 .25V22l-10-1.91V13.1z",
  linux:
    "M12.504 0q-.232 0-.48.021c-4.226.333-3.105 4.807-3.17 6.298c-.076 1.092-.3 1.953-1.05 3.02c-.885 1.051-2.127 2.75-2.716 4.521c-.278.832-.41 1.684-.287 2.489a.4.4 0 0 0-.11.135c-.26.268-.45.6-.663.839c-.199.199-.485.267-.797.4c-.313.136-.658.269-.864.68c-.09.189-.136.394-.132.602c0 .199.027.4.055.536c.058.399.116.728.04.97c-.249.68-.28 1.145-.106 1.484c.174.334.535.47.94.601c.81.2 1.91.135 2.774.6c.926.466 1.866.67 2.616.47c.526-.116.97-.464 1.208-.946c.587-.003 1.23-.269 2.26-.334c.699-.058 1.574.267 2.577.2c.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071s1.592-.536 2.257-1.306c.631-.765 1.683-1.084 2.378-1.503c.348-.199.629-.469.649-.853c.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926c-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.36.36 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694c-.533-1.41-1.465-2.638-2.175-3.483c-.796-1.005-1.576-1.957-1.56-3.368c.026-2.152.236-6.133-3.544-6.139m.529 3.405h.013c.213 0 .396.062.584.198c.19.135.33.332.438.533c.105.259.158.459.166.724c0-.02.006-.04.006-.06v.105l-.004-.021l-.004-.024a1.8 1.8 0 0 1-.15.706a.95.95 0 0 1-.213.335a1 1 0 0 0-.088-.042c-.104-.045-.198-.064-.284-.133a1.3 1.3 0 0 0-.22-.066c.05-.06.146-.133.183-.198q.08-.193.088-.402v-.02a1.2 1.2 0 0 0-.061-.4c-.045-.134-.101-.2-.183-.333c-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 0 0-.205.334a1.2 1.2 0 0 0-.09.4v.019q.002.134.02.267c-.193-.067-.438-.135-.607-.202a2 2 0 0 1-.018-.2v-.02a1.8 1.8 0 0 1 .15-.768a1.08 1.08 0 0 1 .43-.533a1 1 0 0 1 .594-.2zm-2.962.059h.036c.142 0 .27.048.399.135c.146.129.264.288.344.465c.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024c-.152.055-.274.135-.393.2q.018-.136.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.6.6 0 0 0-.166-.267a.25.25 0 0 0-.183-.064h-.021c-.071.006-.13.04-.186.132a.55.55 0 0 0-.12.27a1 1 0 0 0-.023.33v.015c.012.135.037.2.08.334c.046.134.098.2.166.268q.014.014.034.024c-.07.057-.117.07-.176.136a.3.3 0 0 1-.131.068a2.6 2.6 0 0 1-.275-.402a1.8 1.8 0 0 1-.155-.667a1.8 1.8 0 0 1 .08-.668a1.4 1.4 0 0 1 .283-.535c.128-.133.26-.2.418-.2m1.37 1.706c.332 0 .733.065 1.216.399c.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.57.57 0 0 1 .016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465c-.276.135-.588.292-1.012.267a1.1 1.1 0 0 1-.448-.067a4 4 0 0 1-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71q-.104-.403.193-.6c.224-.135.38-.271.483-.336c.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601c.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473c.286.534.855 1.659 1.102 3.024c.156-.005.33.018.513.064c.646-1.671-.546-3.467-1.089-3.966c-.22-.2-.232-.335-.123-.335c.59.534 1.365 1.572 1.646 2.757c.13.535.16 1.104.021 1.67c.067.028.135.06.205.067c1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224c-.915-.4-1.646-.336-1.77.465c-.008.043-.013.066-.018.135c-.068.023-.139.053-.209.064c-.43.268-.662.669-.793 1.187c-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35c-1.5 1.072-3.58 1.538-5.348.334a2.7 2.7 0 0 0-.402-.533a1.5 1.5 0 0 0-.275-.333c.182 0 .338-.03.465-.067a.62.62 0 0 0 .314-.334c.108-.267 0-.697-.345-1.163s-.931-.995-1.788-1.521c-.63-.4-.986-.87-1.15-1.396c-.165-.534-.143-1.085-.015-1.645c.245-1.07.873-2.11 1.274-2.763c.107-.065.037.135-.408.974c-.396.751-1.14 2.497-.122 3.854a8.1 8.1 0 0 1 .647-2.876c.564-1.278 1.743-3.504 1.836-5.268c.048.036.217.135.289.202c.218.133.38.333.59.465c.21.201.477.335.876.335q.058.005.11.006c.412 0 .73-.134.997-.268c.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377c.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876c.085.4.154.78.409 1.066c.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595c-.63.401-1.746.712-2.457 1.57c-.618.737-1.37 1.14-2.036 1.191c-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69c.176-.668.428-1.344.463-1.897c.037-.714.076-1.335.195-1.814c.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01q.08 0 .157.014c.376.055.706.333 1.023.752l.91 1.664l.003.003c.243.533.754 1.064 1.189 1.637c.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294c-.645.135-1.52.002-2.395-.464c-.968-.536-2.118-.469-2.857-.602q-.553-.1-.723-.4c-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118c-.055-.401-.083-.71.043-.94c.16-.334.396-.4.69-.533c.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838c.19-.201.38-.336.663-.336m7.159-9.074c-.435.201-.945.535-1.488.535c-.542 0-.97-.267-1.28-.466c-.154-.134-.28-.268-.373-.335c-.164-.134-.144-.333-.074-.333c.109.016.129.134.199.2c.096.066.215.2.36.333c.292.2.68.467 1.167.467c.485 0 1.053-.267 1.398-.466c.195-.135.445-.334.648-.467c.156-.136.149-.267.279-.267c.128.016.034.134-.147.332a8 8 0 0 1-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05c.074-.043.18-.027.26.004c.063 0 .16.067.15.135c-.006.049-.085.066-.135.066c-.055 0-.092-.043-.141-.068c-.052-.018-.146-.008-.163-.065m-.551 0c-.02.058-.113.049-.166.066c-.047.025-.086.068-.14.068c-.05 0-.13-.02-.136-.068c-.01-.066.088-.133.15-.133c.08-.031.184-.047.259-.005c.019.009.036.03.03.05v.02h.003z",
};

export function OsIcon(props: { os: DesktopOs | "other" }) {
  return (
    <svg className="oc-os-icon" viewBox="0 0 24 24" aria-hidden="true">
      {props.os === "other" ? (
        <path
          className="oc-os-icon-line"
          d="M3.5 5.5h17v10h-17zM9 19.5h6M12 15.5v4"
        />
      ) : (
        <path d={osPaths[props.os]} />
      )}
    </svg>
  );
}

function DownloadGlyph(props: { className: string }) {
  return (
    <svg className={props.className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
    </svg>
  );
}

const osName = (os: DesktopOs) => ui[`ui.download.os.${os}`];
const archName = (option: DownloadOption) =>
  ui[`ui.download.arch.${option.arch}`];

/** Detects the visitor's system and loads the latest release once mounted. */
function useDesktopRelease() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [release, setRelease] = useState<Release | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    const guess = detectPlatform(navigator);
    setPlatform(guess);
    refineArch(guess).then((refined) => live && setPlatform(refined));
    fetchLatestRelease().then(
      (latest) => live && setRelease(latest),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, []);
  const options = release ? downloadOptions(release) : [];
  const best = platform ? recommended(options, platform) : undefined;
  return { platform, release, failed, options, best };
}

/** Sidebar card: one click downloads the installer for this computer. */
export function SidebarDownload() {
  const { best } = useDesktopRelease();
  return (
    <div className="oc-side-download-wrap">
      <a className="oc-side-download-all" href="/download/">
        {ui["ui.download.sidebar.all"]}
        <span aria-hidden="true"> →</span>
      </a>
      <a
        className="oc-side-download"
        href={best?.asset.url ?? "/download/"}
        data-ready={best ? "" : undefined}
      >
        <span className="oc-side-download-mark">
          <OsIcon os={best?.os ?? "other"} />
        </span>
        <span className="oc-side-download-copy">
          <strong>{ui["ui.download.sidebar.title"]}</strong>
          <span>
            {best
              ? formatMessage(ui["ui.download.sidebar.for"], {
                  os: osName(best.os),
                  size: megabytes(best.asset.size),
                })
              : ui["ui.download.sidebar.text"]}
          </span>
        </span>
        <DownloadGlyph className="oc-side-download-arrow" />
      </a>
    </div>
  );
}

/** The download page: the recommended installer, an illustration passed as
 * children, then every other installer. */
export function DownloadPanel(props: { children?: ReactNode }) {
  const { platform, release, failed, options, best } = useDesktopRelease();
  const [started, setStarted] = useState(false);
  const os = platform?.os ?? "other";
  const detected = os === "other" ? undefined : os;
  const primaryOs = best?.os ?? detected;

  let details: string = ui["ui.download.unavailable"];
  if (best && release) {
    details = formatMessage(ui["ui.download.details"], {
      version: release.version,
      arch: archName(best),
      size: megabytes(best.asset.size),
    });
  } else if (platform && !failed) {
    details = ui["ui.download.loading"];
  }

  return (
    <div className="oc-download">
      <div className="oc-download-cta">
        {platform && os === "other" ? (
          <p className="oc-download-mobile">{ui["ui.download.mobile"]}</p>
        ) : (
          <a
            className="oc-download-primary"
            href={best?.asset.url ?? releasesUrl}
            aria-busy={platform && !release && !failed ? true : undefined}
            onClick={() => best && setStarted(true)}
          >
            <span className="oc-download-primary-icon">
              <OsIcon os={primaryOs ?? "other"} />
            </span>
            <span className="oc-download-primary-copy">
              <strong>
                {primaryOs
                  ? formatMessage(ui["ui.download.for"], {
                      os: osName(primaryOs),
                    })
                  : ui["ui.download.all"]}
              </strong>
              <span>{details}</span>
            </span>
            <DownloadGlyph className="oc-download-primary-glyph" />
          </a>
        )}
        <a className="oc-download-other" href="#oc-download-all">
          <span className="oc-download-other-icons" aria-hidden="true">
            {systems.map((system) => (
              <OsIcon key={system} os={system} />
            ))}
          </span>
          {ui["ui.download.otherLink"]}
          <span aria-hidden="true"> ↓</span>
        </a>
        <output className="oc-download-started">
          {started ? ui["ui.download.started"] : ""}
        </output>
      </div>

      {props.children ? (
        <figure className="oc-download-hero">{props.children}</figure>
      ) : null}

      <section
        className="oc-download-section"
        aria-labelledby="oc-download-all"
      >
        <h2 id="oc-download-all" className="oc-download-heading">
          {ui["ui.download.other"]}
        </h2>
        <div className="oc-download-systems">
          {systems.map((system) => {
            const rows = options.filter((option) => option.os === system);
            return (
              <article
                key={system}
                className="oc-download-system"
                data-current={detected === system ? "" : undefined}
              >
                <header className="oc-download-system-head">
                  <span className="oc-download-system-mark">
                    <OsIcon os={system} />
                  </span>
                  <span>
                    <h3>{osName(system)}</h3>
                    <span>{ui[`ui.download.req.${system}`]}</span>
                  </span>
                  {detected === system ? (
                    <span className="oc-download-badge">
                      {ui["ui.download.recommended"]}
                    </span>
                  ) : null}
                </header>
                {rows.length > 0 ? (
                  <ul className="oc-download-files">
                    {rows.map((option) => (
                      <li key={option.asset.name}>
                        <a
                          href={option.asset.url}
                          onClick={() => setStarted(true)}
                        >
                          <span className="oc-download-file-copy">
                            <span className="oc-download-file-format">
                              {ui[`ui.download.format.${option.format}`]}
                            </span>
                            <span className="oc-download-file-meta">
                              {archName(option)} ·{" "}
                              {formatMessage(ui["ui.download.size"], {
                                size: megabytes(option.asset.size),
                              })}
                            </span>
                          </span>
                          <DownloadGlyph className="oc-download-file-glyph" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <a className="oc-download-fallback" href={releasesUrl}>
                    {failed || !platform
                      ? ui["ui.download.unavailable"]
                      : ui["ui.download.loading"]}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="oc-download-section"
        aria-labelledby="oc-download-first-run"
      >
        <h2 id="oc-download-first-run" className="oc-download-heading">
          {ui["ui.download.firstRun.heading"]}
        </h2>
        <p className="oc-download-note">{ui["ui.download.firstRun.intro"]}</p>
        <ul className="oc-download-steps">
          {systems.map((system) => (
            <li
              key={system}
              data-current={detected === system ? "" : undefined}
            >
              <OsIcon os={system} />
              <span>{ui[`ui.download.firstRun.${system}`]}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="oc-download-meta">
        {release ? (
          <span>
            {formatMessage(ui["ui.download.version"], {
              version: release.version,
            })}
          </span>
        ) : null}
        <a href={release?.pageUrl ?? releasesUrl} rel="noopener">
          {ui["ui.download.notes"]}
        </a>
        <a
          href={
            release?.assets.find((asset) => asset.name === "SHA256SUMS.txt")
              ?.url ?? releasesUrl
          }
          rel="noopener"
        >
          {ui["ui.download.checksums"]}
        </a>
        <a href={`${repositoryUrl}/blob/main/docs/releasing.md`} rel="noopener">
          {ui["ui.download.source"]}
        </a>
      </p>
    </div>
  );
}
