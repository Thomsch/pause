package ch.thomsch.pause

import javafx.beans.property.DoubleProperty

/**
  * @author Thomsch
  * @param time Time to wait until the notification in seconds.
  */
class Command(private val time : Long, private val doubleProperty: DoubleProperty) extends Runnable {

  private var isActive : Boolean = true

  def cancel() = isActive = false

  override def run(): Unit = {
    while (isActive) {
      var counter : Long = 1
      while (isActive && counter < time) {
        Thread.sleep(1000)
        counter += 1

        if (isActive) doubleProperty.set(counter.toFloat / time)
      }

      if (isActive) TrayAdapter.displayNotification("It's time to do a pause !")
      else println("Command " + this + " has been cancelled")
      doubleProperty.set(0.0)
    }
  }
}
