package ch.thomsch.pause

import java.util.concurrent.{ExecutorService, Executors}
import javafx.beans.property.DoubleProperty

/**
  * @author Thomsch
  */
class NotificationTimer {

  val scheduledExecutor : ExecutorService  = Executors.newSingleThreadExecutor()
  var currentTimer : Option[Command] = None

  def cancel() = {
    currentTimer.foreach(command => command.cancel())
  }

  def startTimer(time: Long, progressProperty: DoubleProperty) = {
    currentTimer = Some(new Command(time * 60, progressProperty))
    scheduledExecutor.execute(currentTimer.get)
  }
}
