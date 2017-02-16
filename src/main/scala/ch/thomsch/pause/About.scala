package ch.thomsch.pause


import scalafx.Includes._
import scalafx.scene.Scene
import scalafx.stage.{Stage, StageStyle}

/**
  * @author Thomsch
  */
object About {

  var stage : Option[Stage] = None

  def hide(): Unit = stage.foreach((s : Stage) => s.hide)


  def createUI : Stage = {
    val root = FXMLAdapter.loadFXML("about.fxml")
    stage = Some(new Stage{
      title = "Pause"
      resizable = false
      scene = new Scene(root)
      initStyle(StageStyle.Undecorated)
      icons.add(Config.getAppIcon)
    })
    stage.get
  }
}
