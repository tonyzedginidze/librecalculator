use tauri::{AppHandle, State};

use crate::{integrations, menu, shortcuts, windows};

#[tauri::command]
pub fn show_main(app: AppHandle, calculator_id: Option<String>) -> Result<(), String> {
    windows::show_main(&app, calculator_id.as_deref())
}

#[tauri::command]
pub fn quit_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn hide_quick(app: AppHandle) -> Result<(), String> {
    windows::hide_quick(&app)
}

#[tauri::command]
pub fn set_global_shortcut(
    app: AppHandle,
    state: State<'_, integrations::IntegrationState>,
    shortcut: String,
) -> Result<integrations::IntegrationStatus, String> {
    shortcuts::set(&app, &state, &shortcut)
}

#[tauri::command]
pub fn get_integration_status(
    state: State<'_, integrations::IntegrationState>,
) -> integrations::IntegrationStatus {
    state.snapshot()
}

/// The frontend owns the catalog, so it sends the list once and the native
/// Calculators menu is rebuilt from it.
#[tauri::command]
pub fn set_calculator_menu(
    app: AppHandle,
    calculators: Vec<menu::MenuCalculator>,
) -> Result<(), String> {
    let built = menu::build(&app, &calculators).map_err(|error| error.to_string())?;
    app.set_menu(built)
        .map(|_| ())
        .map_err(|error| error.to_string())
}
