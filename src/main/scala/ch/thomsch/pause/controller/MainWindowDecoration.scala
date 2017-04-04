package ch.thomsch.pause.controller

import javafx.fxml.FXML
import javafx.scene.input.MouseEvent

import ch.thomsch.pause.{Actions, ControllerRegister}

/**
  * @author Thomsch
  */
class MainWindowDecoration extends WindowDecorationController{

  ControllerRegister.mainWindowController = this

  @FXML
  override def onMouseClickedExit(event: MouseEvent): Unit = {
    if(event.isShiftDown) Actions.closeApplication()
    else getScene.getWindow.hide()
  }
}
