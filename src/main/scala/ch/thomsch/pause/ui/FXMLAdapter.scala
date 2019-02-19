package ch.thomsch.pause.ui

import java.io.IOException
import javafx.scene.Parent

import scalafxml.core.{FXMLView, NoDependencyResolver}

/**
  * Convenience class to load FXML views
  *
  * @author Thomsch
  */
object FXMLAdapter {

  /**
    * Loads a fxml view.
    *
    * @param file the location of the fxml view
    * @return The [[Parent]] containing the view.
    * @throws IOException when the resource cannot be loaded
    */
  def load(file: String): Parent = {
    val resource = getClass.getResource("/" + file)
    if (resource == null) {
      throw new IOException("Cannot load resource: " + file)
    }
    FXMLView(resource, NoDependencyResolver)
  }
}
