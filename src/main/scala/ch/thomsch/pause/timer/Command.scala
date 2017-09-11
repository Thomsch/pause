package ch.thomsch.pause.timer

import scala.collection.mutable

/**
  * @author Thomsch
  * @param time Time to wait until the notification in seconds.
  */
class Command(private val observers: mutable.Set[TimerObserver], private val time: Long) extends Runnable {
  private var isActive : Boolean = true

  private val refreshRate : Int = 10
  private val total = time * refreshRate

  private val step = 1000 / refreshRate
  override def run(): Unit = {
    var counter: Long = 1

    notifyObservers(observer => observer.onTimerStarted(time / 60))

      while (isActive && counter < total) {
        Thread.sleep(step)
        counter += 1
        if (isActive) {
          notifyObservers(observer => observer.onProgressUpdate(counter.toFloat / total))
        }
      }

    if (isActive) {
      notifyObservers(observer => observer.onTimerFinished())
    }
    else {
      notifyObservers(observer => observer.onTimerStopped())
    }
    }

  private def notifyObservers(f: TimerObserver => Unit): Unit = {
    observers.foreach(f)
  }

  def cancel(): Unit = isActive = false

  def isRunning: Boolean = isActive
}
