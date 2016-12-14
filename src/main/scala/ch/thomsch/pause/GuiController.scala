package ch.thomsch.pause

import java.awt.TrayIcon.MessageType
import java.awt.event.{ActionEvent, ActionListener}
import java.util.{TimerTask, Timer}
import java.util.concurrent.Executors


import scalafx.animation.{FillTransition, KeyValue, Timeline, KeyFrame}
import scalafx.application.Platform
import scalafx.scene.Parent
import scalafx.scene.control.{ToggleButton, ProgressIndicator, TextField}
import scalafx.scene.layout.GridPane
import scalafxml.core.macros.sfxml

/**
  * @author Thomsch
  */
@sfxml
class GuiController(private val progress: ProgressIndicator,
                    private val timeField: TextField,
                    private val onOffButton: ToggleButton) {

  TrayAdapter.makeTray

  var notificationTimer : NotificationTimer = new NotificationTimer(progress.progressProperty())
  //    onAction = new EventHandler[javafx.event.ActionEvent] {
  //      override def handle(event: javafx.event.ActionEvent): Unit =
  //    }

  def time : Option[Long] = try {Some(timeField.text.value.toLong)} catch {case e:NumberFormatException => None}

  /**
    * Start a timer.
    *
    * @param time The duration in minutes
    */
  def startTimer(time: Long) = {
    println("Timer started, notifying the user to do a pause in " + time + " minutes")
    notificationTimer.startTimer(time)
  }

  /**
    * Warn the user that his input is incorrect.
    *
    * @return
    */
  def inputError = {
    println("Cannot start timer, input error was made")
    onOffButton.delegate.setSelected(false)

    Executors.newCachedThreadPool().submit(new Runnable {
      override def run(): Unit = {
        timeField.setStyle("-fx-control-inner-background: red")
        Thread.sleep(2000)
        timeField.setStyle("")
      }
    })
  }

  def onButtonAction(event: scalafx.event.ActionEvent) {
    timeField.setEditable(!onOffButton.delegate.isSelected)
    val duration = time
    if (onOffButton.delegate.isSelected) {
      if(duration.isDefined) startTimer(duration.get) else inputError
    } else if (notificationTimer != null) {
      notificationTimer.cancel
    }
  }
}
