package ch.thomsch.pause

import java.util.concurrent.{ExecutorService, Executors}

import ch.thomsch.pause.time.Command

import scala.collection.mutable

/**
  * @author Thomsch
  */
class Timer {
  val scheduledExecutor: ExecutorService = Executors.newSingleThreadExecutor()
  val observers: mutable.Set[TimerObserver] = new mutable.HashSet[TimerObserver]()

  var currentTimer: Option[Command] = None

  def start(duration: Long): Unit = {
    currentTimer = Some(new Command(observers, toSeconds(duration)))
    scheduledExecutor.execute(currentTimer.get)
  }

  private def toSeconds(duration: Long): Long = duration * 60

  def clean(): Unit = {
    stop()
    scheduledExecutor.shutdown()
  }

  def stop(): Unit = {
    currentTimer.foreach(command => command.cancel())
  }

  def isRunning: Boolean = currentTimer.isDefined && currentTimer.get.isRunning

  def addObserver(observer: TimerObserver): Boolean = {
    observers.add(observer)
  }
}

object Timer {
  val timer: Timer = new Timer
}
