use std::str::FromStr;

use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

use crate::{integrations, settings};

pub const DEFAULT_SHORTCUT: &str = "CommandOrControl+Shift+C";

pub fn backend_availability() -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        if std::env::var("XDG_SESSION_TYPE")
            .is_ok_and(|session| session.eq_ignore_ascii_case("wayland"))
        {
            return Err(
                "Global shortcuts are unsupported in this Wayland session; use the main window or system tray"
                    .into(),
            );
        }

        if std::env::var_os("DISPLAY").is_none() {
            return Err(
                "Global shortcuts require an X11 display on Linux; use the main window or system tray"
                    .into(),
            );
        }
    }

    Ok(())
}

pub fn initialize(app: &AppHandle) {
    let state = app.state::<integrations::IntegrationState>();
    let saved = match settings::load_shortcut(app) {
        Ok(shortcut) => shortcut,
        Err(error) => {
            let status = set(app, &state, DEFAULT_SHORTCUT);
            if let Ok(status) = status {
                integrations::update_shortcut(
                    app,
                    status.shortcut_value,
                    Some(format!(
                        "Saved shortcut settings could not be read; using the default shortcut: {error}"
                    )),
                );
            }
            return;
        }
    };

    if let Some(shortcut) = saved {
        if let Err(error) = set(app, &state, &shortcut) {
            eprintln!("Global shortcut is unavailable: {error}");
        }
    } else {
        integrations::update_shortcut(app, None, None);
    }
}

pub fn set(
    app: &AppHandle,
    state: &integrations::IntegrationState,
    requested: &str,
) -> Result<integrations::IntegrationStatus, String> {
    let _change_guard = state.lock_shortcut_changes();

    if !state.shortcut_backend_available() {
        let error = state
            .snapshot()
            .shortcut_error
            .unwrap_or_else(|| "Global shortcuts are unavailable on this system".into());
        integrations::update_shortcut(app, state.snapshot().shortcut_value, Some(error.clone()));
        return Err(error);
    }

    let next = match normalize(requested) {
        Ok(next) => next,
        Err(error) => {
            let current = state.snapshot();
            integrations::update_shortcut(app, current.shortcut_value, Some(error.clone()));
            return Err(error);
        }
    };

    let current = state.snapshot();
    if current.shortcut && current.shortcut_value == next {
        return Ok(current);
    }

    if let Some(shortcut) = next.as_deref() {
        if let Err(error) = app.global_shortcut().register(shortcut) {
            let message = format!("Global shortcut is unavailable: {error}");
            integrations::update_shortcut(app, current.shortcut_value, Some(message.clone()));
            return Err(message);
        }
    }

    if let Err(error) = settings::save_shortcut(app, next.as_deref()) {
        let rollback_error = unregister_if_registered(app, next.as_deref());
        let message = append_rollback_error(error, rollback_error);
        integrations::update_shortcut(app, current.shortcut_value, Some(message.clone()));
        return Err(message);
    }

    if let Some(previous) = current.shortcut_value.as_deref() {
        if let Err(error) = app.global_shortcut().unregister(previous) {
            let rollback_error = unregister_if_registered(app, next.as_deref());
            let settings_error = settings::save_shortcut(app, Some(previous)).err();
            let message = format!(
                "Could not replace the current global shortcut: {error}{}{}",
                rollback_error
                    .map(|rollback| format!("; new shortcut rollback failed: {rollback}"))
                    .unwrap_or_default(),
                settings_error
                    .map(|settings| format!("; saved setting rollback failed: {settings}"))
                    .unwrap_or_default()
            );
            integrations::update_shortcut(app, current.shortcut_value, Some(message.clone()));
            return Err(message);
        }
    }

    Ok(integrations::update_shortcut(app, next, None))
}

pub fn unregister_all(app: &AppHandle) {
    if !app
        .state::<integrations::IntegrationState>()
        .shortcut_backend_available()
    {
        return;
    }

    if let Err(error) = app.global_shortcut().unregister_all() {
        eprintln!("Could not unregister global shortcuts during shutdown: {error}");
    }
}

fn normalize(value: &str) -> Result<Option<String>, String> {
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }

    let parts = value
        .split('+')
        .map(str::trim)
        .map(|part| {
            if part.eq_ignore_ascii_case("cmdorctrl") {
                "CommandOrControl".to_string()
            } else {
                part.to_string()
            }
        })
        .collect::<Vec<_>>();

    if parts.iter().any(String::is_empty) {
        return Err("Shortcut contains an empty key".into());
    }

    let normalized = parts.join("+");
    Shortcut::from_str(&normalized).map_err(|error| format!("Invalid global shortcut: {error}"))?;
    Ok(Some(normalized))
}

fn unregister_if_registered(app: &AppHandle, shortcut: Option<&str>) -> Option<String> {
    let shortcut = shortcut?;
    if !app.global_shortcut().is_registered(shortcut) {
        return None;
    }

    app.global_shortcut()
        .unregister(shortcut)
        .err()
        .map(|error| error.to_string())
}

fn append_rollback_error(error: String, rollback_error: Option<String>) -> String {
    match rollback_error {
        Some(rollback_error) => {
            format!("{error}; could not roll back the new shortcut: {rollback_error}")
        }
        None => error,
    }
}

#[cfg(test)]
mod tests {
    use super::{DEFAULT_SHORTCUT, normalize};

    #[test]
    fn default_shortcut_is_a_valid_cross_platform_accelerator() {
        assert_eq!(
            normalize(DEFAULT_SHORTCUT).unwrap().as_deref(),
            Some(DEFAULT_SHORTCUT)
        );
    }

    #[test]
    fn cmd_or_ctrl_alias_is_normalized() {
        assert_eq!(
            normalize(" CmdOrCtrl + Shift + C ").unwrap().as_deref(),
            Some(DEFAULT_SHORTCUT)
        );
    }

    #[test]
    fn an_empty_shortcut_disables_the_registration() {
        assert_eq!(normalize("  ").unwrap(), None);
    }

    #[test]
    fn empty_accelerator_parts_are_rejected() {
        assert!(normalize("Control++C").is_err());
    }
}
