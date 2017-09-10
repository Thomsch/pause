package ch.thomsch.pause.controller

import java.io.IOException
import java.util.concurrent.{Executors, TimeUnit}
import javafx.css.PseudoClass
import javafx.fxml.FXML

import ch.thomsch.pause._
import ch.thomsch.pause.decoration.MainWindowDecoration

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

  val SHIFT_PSEUDO_CLASS: PseudoClass = PseudoClass.getPseudoClass("shift")
  val timer: Timer = Timer.timer

  timeField.setText(Config.workDuration.toString)
  timer.addObserver(this)

  setSelectedNotificationType()
  notificationType.selectedToggleProperty().addListener(new NotificationTypeChangeListener())

  @FXML
  def onButtonAction(event: ActionEvent) {
    if (Timer.timer.isRunning) {
      timer.stop()
    } else if (time.isDefined) {
      Config.workDuration = time.get
      timer.start(time.get)
    } else displayInputError()
  }

  /**
    * Warn the user that his input is incorrect.
    */
  private def displayInputError(): Unit = {
    timeField.setStyle("-fx-control-inner-background: red")
    onOffButton.selected = false

    val executor = Executors.newSingleThreadScheduledExecutor()
    executor.schedule(new Runnable {
      override def run(): Unit = {
        timeField.setStyle("")
        executor.shutdownNow()
      }
    }, 2, TimeUnit.SECONDS)
  }

  private def time: Option[Long] = try {
    Some(timeField.text.value.toLong)
  } catch {
    case _: NumberFormatException => None
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
        MainWindowDecoration.instance.foreach(mainWindow => mainWindow.exitButton.pseudoClassStateChanged(SHIFT_PSEUDO_CLASS, true))

      case _ =>
    }
  }

  @FXML
  def onKeyboardEventReleased(event: KeyEvent): Unit = {
    event.code match {
      case KeyCode.Shift =>
        MainWindowDecoration.instance.foreach(mainWindow => mainWindow.exitButton.pseudoClassStateChanged(SHIFT_PSEUDO_CLASS, false))

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
