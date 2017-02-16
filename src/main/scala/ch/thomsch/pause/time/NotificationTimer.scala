package ch.thomsch.pause.time

import java.util.concurrent.{ExecutorService, Executors}
import javafx.beans.property.DoubleProperty

/**
  * @author Thomsch
  */
class NotificationTimer {
  val scheduledExecutor : ExecutorService  = Executors.newSingleThreadExecutor()


  var currentTimer : Option[Command] = None
  def cancel(): Unit = {
    currentTimer.foreach(command => command.cancel())
  }

  /**
    * Starts a new timer.
    * @param time The time in minutes until the notification
    * @param progressProperty The property indicator of the progress
    */
  def startTimer(time: Long, progressProperty: DoubleProperty): Unit = {
    currentTimer = Some(new Command(time * 60, progressProperty))
    scheduledExecutor.execute(currentTimer.get)
  }

  def stop(): Unit = scheduledExecutor.shutdown()
}
