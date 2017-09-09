package ch.thomsch.pause

/**
  * Defines what to do when a work session is over.
  *
  * @author Thomsch
  */
class PauseStrategy(val timer: Timer) extends TimerObserver {

  override def onProgressUpdate(progress: Float): Unit = {

  }

  override def onTimerStarted(duration: Long): Unit = {
    println("Timer started for " + duration + " minutes")
  }

  override def onTimerFinished(): Unit = {
    val fullScreen: Fullscreen = new Fullscreen()
    fullScreen.show()
  }

  override def onTimerStopped(): Unit = {
    println("Timer has been stopped")
  }
}
