package ch.thomsch.pause

import ch.thomsch.pause.timer.{Timer, TimerObserver}
import ch.thomsch.pause.ui.TrayAdapter
import ch.thomsch.pause.ui.notification.Fullscreen

/**
  * Defines what to do when a work session is over.
  *
  * @author Thomsch
  */
class PauseStrategy(val timer: Timer) extends TimerObserver {

  override def onProgressUpdate(progress: Float): Unit = {

  }

  override def onTimerStarted(duration: Long): Unit = {
  }

  override def onTimerFinished(): Unit = {
    Config.notificationType match {
      case NotificationType.Message =>
        TrayAdapter.displayNotification("It's time to take a break !")
        timer.start(Config.workDuration)

      case NotificationType.Window =>
        val fullScreen: Fullscreen = new Fullscreen()
        fullScreen.show()
    }
  }

  override def onTimerStopped(): Unit = {
  }
}
