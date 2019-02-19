package ch.thomsch.pause.ui.notification

import javafx.fxml.FXML
import javafx.scene.control.Button

import ch.thomsch.pause.Config
import ch.thomsch.pause.timer.Timer

import scalafxml.core.macros.sfxml

/**
  * @author Thomsch
  */
@sfxml
class FullscreenController(@FXML private val postpone: Button, @FXML private val skip: Button) {

  val timer: Timer = Timer.timer

  @FXML
  def onSkip(event: scalafx.event.ActionEvent): Unit = {
    timer.start(Config.workDuration)
    closeStage()
  }

  private def closeStage(): Unit = {
    Fullscreen.stage.foreach(stage => stage.close())
  }

  @FXML
  def onPostpone(event: scalafx.event.ActionEvent) {
    timer.start(Config.postpone)
    closeStage()
  }
}
