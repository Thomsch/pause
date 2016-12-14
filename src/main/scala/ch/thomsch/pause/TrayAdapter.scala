package ch.thomsch.pause

import java.awt._
import java.awt.event.{ActionEvent, ActionListener}

import ch.thomsch.pause.Pause._

import scalafx.application.Platform

/**
  * @author Thomsch
  */
object TrayAdapter {
  val image : Image  = Toolkit.getDefaultToolkit.getImage("ironGoldUpgrade.png")
  var popup = new PopupMenu
  val trayIcon : TrayIcon  = new TrayIcon(image, "Pause", popup)

  def makeTray = {
    val tray : SystemTray = SystemTray.getSystemTray

    val exit: MenuItem = new MenuItem("Exit")
    val controls: MenuItem = new MenuItem("Open")

    controls.setFont(Font.decode(null).deriveFont(Font.BOLD))
    popup.add(controls)
    popup.addSeparator()
    popup.add(exit)

    val listener : ActionListener= new ActionListener() {
      def actionPerformed(arg0 : ActionEvent ) {
        Platform.exit()
        tray.remove(trayIcon)
      }
    }

    trayIcon.addActionListener(new ActionListener {
      override def actionPerformed(e: ActionEvent): Unit = Platform.runLater(stage.hide())
    })


    exit.addActionListener(listener);

    try{
      tray.add(trayIcon)
    }catch {

      case e : Exception => System.err.println("Can't add to tray")
    }

  }

}
