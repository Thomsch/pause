use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

pub struct TimerState {
    pub cancel: Arc<AtomicBool>,
    pub duration_minutes: Mutex<u32>,
}

impl TimerState {
    pub fn new() -> Self {
        Self {
            cancel: Arc::new(AtomicBool::new(false)),
            duration_minutes: Mutex::new(30),
        }
    }

    pub fn start<F>(&self, app: AppHandle, duration_minutes: u32, on_done: F)
    where
        F: FnOnce(&AppHandle) + Send + 'static,
    {
        // Cancel any existing timer
        self.cancel.store(true, Ordering::SeqCst);

        // Store duration for resume
        *self.duration_minutes.lock().unwrap() = duration_minutes;

        // Reset cancel flag for new timer
        self.cancel.store(false, Ordering::SeqCst);

        let cancel = self.cancel.clone();
        let total_ms = duration_minutes as u64 * 60 * 1000;

        thread::spawn(move || {
            let start = Instant::now();
            let total = Duration::from_millis(total_ms);

            loop {
                thread::sleep(Duration::from_millis(100));

                if cancel.load(Ordering::SeqCst) {
                    return;
                }

                let elapsed = start.elapsed();
                if elapsed >= total {
                    let _ = app.emit_to("main", "timer-update", "100");
                    on_done(&app);
                    return;
                }

                let progress = (elapsed.as_millis() as f64 / total.as_millis() as f64) * 100.0;
                let progress_str = format!("{:.2}", progress);
                let _ = app.emit_to("main", "timer-update", progress_str);
            }
        });
    }

    pub fn stop(&self) {
        self.cancel.store(true, Ordering::SeqCst);
    }

    pub fn stored_duration(&self) -> u32 {
        *self.duration_minutes.lock().unwrap()
    }
}
