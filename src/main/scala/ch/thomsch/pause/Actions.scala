package ch.thomsch.pause

import javafx.beans.property.DoubleProperty

import ch.thomsch.pause.time.NotificationTimer

import scalafx.application.Platform

/**
  * @author Thomsch
  */
object Actions {

  val notificationTimer : NotificationTimer = new NotificationTimer()

  /**
    * Start a timer.
    *
    * @param time The duration in minutes
    */
  def startTimer(time: Long, progressProperty: DoubleProperty): Unit = {
    TrayAdapter.displayNotification("Next pause in " + time + " minutes")

    notificationTimer.startTimer(time, progressProperty)
  }

  /**
    * Cancels the current timer.
    * @return
    */
  def cancelTimer(): Unit = notificationTimer.cancel()

  def closeApplication() : Unit = {
    notificationTimer.stop()
    Actions.cancelTimer()
    TrayAdapter.removeIcon()
    Platform.exit()
  }
}
