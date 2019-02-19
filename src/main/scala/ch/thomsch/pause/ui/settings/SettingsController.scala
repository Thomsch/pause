package ch.thomsch.pause.ui.settings

import java.io.IOException
import javafx.fxml.FXML

import ch.thomsch.pause._
import ch.thomsch.pause.timer.{Timer, TimerObserver}
import ch.thomsch.pause.ui.about.About
import ch.thomsch.pause.ui.decoration.MainWindowDecoration

import scala.collection.JavaConversions._
import scalafx.application.Platform
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
                         @FXML private val onOffButton: ToggleButton,
                         @FXML private val notificationType: ToggleGroup) extends TimerObserver {
  val timer: Timer = Timer.timer
  val inputValidator: InputValidator = new InputValidator(timeField, onOffButton)

  timeField.setText(Config.workDuration.toString)
  setSelectedNotificationType()

  timer.addObserver(this)
  notificationType.selectedToggleProperty().addListener(new NotificationTypeChangeListener())

  @FXML
  def onButtonAction(event: ActionEvent) {
    if (Timer.timer.isRunning) {
      timer.stop()
    } else if (inputValidator.isWorkDurationValid) {
      Config.workDuration = timeField.getText.toLong
      timer.start(Config.workDuration)
    }
  }

  @FXML
  def onAboutActionClick(event: ActionEvent) {
    try {
      About.createUI.show()
    } catch {
      case _: IOException => Pause.showErrorMessage("We are sorry, this window is not available for now : The program cannot find the file about.fxml.")
    }
  }

  @FXML
  def onKeyboardEventPressed(event: KeyEvent): Unit = {
    event.code match {
      case KeyCode.Enter =>
        onOffButton.fire()
      case KeyCode.Escape =>
        if (event.isShiftDown) Pause.closeApplication() else Pause.hide()

      case KeyCode.Shift =>
        MainWindowDecoration.instance.foreach(windowDecoration => windowDecoration.exitBehaviourChanged(true))

      case _ =>
    }
  }

  @FXML
  def onKeyboardEventReleased(event: KeyEvent): Unit = {
    event.code match {
      case KeyCode.Shift =>
        MainWindowDecoration.instance.foreach(mainWindow => mainWindow.exitBehaviourChanged(false))

      case _ =>
    }
  }

  override def onProgressUpdate(progress: Float): Unit = {
    Platform.runLater {
      this.progress.progressProperty().setValue(progress)
    }
  }

  override def onTimerStarted(duration: Long): Unit = {
    Platform.runLater {
      timeField.setDisable(true)
      onOffButton.setText("On")
    }
  }

  override def onTimerFinished(): Unit = {
    Platform.runLater(resetProgress())
  }

  private def resetProgress(): Unit = {
    this.progress.progressProperty().setValue(0)
  }

  override def onTimerStopped(): Unit = {
    Platform.runLater {
      resetProgress()
      timeField.setDisable(false)
      onOffButton.setText("Activate")
    }
  }

  private def setSelectedNotificationType(): Unit = {
    notificationType.getToggles.foreach(toggle => {
      if (toggle.getUserData.toString.toLowerCase == Config.notificationType.toString.toLowerCase) {
        toggle.setSelected(true)
      }
    })
  }

}
