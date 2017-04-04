package ch.thomsch.pause.controller

import javafx.fxml.FXML
import javafx.scene.input.MouseEvent

/**
  * @author Thomsch
  */
class RegularWindowDecoration extends WindowDecorationController{

  @FXML
  override def onMouseClickedExit(event: MouseEvent): Unit = {
    getScene.getWindow.hide()
  }
}
