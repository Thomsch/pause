package ch.thomsch.pause

import javafx.scene.image.Image

/**
  * Created by Thomsch on 28.12.2016.
  */
object Config {
  def getAppIcon = new Image(getClass.getResourceAsStream("/icon-window.png"))
}
