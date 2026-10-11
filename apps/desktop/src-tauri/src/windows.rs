use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CalculatorSelected<'a> {
    calculator_id: &'a str,
}

pub fn show_main(app: &AppHandle, calculator_id: Option<&str>) -> Result<(), String> {
    let main = app
        .get_webview_window("main")
        .ok_or_else(|| "The main window is unavailable".to_string())?;

    main.show().map_err(|error| error.to_string())?;
    main.set_focus().map_err(|error| error.to_string())?;

    if let Some(calculator_id) = calculator_id.filter(|value| !value.trim().is_empty()) {
        app.emit_to(
            "main",
            "calculator-selected",
            CalculatorSelected { calculator_id },
        )
        .map_err(|error| {
            format!("Could not send the selected calculator to the main window: {error}")
        })?;
    }

    Ok(())
}

pub fn show_settings(app: &AppHandle) -> Result<(), String> {
    show_main(app, None)?;
    app.emit_to("main", "open-settings", ())
        .map_err(|error| format!("Could not open settings: {error}"))
}

pub fn show_quick(app: &AppHandle) -> Result<(), String> {
    let quick = quick_window(app)?;
    quick.center().map_err(|error| error.to_string())?;
    quick.show().map_err(|error| error.to_string())?;
    quick.set_focus().map_err(|error| error.to_string())?;
    app.emit_to("quick", "quick-shown", ())
        .map_err(|error| error.to_string())
}

pub fn hide_quick(app: &AppHandle) -> Result<(), String> {
    quick_window(app)?.hide().map_err(|error| error.to_string())
}

pub fn toggle_quick(app: &AppHandle) -> Result<(), String> {
    let quick = quick_window(app)?;
    if quick.is_visible().map_err(|error| error.to_string())? {
        quick.hide().map_err(|error| error.to_string())
    } else {
        show_quick(app)
    }
}

fn quick_window(app: &AppHandle) -> Result<tauri::WebviewWindow, String> {
    app.get_webview_window("quick")
        .ok_or_else(|| "The quick calculator window is unavailable".to_string())
}
