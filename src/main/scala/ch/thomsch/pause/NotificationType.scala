package ch.thomsch.pause

/**
  * @author Thomsch
  */
object NotificationType extends Enumeration {
  type NotificationType = Value
  val Window, Message = Value

  def getFromString(value: String): Option[NotificationType.Value] = {
    value match {
      case "message" => Some(NotificationType.Message)
      case "window" => Some(NotificationType.Window)
      case _ => None
    }
  }
}
