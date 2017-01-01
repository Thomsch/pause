package ch.thomsch.pause

import javafx.beans.property.DoubleProperty

/**
  * @author Thomsch
  * @param time Time to wait until the notification in seconds.
  */
class Command(private val time : Long, private val doubleProperty: DoubleProperty) extends Runnable {

  private var isActive : Boolean = true
  private val refreshRate : Int = 10
  private val total = time * refreshRate
  private val step = 1000 / refreshRate

  def cancel() = isActive = false

  override def run(): Unit = {

    while (isActive) {
      var counter : Long = 1

      while (isActive && counter < total) {
        Thread.sleep(step)
        counter += 1
        if (isActive) doubleProperty.set(counter.toFloat / total)
      }

      if (isActive) TrayAdapter.displayNotification("It's time to do a pause !")
      else println("Command " + this + " has been cancelled")
      doubleProperty.set(0.0)
    }
  }
}
