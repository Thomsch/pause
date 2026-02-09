mod timer;

use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder};
use timer::TimerState;

const POSTPONE_DURATION: u32 = 3;

fn start_timer_with_callback(app: &AppHandle, state: &Arc<TimerState>, duration: u32) {
    state.start(app.clone(), duration, |app| {
        open_notification_windows(app);
    });
}

#[tauri::command]
fn start_timer(app: AppHandle, state: tauri::State<'_, Arc<TimerState>>, duration: u32) {
    if duration == 0 || duration > 1440 {
        eprintln!("Invalid timer duration: {}", duration);
        return;
    }
    start_timer_with_callback(&app, &state, duration);
}

#[tauri::command]
fn stop_timer(app: AppHandle, state: tauri::State<'_, Arc<TimerState>>) {
    state.stop();
    let _ = app.emit_to("main", "timer-stopped", ());
}

#[tauri::command]
fn resume(app: AppHandle, state: tauri::State<'_, Arc<TimerState>>) {
    close_notification_windows(&app);
    let duration = state.stored_duration();
    start_timer_with_callback(&app, &state, duration);
}

#[tauri::command]
fn postpone(app: AppHandle, state: tauri::State<'_, Arc<TimerState>>) {
    close_notification_windows(&app);
    start_timer_with_callback(&app, &state, POSTPONE_DURATION);
}

fn close_notification_windows(app: &AppHandle) {
    let windows: Vec<_> = app
        .webview_windows()
        .into_iter()
        .filter(|(label, _)| label.starts_with("notification-"))
        .map(|(_, window)| window)
        .collect();

    for window in windows {
        let _ = window.close();
    }
}

fn open_notification_windows(app: &AppHandle) {
    let monitors = match app.available_monitors() {
        Ok(m) => m,
        Err(e) => {
            eprintln!("Failed to get monitors: {}", e);
            return;
        }
    };

    for (i, monitor) in monitors.iter().enumerate() {
        let label = format!("notification-{}", i);
        let position = monitor.position();
        let size = monitor.size();

        let url = WebviewUrl::App("notification/index.html".into());

        match WebviewWindowBuilder::new(app, &label, url)
            .title("Pause - Break Time")
            .inner_size(size.width as f64, size.height as f64)
            .position(position.x as f64, position.y as f64)
            .decorations(false)
            .always_on_top(true)
            .skip_taskbar(true)
            .resizable(false)
            .minimizable(false)
            .build()
        {
            Ok(_) => {}
            Err(e) => eprintln!("Failed to create notification window {}: {}", i, e),
        }
    }
}

pub fn run() {
    let timer_state = Arc::new(TimerState::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(timer_state)
        .invoke_handler(tauri::generate_handler![
            start_timer,
            stop_timer,
            resume,
            postpone,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
