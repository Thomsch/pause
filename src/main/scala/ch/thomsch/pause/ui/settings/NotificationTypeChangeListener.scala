package ch.thomsch.pause.ui.settings

import javafx.beans.value.{ChangeListener, ObservableValue}
import javafx.scene.control.Toggle

import ch.thomsch.pause.{Config, NotificationType}

/**
  * @author Thomsch
  */
class NotificationTypeChangeListener() extends ChangeListener[Toggle] {

  override def changed(observable: ObservableValue[_ <: Toggle], oldValue: Toggle, newValue: Toggle): Unit = {
    val value = NotificationType.getFromString(newValue.getUserData.toString.toLowerCase())
    if (value.isDefined) {
      Config.notificationType = value.get
    } else {
      println("Couldn't not update value")
    }
  }
}
