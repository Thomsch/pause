/*
 * Copyright (c) 2011-2015, ScalaFX Project
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the ScalaFX Project nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE SCALAFX PROJECT OR ITS CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package hello

import java.awt.TrayIcon.MessageType
import java.awt.event.{ActionEvent, ActionListener}
import java.awt._
import javafx.event.EventHandler

import scalafx.application.{Platform, JFXApp}
import scalafx.application.JFXApp.PrimaryStage
import scalafx.geometry.Insets
import scalafx.scene.Scene
import scalafx.scene.control.MenuItem
import scalafx.scene.control.Button
import scalafx.scene.effect.DropShadow
import scalafx.scene.layout.HBox
import scalafx.scene.paint.Color
import scalafx.scene.paint.Color._
import scalafx.scene.paint._
import scalafx.scene.text.Text

object ScalaFXHelloWorld extends JFXApp {
  val image : Image  = Toolkit.getDefaultToolkit().getImage("icon.png");
  var popup = new PopupMenu()
  val trayIcon : TrayIcon  = new TrayIcon(image, "Keep eyes off the screen from time to time", popup)

  stage = new PrimaryStage {
    title = "ScalaFX Hello World"
    scene = new Scene {
      fill = Color.rgb(38, 38, 38)
      content = new HBox {

        padding = Insets(50, 80, 50, 80)
        children = Seq(
          new Button() {
            text = "Notification !"
            onAction = new EventHandler[javafx.event.ActionEvent] {
              override def handle(event: javafx.event.ActionEvent): Unit = trayIcon.displayMessage("Hello, World", "notification demo", MessageType.INFO);
            }
          },
          new Text {
            text = "Scala"
            style = "-fx-font: normal bold 100pt sans-serif"
            fill = new LinearGradient(
              endX = 0,
              stops = Stops(Red, DarkRed))
          },
          new Text {
            text = "FX"
            style = "-fx-font: italic bold 100pt sans-serif"
            fill = new LinearGradient(
              endX = 0,
              stops = Stops(White, DarkGray)
            )
            effect = new DropShadow {
              color = DarkGray
              radius = 15
              spread = 0.25
            }
          }
        )
      }
    }

    if (SystemTray.isSupported()) {
      var tray : SystemTray = SystemTray.getSystemTray();

      val item: MenuItem = new MenuItem("Exit")

//      popup.add(item)


//      ActionListener listener = new ActionListener() {
//        @Override
//        public void actionPerformed(java.awt.event.ActionEvent arg0) {
//          // TODO Auto-generated method stub
//          System.exit(0);
//        }
//      };

//      ActionListener listenerTray = new ActionListener() {
//        @Override
//        public void actionPerformed(java.awt.event.ActionEvent arg0) {
//          // TODO Auto-generated method stub
//          primaryStage.hide();
//        }
//      };

      trayIcon.addActionListener(new ActionListener {
        override def actionPerformed(e: ActionEvent): Unit = Platform.runLater(stage.hide())
      })

//      item.addActionListener(listener);

      try{
        tray.add(trayIcon)
      }catch {

        case e : Exception => System.err.println("Can't add to tray")
      }
    } else {
      System.err.println("Tray unavailable");
    }

  }
}

//public class TrayIconDemo {
//
//  public static void main(String[] args) throws AWTException, java.net.MalformedURLException {
//    if (SystemTray.isSupported()) {
//      TrayIconDemo td = new TrayIconDemo();
//      td.displayTray();
//    } else {
//      System.err.println("System tray not supported!");
//    }
//  }

//}
