use tauri::{
    AppHandle,
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
};

#[derive(Clone, Debug, serde::Deserialize)]
pub struct MenuCalculator {
    pub id: String,
    pub title: String,
    pub category: String,
}

/// Application menu. Only the macOS menu bar shows it by default; elsewhere it
/// gives the main window a standard Edit menu and a Settings shortcut.
pub fn build(app: &AppHandle, calculators: &[MenuCalculator]) -> tauri::Result<Menu<tauri::Wry>> {
    let settings = MenuItem::with_id(app, "settings", "Settings…", true, Some("CmdOrCtrl+,"))?;

    let app_menu = Submenu::with_items(
        app,
        "Libre Calculator",
        true,
        &[
            &PredefinedMenuItem::about(app, None, None)?,
            &PredefinedMenuItem::separator(app)?,
            &settings,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::hide(app, None)?,
            &PredefinedMenuItem::hide_others(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, None)?,
        ],
    )?;
    let edit = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &PredefinedMenuItem::undo(app, None)?,
            &PredefinedMenuItem::redo(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, None)?,
            &PredefinedMenuItem::copy(app, None)?,
            &PredefinedMenuItem::paste(app, None)?,
            &PredefinedMenuItem::select_all(app, None)?,
        ],
    )?;
    let window = Submenu::with_items(
        app,
        "Window",
        true,
        &[
            &PredefinedMenuItem::minimize(app, None)?,
            &PredefinedMenuItem::maximize(app, None)?,
            &PredefinedMenuItem::close_window(app, None)?,
        ],
    )?;

    let quick = MenuItem::with_id(app, "quick", "Quick Search", true, None::<&str>)?;
    let mut categories: Vec<(&str, Vec<&MenuCalculator>)> = Vec::new();
    for calculator in calculators {
        match categories
            .iter_mut()
            .find(|(name, _)| *name == calculator.category)
        {
            Some((_, items)) => items.push(calculator),
            None => categories.push((&calculator.category, vec![calculator])),
        }
    }
    let calculators_menu = Submenu::new(app, "Calculators", true)?;
    calculators_menu.append(&quick)?;
    for (name, items) in categories {
        calculators_menu.append(&PredefinedMenuItem::separator(app)?)?;
        let category = Submenu::new(app, name, true)?;
        for item in items {
            category.append(&MenuItem::with_id(
                app,
                format!("calc:{}", item.id),
                &item.title,
                true,
                None::<&str>,
            )?)?;
        }
        calculators_menu.append(&category)?;
    }

    Menu::with_items(app, &[&app_menu, &edit, &calculators_menu, &window])
}
