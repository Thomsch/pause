package ch.thomsch.pause

import javafx.beans.property.DoubleProperty

import scalafx.application.Platform

/**
  * Created by Thomsch on 28.12.2016.
  */
object Actions {

  val notificationTimer : NotificationTimer = new NotificationTimer()

  /**
    * Start a timer.
    *
    * @param time The duration in minutes
    */
  def startTimer(time: Long, progressProperty: DoubleProperty) = {
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
