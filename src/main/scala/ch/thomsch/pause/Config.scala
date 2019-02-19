package ch.thomsch.pause

import javafx.scene.image.Image

/**
  * Created by Thomsch on 28.12.2016.
  */
object Config {
  val postpone: Long = 5

  var workDuration: Long = 45

  val appIcon = new Image(getClass.getResourceAsStream("/icons/icon-window.png"))

  var notificationType: NotificationType.Value = NotificationType.Window
}
