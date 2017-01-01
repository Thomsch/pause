package ch.thomsch.pause

import java.awt._
import java.awt.event.{ActionEvent, ActionListener}

import scalafx.application.Platform
import scalafx.stage.Stage

/**
  * @author Thomsch
  */
object TrayAdapter {
  val image : Image  = Toolkit.getDefaultToolkit.getImage(getClass.getResource("/icon-tray.png"))
  var trayMenu = new PopupMenu
  val trayIcon : TrayIcon  = new TrayIcon(image, "Pause", trayMenu)

  var stage : Stage = null

  def initialize = {
    val tray : SystemTray = SystemTray.getSystemTray

    val exit: MenuItem = new MenuItem("Exit")
    val controls: MenuItem = new MenuItem("Settings...")
    controls.setFont(Font.decode(null).deriveFont(Font.BOLD))

    trayMenu.add(controls)
    trayMenu.addSeparator()
    trayMenu.add(exit)

    val listener : ActionListener= new ActionListener() {
      def actionPerformed(arg0 : ActionEvent ) {
        tray.remove(trayIcon)
        Platform.exit()
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

    try{
      tray.add(trayIcon)
    }catch {
      case e : Exception => System.err.println("Can't add to tray")
    }
  }

  def displayNotification(message : String): Unit = {
    trayIcon.displayMessage("", message, TrayIcon.MessageType.INFO)
  }

}
