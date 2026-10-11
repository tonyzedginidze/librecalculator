mod commands;
mod integrations;
mod menu;
mod settings;
mod shortcuts;
mod tray;
mod windows;

use tauri::{Manager, RunEvent};
use tauri_plugin_global_shortcut::{Builder as GlobalShortcutBuilder, ShortcutState};

pub fn run() {
    let shortcut_backend = shortcuts::backend_availability();
    let mut builder = tauri::Builder::default();

    if shortcut_backend.is_ok() {
        builder = builder.plugin(
            GlobalShortcutBuilder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        if let Err(error) = windows::toggle_quick(app) {
                            eprintln!("Could not open the quick calculator: {error}");
                        }
                    }
                })
                .build(),
        );
    }

    let builder = builder
        .invoke_handler(tauri::generate_handler![
            commands::show_main,
            commands::hide_quick,
            commands::quit_app,
            commands::set_calculator_menu,
            commands::set_global_shortcut,
            commands::get_integration_status
        ])
        .setup(move |app| {
            app.manage(integrations::IntegrationState::default());

            app.set_menu(menu::build(app.handle(), &[])?)?;

            match tray::install(app.handle()) {
                Ok(()) => integrations::set_tray_available(app.handle(), true),
                Err(error) => {
                    eprintln!("System tray integration is unavailable: {error}");
                    integrations::set_tray_available(app.handle(), false);
                }
            }

            let state = app.state::<integrations::IntegrationState>();
            match shortcut_backend {
                Ok(()) => {
                    state.set_shortcut_backend_available(true);
                    shortcuts::initialize(app.handle());
                }
                Err(error) => {
                    state.set_shortcut_backend_available(false);
                    integrations::update_shortcut(app.handle(), None, Some(error));
                }
            }
            Ok(())
        })
        .on_menu_event(|app, event| {
            let id = event.id().as_ref();
            let result = if id == "settings" {
                windows::show_settings(app)
            } else if id == "quick" {
                windows::show_quick(app)
            } else if let Some(calculator_id) = id.strip_prefix("calc:") {
                windows::show_main(app, Some(calculator_id))
            } else {
                Ok(())
            };
            if let Err(error) = result {
                eprintln!("Menu action failed: {error}");
            }
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let app = window.app_handle();

                match window.label() {
                    "quick" => {
                        api.prevent_close();
                        if let Err(error) = window.hide() {
                            eprintln!("Could not hide the quick calculator: {error}");
                            app.exit(0);
                        }
                    }
                    "main" if integrations::status(&app).tray => {
                        api.prevent_close();
                        if let Err(error) = window.hide() {
                            eprintln!("Could not hide the main window: {error}");
                            app.exit(0);
                        }
                    }
                    "main" => app.exit(0),
                    _ => {}
                }
            }
        });

    match builder.build(tauri::generate_context!()) {
        Ok(app) => {
            app.run(|app, event| {
                if matches!(event, RunEvent::Exit | RunEvent::ExitRequested { .. }) {
                    shortcuts::unregister_all(app);
                }
            });
        }
        Err(error) => eprintln!("Could not start the desktop application: {error}"),
    }
}
