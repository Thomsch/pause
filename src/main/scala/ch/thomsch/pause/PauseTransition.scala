package ch.thomsch.pause

import javafx.animation.{Interpolator, Transition}
import javafx.scene.Parent
import javafx.util.Duration

/**
  * @author Thomsch
  */
class PauseTransition(val root: Parent) extends Transition {

  setCycleDuration(Duration.millis(5000))
  setInterpolator(Interpolator.EASE_IN)

  override def interpolate(fraction: Double): Unit = {
    if (fraction > 0.9) stop()
    root.setStyle("-fx-background-color: rgba(255,255, 255, " + f"$fraction%.5f" + ");")
  }
}
