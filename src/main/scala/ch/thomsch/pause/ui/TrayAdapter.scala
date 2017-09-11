package ch.thomsch.pause.ui

import java.awt._
import java.awt.event.{ActionEvent, ActionListener}

import ch.thomsch.pause.Pause

import scalafx.stage.Stage

/**
  * The application access the tray from here. It offers functionalities and hides the underlying awt tray system.
  * @author Thomsch
  */
object TrayAdapter {
  val image: Image = Toolkit.getDefaultToolkit.getImage(getClass.getResource("/icons/icon-tray.png"))

  var trayMenu = new PopupMenu
  val trayIcon : TrayIcon  = new TrayIcon(image, "Pause", trayMenu)
  var stage : Stage = null
  val tray : SystemTray = SystemTray.getSystemTray

  def initialize(): Unit = {
    val exit: MenuItem = new MenuItem("Exit")
    val controls: MenuItem = new MenuItem("Settings...")
    controls.setFont(Font.decode(null).deriveFont(Font.BOLD))

    trayMenu.add(controls)
    trayMenu.addSeparator()
    trayMenu.add(exit)

    val listener : ActionListener= new ActionListener() {
      def actionPerformed(arg0 : ActionEvent ) {
        Pause.closeApplication()
      }
    }

    val settingsListener : ActionListener = new ActionListener {
      override def actionPerformed(e: ActionEvent) : Unit = {
        if(Pause.stage.isShowing) Pause.hide else Pause.show
      }
    }

    trayIcon.addActionListener(settingsListener)
    controls.addActionListener(settingsListener)
    exit.addActionListener(listener)

    tray.add(trayIcon)
  }

  def removeIcon(): Unit = {
    tray.remove(trayIcon)
  }

  def displayNotification(message : String): Unit = {
    trayIcon.displayMessage("", message, TrayIcon.MessageType.INFO)
  }

}
