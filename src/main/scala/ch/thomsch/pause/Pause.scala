package ch.thomsch.pause

import java.awt.SystemTray
import java.io.IOException

import scalafx.Includes._
import scalafx.application.JFXApp.PrimaryStage
import scalafx.application.{JFXApp, Platform}
import scalafx.scene.Scene
import scalafx.scene.control.Alert.AlertType
import scalafx.scene.control.{Alert, Label, TextField}
import scalafx.scene.layout.VBox
import scalafx.stage.StageStyle

object Pause extends JFXApp {

  val timer: Timer = Timer.timer

  if(SystemTray.isSupported) {

    try {
      val root = FXMLAdapter.loadFXML("pause.fxml")

      stage = new PrimaryStage{
        resizable = false
        scene = new Scene(root)
        title = "Pause"
        icons.add(Config.appIcon)
        initStyle(StageStyle.Undecorated)
        root.requestFocus()
      }

      Platform.implicitExit = false
      TrayAdapter.initialize()
      timer.addObserver(new PauseStrategy(timer))
    } catch {
      case _ : IOException =>
        JFXApp.AutoShow = false
        showErrorMessage("The program cannot find the file pause.fxml. The program will stop.")
    }
  } else {
    JFXApp.AutoShow = false

    val alert = new Alert(AlertType.Warning) {
      title = "Pause"
      contentText = "We are sorry, it appears the program cannot be run on your computer because it doesn't support system tray."
      headerText = "System tray is not supported"
      initStyle(StageStyle.Utility)
    }
    alert.showAndWait()
  }

  def show(): Unit = Platform.runLater(new Runnable {
    override def run(): Unit = stage.show
  })

  def hide(): Unit = Platform.runLater(new Runnable {
    override def run(): Unit = stage.hide
  })

  def showErrorMessage(message: String) : Unit = {
    val dialog = new Alert(AlertType.Error) {
      title = "Pause"
      headerText = "An error occured"
      initStyle(StageStyle.Utility)
    }

    val layout = new VBox {
      children = Seq(
        new Label(message),
        new Label("Please report the bug at:"),
        new TextField {
          text = "https://github.com/Thomsch/pause/issues"
          editable = false
          style = "-fx-background-color: transparent; -fx-background-insets: 0px; -fx-padding: 0px;"
        })
    }
    dialog.getDialogPane.setContent(layout)
    dialog.showAndWait()
  }

  def closeApplication(): Unit = {
    TrayAdapter.removeIcon()
    timer.clean()
    Platform.exit()
  }
}
