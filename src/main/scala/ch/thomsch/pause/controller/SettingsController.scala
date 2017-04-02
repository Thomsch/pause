package ch.thomsch.pause.controller

import java.io.IOException
import java.util.concurrent.Executors
import javafx.fxml.FXML

import ch.thomsch.pause.{About, Actions, ControllerRegister, Pause}

import scalafx.event.ActionEvent
import scalafx.scene.control._
import scalafx.scene.input.{KeyCode, KeyEvent}
import scalafxml.core.macros.sfxml

/**
  * @author Thomsch
  */
@sfxml
class SettingsController(@FXML private val progress: ProgressIndicator,
                         @FXML private val timeField: TextField,
                         @FXML private val onOffButton: ToggleButton) {
  def time : Option[Long] = try {Some(timeField.text.value.toLong)} catch {case e:NumberFormatException => None}

  /**
    * Warn the user that his input is incorrect.
    *
    * @return
    */
  def inputError = {
    println("Cannot start timer, input error was made")
    onOffButton.delegate.setSelected(false)
    timeField.setDisable(false)

    Executors.newCachedThreadPool().submit(new Runnable {
      override def run(): Unit = {
        timeField.setStyle("-fx-control-inner-background: red")
        Thread.sleep(2000)
        timeField.setStyle("")
      }
    })
  }

  @FXML
  def onButtonAction(event: scalafx.event.ActionEvent) {
    timeField.setDisable(onOffButton.delegate.isSelected)
    if (onOffButton.delegate.isSelected) {
      if(time.isDefined) {
        Actions.startTimer(time.get, progress.progressProperty)
        onOffButton.setText("On")
      } else inputError
    } else {
      Actions.cancelTimer()
      onOffButton.setText("Activate")
    }
  }

  @FXML
  def onAboutActionClick(event: scalafx.event.ActionEvent) {
    try {
      About.createUI.show()
    } catch {
      case _ : IOException => Pause.showErrorMessage("We are sorry, this window is not available for now : The program cannot find the file about.fxml.")
    }
  }

  @FXML
  def onKeyboardEventPressed(event : KeyEvent) : Unit = {

    event.code match {
      case KeyCode.Enter =>
        onOffButton.delegate.setSelected(!onOffButton.delegate.isSelected)
        onButtonAction(new ActionEvent(event.source, event.target))
        event.consume()
      case KeyCode.Escape =>
        if(event.isShiftDown) Actions.closeApplication() else Pause.hide()

      case KeyCode.Shift =>
        if(ControllerRegister.mainWindowController != null) ControllerRegister.mainWindowController.exitButton.setStyle("-fx-background-color: #9E3146")

      case _ =>
    }
  }

  @FXML
  def onKeyboardEventReleased(event : KeyEvent) : Unit = {
    event.code match {
      case KeyCode.Shift =>
        if(ControllerRegister.mainWindowController != null) ControllerRegister.mainWindowController.exitButton.setStyle("-fx-background-color: #559e83")
      case _ =>
    }
  }

}
