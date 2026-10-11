use std::sync::{
    Mutex, MutexGuard,
    atomic::{AtomicBool, Ordering},
};

use serde::Serialize;
use tauri::{AppHandle, Manager};

#[derive(Clone, Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IntegrationStatus {
    pub tray: bool,
    pub shortcut: bool,
    pub shortcut_value: Option<String>,
    pub shortcut_error: Option<String>,
}

#[derive(Default)]
pub struct IntegrationState {
    status: Mutex<IntegrationStatus>,
    shortcut_changes: Mutex<()>,
    shortcut_backend_available: AtomicBool,
}

impl IntegrationState {
    fn lock(&self) -> MutexGuard<'_, IntegrationStatus> {
        self.status
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
    }

    pub fn lock_shortcut_changes(&self) -> MutexGuard<'_, ()> {
        self.shortcut_changes
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
    }

    pub fn snapshot(&self) -> IntegrationStatus {
        self.lock().clone()
    }

    pub fn set_tray(&self, available: bool) {
        self.lock().tray = available;
    }

    pub fn set_shortcut_backend_available(&self, available: bool) {
        self.shortcut_backend_available
            .store(available, Ordering::Relaxed);
    }

    pub fn shortcut_backend_available(&self) -> bool {
        self.shortcut_backend_available.load(Ordering::Relaxed)
    }

    pub fn set_shortcut(&self, value: Option<String>, error: Option<String>) -> IntegrationStatus {
        let mut status = self.lock();
        status.shortcut = value.is_some();
        status.shortcut_value = value;
        status.shortcut_error = error;
        status.clone()
    }
}

pub fn set_tray_available(app: &AppHandle, available: bool) {
    app.state::<IntegrationState>().set_tray(available);
}

pub fn status(app: &AppHandle) -> IntegrationStatus {
    app.state::<IntegrationState>().snapshot()
}

pub fn update_shortcut(
    app: &AppHandle,
    value: Option<String>,
    error: Option<String>,
) -> IntegrationStatus {
    app.state::<IntegrationState>().set_shortcut(value, error)
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::IntegrationStatus;

    #[test]
    fn status_serializes_with_frontend_contract_names() {
        let status = IntegrationStatus {
            tray: true,
            shortcut: false,
            shortcut_value: None,
            shortcut_error: Some("Unavailable".into()),
        };

        assert_eq!(
            serde_json::to_value(status).unwrap(),
            json!({
                "tray": true,
                "shortcut": false,
                "shortcutValue": null,
                "shortcutError": "Unavailable"
            })
        );
    }
}
