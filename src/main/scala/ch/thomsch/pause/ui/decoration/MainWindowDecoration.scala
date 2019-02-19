package ch.thomsch.pause.ui.decoration

import javafx.css.PseudoClass
import javafx.fxml.FXML
import javafx.scene.input.MouseEvent

import ch.thomsch.pause.Pause

/**
  * @author Thomsch
  */
class MainWindowDecoration extends WindowDecorationController{
  val SHIFT_PSEUDO_CLASS: PseudoClass = PseudoClass.getPseudoClass("shift")

  MainWindowDecoration.instance = Some(this)

  def exitBehaviourChanged(active: Boolean): Unit = exitButton pseudoClassStateChanged(SHIFT_PSEUDO_CLASS, active)

  @FXML
  override def onMouseClickedExit(event: MouseEvent): Unit = {
    if (event.isShiftDown) Pause.closeApplication()
    else getScene.getWindow.hide()
  }
}

object MainWindowDecoration {
  var instance : Option[MainWindowDecoration] = None
}
