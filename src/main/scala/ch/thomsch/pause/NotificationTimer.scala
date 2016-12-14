package ch.thomsch.pause

import java.awt.TrayIcon.MessageType
import java.util.TimerTask
import java.util.concurrent.{ExecutorService, ScheduledExecutorService, Executors, ScheduledThreadPoolExecutor}

import javafx.beans.property.DoubleProperty

/**
  * @author Thomsch
  */
class NotificationTimer(private val progressProperty : DoubleProperty) {

  val scheduledExecutor : ExecutorService  = Executors.newSingleThreadExecutor()
  var currentTimer : Option[Command] = None

  def cancel() = {
    currentTimer.foreach(command => command.cancel())
  }

  def startTimer(time: Long) = {
    currentTimer = Some(new Command(time * 60, progressProperty))
    scheduledExecutor.execute(currentTimer.get)
  }
}
