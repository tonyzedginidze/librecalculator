use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Settings {
    global_shortcut: Option<String>,
}

pub fn load_shortcut(app: &AppHandle) -> Result<Option<String>, String> {
    let path = settings_path(app)?;
    let contents = match fs::read_to_string(path) {
        Ok(contents) => contents,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return Ok(Some(crate::shortcuts::DEFAULT_SHORTCUT.into()));
        }
        Err(error) => return Err(format!("Could not read desktop settings: {error}")),
    };

    let settings: Settings = serde_json::from_str(&contents)
        .map_err(|error| format!("Could not read saved shortcut setting: {error}"))?;

    Ok(settings
        .global_shortcut
        .filter(|shortcut| !shortcut.trim().is_empty()))
}

pub fn save_shortcut(app: &AppHandle, shortcut: Option<&str>) -> Result<(), String> {
    let path = settings_path(app)?;
    let directory = path
        .parent()
        .ok_or_else(|| "Could not determine the desktop settings directory".to_string())?;
    fs::create_dir_all(directory)
        .map_err(|error| format!("Could not create desktop settings directory: {error}"))?;

    let settings = Settings {
        global_shortcut: shortcut.map(str::to_owned),
    };
    let contents = serde_json::to_vec_pretty(&settings)
        .map_err(|error| format!("Could not encode desktop settings: {error}"))?;
    fs::write(path, contents).map_err(|error| format!("Could not save desktop settings: {error}"))
}

fn settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|directory| directory.join("settings.json"))
        .map_err(|error| format!("Could not locate desktop settings: {error}"))
}
