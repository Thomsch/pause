package ch.thomsch.pause

import java.io.IOException
import javafx.fxml.{FXML, FXMLLoader}
import javafx.scene.control.{Button, TextField}
import javafx.scene.input.MouseEvent
import javafx.scene.layout.VBox
import javafx.stage.Window

/**
  * @author Thomsch
  */
class WindowDecorationController() extends VBox {

  @FXML var exitButton: Button = _
  @FXML var textField : TextField = _

  var x : Double = 0
  var y : Double = 0

  var mainWindow : Boolean = false

  val fxmlLoader: FXMLLoader = new FXMLLoader(getClass.getResource("/window-decoration.fxml"))
  fxmlLoader.setRoot(this)
  fxmlLoader.setController(this)
  try {
    fxmlLoader.load
  }
  catch {
    case exception: IOException => {
      throw new RuntimeException(exception)
    }
  }

  @FXML
  def onMouseDraggedWindowBar(event: MouseEvent): Unit = {
    val stage : Window = getScene.getWindow

    stage.setX(event.getScreenX + x)
    stage.setY(event.getScreenY + y)
  }

  @FXML
  def onMousePressedWindowBar(event: MouseEvent): Unit = {
    val stage : Window = getScene.getWindow

    x = stage.getX - event.getScreenX
    y = stage.getY - event.getScreenY
  }

  def getText: String = exitButton.getTooltip.getText
  def setText(value : String): Unit = exitButton.getTooltip.setText(value)

  def getIsMainWindow: Boolean = mainWindow
  def setIsMainWindow(value : Boolean): Unit = mainWindow = value

  @FXML
  def onMouseClickedExit(event: MouseEvent): Unit = {
    if(mainWindow && event.isShiftDown) Actions.closeApplication()
    else getScene.getWindow.hide()
  }
}
