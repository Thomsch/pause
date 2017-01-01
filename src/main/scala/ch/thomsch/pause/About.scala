package ch.thomsch.pause


import scalafx.Includes._
import scalafx.scene.Scene
import scalafx.stage.Stage

/**
  * @author Thomsch
  */
object About {

  def createUI : Stage = {
    val root = FXMLAdapter.loadFXML("about.fxml")
    new Stage{
      title = "Pause"
      resizable = false
      scene = new Scene(root)
      icons.add(Config.getAppIcon)
    }
  }
}
