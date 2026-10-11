use tauri::{
    AppHandle, Manager,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

use crate::windows;

const OPEN_MAIN: &str = "open-main";
const OPEN_QUICK: &str = "open-quick";
const OPEN_SETTINGS: &str = "open-settings";
const QUIT: &str = "quit";

pub fn install(app: &AppHandle) -> Result<(), String> {
    let open_main = MenuItem::with_id(app, OPEN_MAIN, "Libre Calculator", true, None::<&str>)
        .map_err(|error| error.to_string())?;
    let open_quick = MenuItem::with_id(app, OPEN_QUICK, "Quick Search", true, None::<&str>)
        .map_err(|error| error.to_string())?;
    let settings = MenuItem::with_id(app, OPEN_SETTINGS, "Settings…", true, Some("CmdOrCtrl+,"))
        .map_err(|error| error.to_string())?;
    let quit = MenuItem::with_id(app, QUIT, "Quit", true, None::<&str>)
        .map_err(|error| error.to_string())?;
    let menu = Menu::with_items(app, &[&open_main, &open_quick, &settings, &quit])
        .map_err(|error| error.to_string())?;

    let tray = TrayIconBuilder::with_id("libre-calculator-tray")
        .icon(tray_image()?)
        .icon_as_template(true)
        .tooltip("Libre Calculator")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            OPEN_MAIN => report_window_error(windows::show_main(app, None), "main window"),
            OPEN_QUICK => report_window_error(windows::show_quick(app), "quick calculator"),
            OPEN_SETTINGS => report_window_error(windows::show_settings(app), "settings"),
            QUIT => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                report_window_error(windows::toggle_quick(tray.app_handle()), "quick calculator");
            }
        })
        .build(app)
        .map_err(|error| error.to_string())?;

    app.manage(tray);
    Ok(())
}

fn report_window_error(result: Result<(), String>, target: &str) {
    if let Err(error) = result {
        eprintln!("Could not open the {target}: {error}");
    }
}

fn tray_image() -> Result<tauri::image::Image<'static>, String> {
    tauri::image::Image::from_bytes(include_bytes!("../icons/tray.png"))
        .map_err(|error| error.to_string())
}
