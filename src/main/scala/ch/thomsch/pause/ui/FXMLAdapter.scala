package ch.thomsch.pause.ui

import java.io.IOException
import javafx.scene.Parent

import scalafxml.core.{FXMLView, NoDependencyResolver}

/**
  * Convenience class to load FXML stuff
  *
  * @author Thomsch
  */
object FXMLAdapter {
  def loadFXML(file : String) : Parent = {
    val resource = getClass.getResource("/" + file)
    if (resource == null) {
      throw new IOException("Cannot load resource: " + file)
    }
    FXMLView(resource, NoDependencyResolver)
  }
}
