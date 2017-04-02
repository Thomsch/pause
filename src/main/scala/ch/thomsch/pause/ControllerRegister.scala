package ch.thomsch.pause

import ch.thomsch.pause.controller.WindowDecorationController

/**
  * Is necessary to keep track of what window controller is used.
  * I can't do it any other way with scalaFx and FXML :(.
 *
  * @author Thomsch
  */
object ControllerRegister {
  var mainWindowController: WindowDecorationController = _
}
