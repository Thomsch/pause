package ch.thomsch.pause.ui.decoration

import javafx.fxml.FXML
import javafx.scene.input.MouseEvent

import ch.thomsch.pause.Pause

/**
  * @author Thomsch
  */
class MainWindowDecoration extends WindowDecorationController{

  MainWindowDecoration.instance = Some(this)

  @FXML
  override def onMouseClickedExit(event: MouseEvent): Unit = {
    if (event.isShiftDown) Pause.closeApplication()
    else getScene.getWindow.hide()
  }
}

object MainWindowDecoration {
  var instance : Option[MainWindowDecoration] = None
}
