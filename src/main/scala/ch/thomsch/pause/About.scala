package ch.thomsch.pause

import java.io.IOException
import javafx.scene.{Parent, Scene}

import scalafx.stage.Stage
import scalafxml.core.{FXMLView, NoDependencyResolver}

/**
  * Created by Thomsch on 28.12.2016.
  */
object About {
  def show = {
    val resource = getClass.getResource("about.fxml")
    if (resource == null) {
      throw new IOException("Cannot load resource: about.fxml")
    }

    val root : Parent = FXMLView(resource, NoDependencyResolver)
    val stage = new Stage{
      title = "Pause"
    }
    val scene : Scene = new Scene(root)

    stage.setResizable(false)
    stage.setScene(scene)
    stage.show()
  }
}
