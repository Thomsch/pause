package ch.thomsch.pause

import java.util.concurrent.Executors
import javafx.fxml.FXML

import scalafx.scene.control.{ProgressIndicator, TextField, ToggleButton}
import scalafx.scene.input.MouseEvent
import scalafxml.core.macros.sfxml

/**
  * @author Thomsch
  */
@sfxml
class SettingsController(@FXML private val progress: ProgressIndicator,
                         @FXML private val timeField: TextField,
                         @FXML private val onOffButton: ToggleButton) {

  var x : Double = 0
  var y : Double = 0

  def time : Option[Long] = try {Some(timeField.text.value.toLong)} catch {case e:NumberFormatException => None}

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
  def onMouseClickedExit(event: MouseEvent): Unit = {
    if(event.isShiftDown) Actions.closeApplication()
    else Pause.hide()
  }

  @FXML
  def onMouseDraggedWindowBar(event: MouseEvent): Unit = {
    Pause.stage.setX(event.getScreenX + x)
    Pause.stage.setY(event.getScreenY + y)
  }

  @FXML
  def onMousePressedWindowBar(event: MouseEvent): Unit = {
    x = Pause.stage.getX - event.getScreenX
    y = Pause.stage.getY - event.getScreenY
  }

  @FXML
  def onAboutActionClick(event: scalafx.event.ActionEvent) {
    About.createUI.show()
  }
}
