package ch.thomsch.pause

/**
  * Defines an observer of a [[ch.thomsch.pause.Timer]].
  *
  * @author Thomsch
  */
trait TimerObserver {

  /**
    * Called when there is an update in the progress
    *
    * @param progress a value from 0 (no progress) to 1 (finished)
    */
  def onProgressUpdate(progress: Float)

  /**
    * Called when the timer has started and is active
    *
    * @param duration the time set for the timer in minutes
    */
  def onTimerStarted(duration: Long)

  /**
    * Called when the timer arrived to it's end.
    */
  def onTimerFinished()

  /**
    * Called when the timer is manually stopped.
    */
  def onTimerStopped()

}
