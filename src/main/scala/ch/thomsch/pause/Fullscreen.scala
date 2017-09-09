package ch.thomsch.pause

import javafx.scene.{Parent, Scene}

import scalafx.Includes._
import scalafx.application.Platform
import scalafx.scene.paint.Color
import scalafx.stage.{Stage, StageStyle}

class Fullscreen {
  def show(): Unit = {
    Platform.runLater {
      val root: Parent = FXMLAdapter.loadFXML("fullscreen.fxml")
      val stage: Stage = createStage(root)
      val animation = new PauseTransition(root)

      Fullscreen.stage = Some(stage)
      animation.play()
      stage.show()
    }
  }

  private def createStage(root: Parent) = {
    new Stage {
      scene = new Scene(root)
      maximized = true
      alwaysOnTop = true
      scene.get().setFill(Color.Transparent)
      initStyle(StageStyle.Transparent)
    }
  }
}

object Fullscreen {
  var stage: Option[Stage] = None
}
